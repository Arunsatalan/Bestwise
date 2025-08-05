const mongoose = require("mongoose");

const upcomingEventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  category: { type: String, required: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const UpcomingEvent = mongoose.models.UpcomingEvent || mongoose.model("UpcomingEvent", upcomingEventSchema);
module.exports = UpcomingEvent;
