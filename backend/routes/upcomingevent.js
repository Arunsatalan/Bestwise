const express = require("express");
const {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/upcomingEventController.js");

const router = express.Router();

// Get featured events
router.get("/", getEvents);

// Full CRUD endpoints
router.get("/all", getEvents);
router.post("/", addEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
