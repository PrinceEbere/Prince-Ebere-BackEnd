const express = require('express');
const cors = require('cors'); // Allow Cross-Origin Requests
const path = require('path');
const fs = require('fs'); // Required to read and write to application.json
const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow Cross-Origin Requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// Routes
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/application'); // If you have additional routes related to applications

app.use('/api/auth', authRoutes);
app.use('/api/application', applicationRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API route for submitting an application
app.post('/api/application', (req, res) => {
  const application = req.body;

  // Load existing applications from application.json (in 'data' folder)
  const applicationFilePath = path.join(__dirname, 'data', 'application.json');

  fs.readFile(applicationFilePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ success: false, message: "Error reading file." });
    }

    const applications = data ? JSON.parse(data) : [];
    
    // Add new application to the list
    applications.push(application);

    // Save the updated applications to application.json (in 'data' folder)
    fs.writeFile(applicationFilePath, JSON.stringify(applications, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error saving application." });
      }
      
      // Respond with success message
      res.json({ success: true, message: "Application submitted successfully!" });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
