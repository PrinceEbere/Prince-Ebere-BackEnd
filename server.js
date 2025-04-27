const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 

// Ensure 'data' directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });  // Create the 'data' directory if it doesn't exist
}

// API route for submitting an application
app.post('/api/application', (req, res) => {
  const application = req.body;
  const applicationFilePath = path.join(dataDir, 'applications.json');  // Using the dynamically created directory path
  
  // Read the existing applications file
  fs.readFile(applicationFilePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ success: false, message: "Error reading file." });
    }

    const applications = data ? JSON.parse(data) : [];
    
    // Add new application to the list
    applications.push(application);
    
    // Save the updated applications to the file
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
