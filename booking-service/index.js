require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const bookingRoutes = require('./routes/bookingRoutes'); // Import booking routes

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("MongoDB Connection Error:", err));

// Routes
app.use('/api/bookings', bookingRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('Booking Service is running!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Booking service is running on port ${PORT}`);
});
