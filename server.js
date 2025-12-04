const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./utils/logger');
const initializeAdmin = require('./utils/initializeAdmin');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// ---------------- API ROUTES ----------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/results', require('./routes/results'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/syllabus', require('./routes/syllabus'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/pdf', require('./routes/pdf'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    message: 'ThinkCivil Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ---------------- SERVE ANGULAR BUILD (IMPORTANT FOR RAILWAY) ----------------

// Serve static Angular files
app.use(express.static(path.join(__dirname, 'dist/thinkcivil-frontend')));

// Handle SPA (send index.html for ANY non-API route)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/thinkcivil-frontend/index.html'));
});

// ---------------- ERROR HANDLERS ----------------
app.use(notFound);
app.use(errorHandler);

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Initialize admin user
  initializeAdmin();
});
