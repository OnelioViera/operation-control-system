require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import automation system
const { initializeAutomations } = require('./automation/automationEngine');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/production', require('./routes/production'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Lindsay Precast Operations API is running',
    version: '2.1.4',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize automation system after server starts
  if (mongoose.connection.readyState === 1) {
    initializeAutomations();
  } else {
    mongoose.connection.once('open', () => {
      initializeAutomations();
    });
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;

