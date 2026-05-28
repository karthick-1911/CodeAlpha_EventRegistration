const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ROUTE 1: Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email');
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ROUTE 2: Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ROUTE 3: Create an event (login required)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, date, location, totalSeats } = req.body;

    const event = new Event({
      title,
      description,
      date,
      location,
      totalSeats,
      availableSeats: totalSeats,
      createdBy: req.userId
    });

    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ROUTE 4: Delete an event (login required)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;