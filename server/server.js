// server.js - Main server file for Socket.io chat application

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config();

// Import modules
const setupSocketHandlers = require("./socket/handlers");
const storage = require("./utils/storage");
const upload = require("./utils/fileUpload");
const { generateToken, verifyToken } = require("./config/jwt");

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  maxHttpBufferSize: 1e8, // 100 MB for file uploads
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Setup Socket.io handlers
setupSocketHandlers(io);

// API routes
app.get("/", (req, res) => {
  res.json({
    message: "Socket.io Chat Server is running",
    version: "1.0.0",
    endpoints: {
      messages: "/api/messages",
      users: "/api/users",
      rooms: "/api/rooms",
      upload: "/api/upload",
    },
  });
});

// Get all messages
app.get("/api/messages", (req, res) => {
  try {
    const { room, limit = 50, offset = 0 } = req.query;
    const messages = storage.getMessages(
      room,
      parseInt(limit),
      parseInt(offset)
    );
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get users
app.get("/api/users", (req, res) => {
  try {
    const users = storage.getAllUsers();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get rooms
app.get("/api/rooms", (req, res) => {
  try {
    const rooms = storage.getAllRooms();
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search messages
app.get("/api/messages/search", (req, res) => {
  try {
    const { query, room } = req.query;
    if (!query) {
      return res
        .status(400)
        .json({ success: false, error: "Query parameter is required" });
    }
    const messages = storage.searchMessages(query, room);
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// File upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      file: {
        url: fileUrl,
        name: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate JWT token (for authentication)
app.post("/api/auth/login", (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res
        .status(400)
        .json({ success: false, error: "Username is required" });
    }

    const token = generateToken({ username });
    res.json({ success: true, token, username });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify JWT token
app.post("/api/auth/verify", (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, error: "Token is required" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    res.json({ success: true, user: decoded });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    stats: {
      users: storage.getAllUsers().length,
      rooms: storage.getAllRooms().length,
      messages: storage.messages.length,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Socket.io Chat Server running on port ${PORT}`);
  console.log(
    `✅ Client URL: ${process.env.CLIENT_URL || "http://localhost:5173"}`
  );
  console.log(`✅ Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

module.exports = { app, server, io };
