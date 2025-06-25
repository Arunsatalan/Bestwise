const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Try to use environment variable, fallback to local MongoDB
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";
    await mongoose.connect(`${mongoURI}/bestwise`);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed", err.message);
    // Don't exit the process, just log the error
    console.log("Continuing without database connection...");
  }
};

module.exports = connectDB;