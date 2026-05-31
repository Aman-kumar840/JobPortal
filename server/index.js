const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// 1. Middleware (MUST come before routes so req.body works)
app.use(cors());
app.use(express.json());

// 2. Serve uploaded résumés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Import Routes
const testRoutes = require('./routes/test');
const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');

// 4. Use Routes (No duplicates!)
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationRoutes);

// 5. Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));