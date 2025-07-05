const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
require("dotenv").config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

connectDB();

app.use(cors({
  origin: process.env.FRONT_URL || ['http://localhost:3000', 'http://localhost:3001'], // frontend URLs
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//  Routes
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

module.exports = app;

//hellow