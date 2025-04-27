const fs = require('fs');
const path = require('path');
const usersFile = path.join(__dirname, '../data/users.json');

function loadUsers() {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile);
  return JSON.parse(data);
}

exports.loginUser = (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  const users = loadUsers();
  const user = users.find(
    u => u.email === email && u.password === password && u.role === role
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful', user });
};
