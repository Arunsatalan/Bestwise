const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
require("dotenv").config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

connectDB();

app.use(cors({
  origin: process.env.FRONT_URL || 'http://localhost:3000', // frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//  Routes
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
<<<<<<< HEAD
=======
app.use('/api/orders', orderRoutes);
>>>>>>> b72d6a6e57ab8402290872919715d1d3ec70ee5a

module.exports = app;

//hellow