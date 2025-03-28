const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/user");

const router = express.Router();
const JWT_SECRET = "your_secret_key"; // Replace with env variable in production

// ✅ Create a new user (with duplicate email check & password hashing)
router.post("/", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "User created successfully!", user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ User Login Route (Step 5)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful!", token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get Events from Event Service
router.get("/events", async (req, res) => {
    try {
        const eventResponse = await axios.get("http://localhost:5001/api/events");
        res.json(eventResponse.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching events from Event Service" });
    }
});

// ✅ Get user by ID
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

// ✅ Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from MongoDB
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
