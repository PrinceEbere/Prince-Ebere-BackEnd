const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/studentsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const applicationRoutes = require('./routes/application');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/application', applicationRoutes);

module.exports = app;
