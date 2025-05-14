const express = require("express")
const router = express.Router()
const User = require("../models/userModel")

// Get user by email
router.get("/", async (req, res) => {
  try {
    const { email } = req.query

    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new user
router.post("/", async (req, res) => {
  try {
    const { email } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" })
    }

    const user = new User(req.body)
    await user.save()

    res.status(201).json(user)
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user
router.patch("/", async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOneAndUpdate({ email }, req.body, { new: true, runValidators: true })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOneAndUpdate(
      { email },
      { lastLogin: new Date() },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Error during login:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
