const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
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

// ROUTE 1: Register for an event
router.post('/', auth, async (req, res) => {
  try {
    const { eventId } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if seats are available
    if (event.availableSeats === 0) {
      return res.status(400).json({ error: 'No seats available' });
    }

    // Check if already registered
    const existing = await Registration.findOne({
      user: req.userId,
      event: eventId,
      status: 'confirmed'
    });
    if (existing) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    // Create registration
    const registration = new Registration({
      user: req.userId,
      event: eventId
    });
    await registration.save();

    // Reduce available seats by 1
    event.availableSeats -= 1;
    await event.save();

    res.status(201).json({
      message: 'Registered successfully',
      registration
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 2: View my registrations
router.get('/my', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.userId })
      .populate('event', 'title date location availableSeats');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ROUTE 3: Cancel registration
router.delete('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Check if this registration belongs to the user
    if (registration.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update status to cancelled
    registration.status = 'cancelled';
    await registration.save();

    // Add the seat back to event
    const event = await Event.findById(registration.event);
    event.availableSeats += 1;
    await event.save();

    res.json({ message: 'Registration cancelled successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;