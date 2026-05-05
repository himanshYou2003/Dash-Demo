const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

let db;

async function initDB() {
  if (process.env.DB_TYPE === 'mysql') {
    // MySQL configuration
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log('Connected to MySQL database');
    
    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);

    // Create user_settings table with CASCADE
    await db.execute(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        theme VARCHAR(50) DEFAULT 'light',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
  } else {
    // SQLite configuration
    const dbPath = path.resolve(__dirname, 'database.sqlite');
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) console.error('Error connecting to SQLite', err);
      else console.log('Connected to SQLite database');
    });

    // Enable Foreign Keys in SQLite
    db.run("PRAGMA foreign_keys = ON");

    db.serialize(() => {
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        )
      `);

      // Create user_settings table with CASCADE
      db.run(`
        CREATE TABLE IF NOT EXISTS user_settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          theme TEXT DEFAULT 'light',
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
    });
  }
}

async function getUserByEmail(email) {
  if (process.env.DB_TYPE === 'mysql') {
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
  if (process.env.DB_TYPE === 'mysql') {
    const [result] = await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    const userId = result.insertId;
    // Also create default settings for the user
    await db.execute('INSERT INTO user_settings (user_id) VALUES (?)', [userId]);
    return { id: userId };
  } else {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
        if (err) return reject(err);
        const userId = this.lastID;
        // Also create default settings for the user
        db.run('INSERT INTO user_settings (user_id) VALUES (?)', [userId], (err2) => {
          if (err2) reject(err2);
          else resolve({ id: userId });
        });
      });
    });
  }
}

module.exports = { initDB, getUserByEmail, createUser };
