const UpcomingEvent = require("../models/UpcomingEvent.js");

// Get all events (optionally filter)
const getEvents = async (req, res) => {
  try {
    const { featured, active } = req.query;

    let filter = {};
    if (featured !== undefined) filter.featured = featured === "true";
    if (active !== undefined) filter.isActive = active === "true";

    const events = await UpcomingEvent.find(filter).sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new event
const addEvent = async (req, res) => {
  try {
    const newEvent = new UpcomingEvent(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await UpcomingEvent.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ error: "Event not found" });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await UpcomingEvent.findByIdAndDelete(id);
    if (!deletedEvent) return res.status(404).json({ error: "Event not found" });
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
};
