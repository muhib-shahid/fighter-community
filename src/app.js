const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const fighterRoutes = require('./routes/fighters');
const manufacturerRoutes = require('./routes/manufacturers');
const weaponRoutes = require('./routes/weapons');
const hangarRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const commentRoutes = require('./routes/comments');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/fighters', fighterRoutes);
app.use('/api/manufacturers', manufacturerRoutes);
app.use('/api/weapons', weaponRoutes);
app.use('/api/users', hangarRoutes);        // because hangar routes are under /api/users/profile, etc.
app.use('/api/reviews', reviewRoutes);
app.use('/api/comments', commentRoutes);

// Fallback for API 404
// Catch-all: serve index.html for non-API routes, else 404
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ success: false, error: 'API route not found' });
  } else {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  }
});

module.exports = app;