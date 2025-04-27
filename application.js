const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const applicationsFile = path.join(__dirname, '../data/applications.json');

// Ensure applications file exists
if (!fs.existsSync(applicationsFile)) {
  fs.writeFileSync(applicationsFile, JSON.stringify([]));
}

// Room structure
const allRooms = {
  "Single Room with AC": Array.from({ length: 10 }, (_, i) => (i + 1).toString()),
  "Double Room with AC": Array.from({ length: 10 }, (_, i) => (i + 11).toString()),
  "Double Room with Fan": Array.from({ length: 10 }, (_, i) => (i + 21).toString())
};

// Submit Application
router.post('/', (req, res) => {
  const { studentId, email, roomType, roomNumber, reason } = req.body;

  if (!studentId || !email || !roomType || !roomNumber || !reason) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const applications = JSON.parse(fs.readFileSync(applicationsFile));
  const isTaken = applications.some(app => app.roomNumber === roomNumber && app.status === 'approved');

  if (isTaken) {
    return res.status(400).json({ message: 'This room has already been taken.' });
  }

  const newApplication = {
    id: Date.now(),
    studentId,
    email,
    roomType,
    roomNumber,
    reason,
    status: 'pending'
  };

  applications.push(newApplication);
  fs.writeFileSync(applicationsFile, JSON.stringify(applications, null, 2));

  res.status(201).json({ message: 'Application submitted successfully.', application: newApplication });
});

// Get Available Rooms
router.get('/available-rooms', (req, res) => {
  const applications = JSON.parse(fs.readFileSync(applicationsFile));
  const takenRooms = new Set(applications.filter(app => app.status === 'approved').map(app => app.roomNumber));

  const available = {};
  for (const type in allRooms) {
    available[type] = allRooms[type].filter(room => !takenRooms.has(room));
  }

  res.json(available);
});

// Get all applications (for Admin)
router.get('/', (req, res) => {
  const applications = JSON.parse(fs.readFileSync(applicationsFile));
  res.json(applications);
});

// Review Application (Approve/Reject)
router.post('/review', (req, res) => {
  const { id, decision } = req.body;

  const applications = JSON.parse(fs.readFileSync(applicationsFile));
  const application = applications.find(app => app.id === id);

  if (!application) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  application.status = decision; // 'approved' or 'rejected'
  fs.writeFileSync(applicationsFile, JSON.stringify(applications, null, 2));

  res.json({ message: `Application ${decision}.` });
});

module.exports = router;
