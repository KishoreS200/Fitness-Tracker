const express = require("express")
const router = express.Router()
const Workout = require("../models/workoutModel")
const User = require("../models/userModel")

// Get all workouts
router.get("/", async (req, res) => {
  try {
    const { difficulty, category } = req.query

    // Build query
    const query = {}
    if (difficulty) {
      query.difficulty = difficulty
    }
    if (category) {
      query.categories = category
    }

    const workouts = await Workout.find(query)

    res.json(workouts)
  } catch (error) {
    console.error("Error fetching workouts:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get workout by ID
router.get("/:id", async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" })
    }

    res.json(workout)
  } catch (error) {
    console.error("Error fetching workout:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new workout
router.post("/", async (req, res) => {
  try {
    const workout = new Workout(req.body)
    await workout.save()

    res.status(201).json(workout)
  } catch (error) {
    console.error("Error creating workout:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update workout
router.patch("/:id", async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" })
    }

    // Automatically update user stats if workout is completed
    if (
      req.body.completed === true &&
      workout.userId
    ) {
      await User.findByIdAndUpdate(
        workout.userId,
        { $inc: { "stats.workouts": 1 } }
      )
    }

    res.json(workout)
  } catch (error) {
    console.error("Error updating workout:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
