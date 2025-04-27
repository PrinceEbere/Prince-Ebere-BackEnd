// routes/auth.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();


// Path to the users data file
const usersFile = path.join(__dirname, '../data/users.json');

// Hardcoded admin credentials
const adminCredentials = {
  email: "snickersss22@gmail.com",
  password: "Ijeomas1@"
};

// Utility function to read users
function readUsers() {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
  }
  const data = fs.readFileSync(usersFile);
  return JSON.parse(data);
}

// Utility function to write users
function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// 🟢 Register Route
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const users = readUsers();
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password // ⚠️ Remember: In production, always hash passwords!
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: 'User registered successfully', user: newUser });
});

// 🟡 Login Route
router.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  // Admin login
  if (
    role === 'admin' &&
    email === adminCredentials.email &&
    password === adminCredentials.password
  ) {
    return res.json({
      message: 'Admin login successful',
      role: 'admin',
      user: { email, role: 'admin' }
    });
  }

  // Student login
  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ message: 'Login successful', role: 'student', user });
});

module.exports = router;
