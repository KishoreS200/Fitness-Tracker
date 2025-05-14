const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const { createServer } = require("http")
const { Server } = require("socket.io")
const userRoutes = require("./routes/userRoutes")
const missionRoutes = require("./routes/missionRoutes")
const workoutRoutes = require("./routes/workoutRoutes")
const aiCoachRoutes = require("./routes/aiCoachRoutes")

// Load environment variables
dotenv.config()

// Create Express app
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
})

const PORT = process.env.PORT || 5000

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Middleware
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)

  // Handle room joining
  socket.on("join", (userId) => {
    socket.join(userId)
    console.log(`Client ${socket.id} joined room ${userId}`)
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id)
  })
})

// Make io accessible to routes
app.set("io", io)

// Routes
app.use("/api/users", userRoutes)
app.use("/api/missions", missionRoutes)
app.use("/api/workouts", workoutRoutes)
app.use("/api/ai-coach", aiCoachRoutes)

// Root route
app.get("/", (req, res) => {
  res.send("Fitness Quest API is running")
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
