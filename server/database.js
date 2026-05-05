const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

let db;
let pool; // For PostgreSQL (Neon)

async function initDB() {
  const dbType = process.env.DB_TYPE || 'sqlite';

  if (dbType === 'postgres') {
    // PostgreSQL configuration for Neon.tech
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Neon
      }
    });
    console.log('Connected to Neon PostgreSQL');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);

    // Create user_settings table with CASCADE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        theme VARCHAR(50) DEFAULT 'light'
      )
    `);
  } else if (dbType === 'mysql') {
    // MySQL configuration
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log('Connected to MySQL database');
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);
  } else {
    // SQLite configuration
    const dbPath = path.resolve(__dirname, 'database.sqlite');
    db = new sqlite3.Database(dbPath);
    db.run("PRAGMA foreign_keys = ON");
    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL)");
      db.run("CREATE TABLE IF NOT EXISTS user_settings (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, theme TEXT DEFAULT 'light', FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)");
    });
  }
}

async function getUserByEmail(email) {
  const dbType = process.env.DB_TYPE || 'sqlite';
  if (dbType === 'postgres') {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
  } else if (dbType === 'mysql') {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  } else {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

async function createUser(email, hashedPassword) {
  const dbType = process.env.DB_TYPE || 'sqlite';
  if (dbType === 'postgres') {
    const res = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id', [email, hashedPassword]);
    const userId = res.rows[0].id;
    await pool.query('INSERT INTO user_settings (user_id) VALUES ($1)', [userId]);
    return { id: userId };
  } else if (dbType === 'mysql') {
    const [result] = await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    const userId = result.insertId;
    return { id: userId };
  } else {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
        if (err) return reject(err);
        const userId = this.lastID;
        db.run('INSERT INTO user_settings (user_id) VALUES (?)', [userId], (err2) => {
          if (err2) reject(err2);
          else resolve({ id: userId });
        });
      });
    });
  }
}

module.exports = { initDB, getUserByEmail, createUser };
