const applications = require('../models/applications.json');

exports.applyHousing = (req, res) => {
  const { email, preference, fullName, level } = req.body;
  const newApp = { id: Date.now(), email, fullName, level, preference, status: 'Pending' };
  applications.push(newApp);
  res.status(201).json({ message: 'Application submitted', application: newApp });
};

exports.viewApplication = (req, res) => {
  const { email } = req.params;
  const app = applications.find(a => a.email === email);
  if (!app) return res.status(404).json({ message: 'No application found' });
  res.json(app);
};
