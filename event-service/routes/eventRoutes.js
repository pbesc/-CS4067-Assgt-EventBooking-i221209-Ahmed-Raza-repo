const express = require("express");
const Event = require("../models/Event");
const axios = require("axios");

const router = express.Router();

// Create an event
router.post("/", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all events
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Get an event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an event
router.put("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an event
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/availability", async (req, res) => {
  try {
      const event = await Event.findById(req.params.id);
      if (!event) {
          return res.status(404).json({ error: "Event not found" });
      }

      // Mocking event capacity (Assuming each event has max 100 bookings)
      const maxCapacity = 100;

      // Count existing bookings for this event
      const response = await axios.get(`http://localhost:5002/api/bookings`);
      const bookings = response.data.filter(booking => booking.eventId === req.params.id);

      const availableSpots = maxCapacity - bookings.length;

      res.status(200).json({ eventId: req.params.id, availableSpots });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
module.exports = router;
