const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('DB Error:', err));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/events', require('./routes/events'));
app.use('/registrations', require('./routes/registrations'));

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Event Registration System is running!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});