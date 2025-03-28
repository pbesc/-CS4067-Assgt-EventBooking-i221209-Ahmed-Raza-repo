import React, { useState, useEffect } from "react";

const Dashboard = () => {
  // State for Users, Events, and Bookings
  const [userData, setUserData] = useState({ name: "", email: "", password: "" });
  const [eventData, setEventData] = useState({ name: "", date: "", location: "", userId: "" });
  const [bookingData, setBookingData] = useState({ userId: "", eventId: "" });
  const [events, setEvents] = useState([]);

  // 🟢 Handle Input Changes
  const handleChange = (e, setState) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🟢 Create User
  const createUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      alert("User created successfully!");
      console.log("User Created:", data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // 🟢 Create Event
  const createEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      const data = await res.json();
      alert("Event created successfully!");
      console.log("Event Created:", data);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  // 🟢 Create Booking
  const createBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5002/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      alert("Booking created successfully!");
      console.log("Booking Created:", data);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  // 🔄 Fetch Events to Show Available Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Event Booking Dashboard</h1>

      {/* 🟢 Create User Form */}
      <div>
        <h2>Create User</h2>
        <form onSubmit={createUser}>
          <input type="text" name="name" placeholder="Name" onChange={(e) => handleChange(e, setUserData)} required />
          <input type="email" name="email" placeholder="Email" onChange={(e) => handleChange(e, setUserData)} required />
          <input type="password" name="password" placeholder="Password" onChange={(e) => handleChange(e, setUserData)} required />
          <button type="submit">Create User</button>
        </form>
      </div>

      {/* 🟢 Create Event Form */}
      <div>
        <h2>Create Event</h2>
        <form onSubmit={createEvent}>
          <input type="text" name="name" placeholder="Event Name" onChange={(e) => handleChange(e, setEventData)} required />
          <input type="date" name="date" onChange={(e) => handleChange(e, setEventData)} required />
          <input type="text" name="location" placeholder="Location" onChange={(e) => handleChange(e, setEventData)} required />
          <input type="text" name="userId" placeholder="Organizer User ID" onChange={(e) => handleChange(e, setEventData)} required />
          <button type="submit">Create Event</button>
        </form>
      </div>

      {/* 🟢 Create Booking Form */}
      <div>
        <h2>Create Booking</h2>
        <form onSubmit={createBooking}>
          <input type="text" name="userId" placeholder="User ID" onChange={(e) => handleChange(e, setBookingData)} required />
          <input type="text" name="eventId" placeholder="Event ID" onChange={(e) => handleChange(e, setBookingData)} required />
          <button type="submit">Create Booking</button>
        </form>
      </div>

      {/* 🟢 Available Events List */}
      <div>
        <h2>Available Events</h2>
        {events.length > 0 ? (
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                {event.name} - {event.date} - {event.location} (Organizer: {event.userId})
              </li>
            ))}
          </ul>
        ) : (
          <p>No events available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
