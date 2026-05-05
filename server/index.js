const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { initDB, getUserByEmail, createUser } = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

app.use(cors());
app.use(express.json());

// Initialize Database
initDB();

// Root route
app.get('/', (req, res) => {
  res.send('Agent API is running on Vercel Serverless!');
});

// Register route
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await createUser(email, hashedPassword);
    const token = jwt.sign({ id: result.id, email: email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created', token, email });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// Dashboard route
app.get('/api/dashboard', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ 
      user: { id: decoded.id, email: decoded.email }, 
      data: { total_users: 1250, active_sessions: 42, server_uptime: '99.9%' } 
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// IMPORTANT: Export the app for Vercel
module.exports = app;

// Only listen if not on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
