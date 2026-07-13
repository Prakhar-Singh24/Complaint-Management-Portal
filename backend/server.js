// Fix DNS resolution issue with MongoDB Atlas on some Windows/mobile networks
const dns = require("node:dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

const complaintRoutes = require("./routes/complaintRoutes");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const adminRoutes = require("./routes/adminRoutes");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("Complaint Management API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});