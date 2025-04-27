const applications = require('../models/applications.json');

exports.getAllApplications = (req, res) => {
  res.json(applications);
};

exports.processApplication = (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'Accepted' or 'Rejected'
  const app = applications.find(a => a.id == id);
  if (!app) return res.status(404).json({ message: 'Application not found' });

  app.status = action;
  res.json({ message: `Application ${action}` });
};
