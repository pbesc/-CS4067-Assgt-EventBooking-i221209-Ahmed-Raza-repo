const express = require("express");
const axios = require("axios");
const User = require("../models/user");

const router = express.Router();
// ✅ Create a new user (with duplicate email check)
router.post("/", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // ✅ Check if user already exists with the same email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        const newUser = new User({ name, email, password, role });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get Events from Event Service (Move this above user ID route)
router.get("/events", async (req, res) => {
    try {
        const eventResponse = await axios.get("http://localhost:5001/api/events");
        res.json(eventResponse.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching events from Event Service" });
    }
});

// ✅ Get user by ID (This must be after /events)
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
