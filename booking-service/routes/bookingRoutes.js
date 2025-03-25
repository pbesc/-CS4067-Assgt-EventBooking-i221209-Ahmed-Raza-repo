const express = require("express");
const axios = require("axios"); // Import Axios for API calls
const Booking = require("../models/booking");

const router = express.Router();  // ✅ Define router at the top

// Create a booking
router.post("/", async (req, res) => {
    try {
        const { userId, eventId, status } = req.body;

        // ✅ Check if the user already booked this event
        const existingBooking = await Booking.findOne({ userId, eventId });
        if (existingBooking) {
            return res.status(400).json({ error: "User has already booked this event" });
        }

        // ✅ Validate User
        let userResponse;
        try {
            userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`);
            console.log("✅ User API Response:", userResponse.data);
        } catch (err) {
            console.error("❌ User API Failed:", err.response ? err.response.data : err.message);
            return res.status(500).json({ error: "User API failed: " + (err.response ? err.response.data : err.message) });
        }

        // ✅ Validate Event
        let eventResponse;
        try {
            eventResponse = await axios.get(`http://localhost:5001/api/events/${eventId}`);
            console.log("✅ Event API Response:", eventResponse.data);
        } catch (err) {
            console.error("❌ Event API Failed:", err.response ? err.response.data : err.message);
            return res.status(500).json({ error: "Event API failed: " + (err.response ? err.response.data : err.message) });
        }

        // ✅ Validate Event Availability
        let availabilityResponse;
        try {
            availabilityResponse = await axios.get(`http://localhost:5001/api/events/${eventId}/availability`);
            console.log("✅ Event Availability:", availabilityResponse.data);
            if (availabilityResponse.data.availableSpots <= 0) {
                return res.status(400).json({ error: "Event is fully booked" });
            }
        } catch (err) {
            console.error("❌ Availability Check Failed:", err.response ? err.response.data : err.message);
            return res.status(500).json({ error: "Availability API failed: " + (err.response ? err.response.data : err.message) });
        }

        // ✅ Save Booking in Database
        const booking = new Booking({ userId, eventId, status });
        await booking.save();

        // ✅ Send Notification
        try {
            await axios.post("http://localhost:5003/api/notifications", {
                userId,
                message: `Your booking for '${eventResponse.data.name}' has been confirmed!`
            });
            console.log("✅ Notification Sent!");
        } catch (err) {
            console.error("❌ Notification API Failed:", err.response ? err.response.data : err.message);
        }

        res.status(201).json(booking);
    } catch (error) {
        console.error("🔥 ERROR:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Get all bookings
router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Export the router
module.exports = router;
