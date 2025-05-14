const express = require("express")
const router = express.Router()
const Mission = require("../models/missionModel")
const User = require("../models/userModel")
const CompletedMission = require("../models/completedMissionModel")

// Get all missions
router.get("/", async (req, res) => {
  try {
    const { isActive, userId } = req.query

    // Build query
    const query = {}
    if (isActive !== undefined) {
      query.isActive = isActive === "true"
    }
    if (userId) {
      query.userId = userId
    }

    const missions = await Mission.find(query).sort({ createdAt: -1 })

    res.json(missions)
  } catch (error) {
    console.error("Error fetching missions:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get mission by ID
router.get("/:id", async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id)

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" })
    }

    res.json(mission)
  } catch (error) {
    console.error("Error fetching mission:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new mission
router.post("/", async (req, res) => {
  try {
    const mission = new Mission(req.body)
    await mission.save()

    // Emit real-time update
    const io = req.app.get("io")
    if (io && mission.userId) {
      io.to(mission.userId.toString()).emit("missionCreated", mission)
    }

    res.status(201).json(mission)
  } catch (error) {
    console.error("Error creating mission:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update mission
router.patch("/:id", async (req, res) => {
  try {
    const mission = await Mission.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" })
    }

    // Handle mission completion
    if (req.body.progress === 100 && mission.userId) {
      // Create completed mission record
      const completedMission = new CompletedMission({
        userId: mission.userId,
        missionId: mission._id,
        title: mission.title,
        description: mission.description,
        difficulty: mission.difficulty,
        xp: mission.xp,
        category: mission.category,
        completedAt: new Date()
      })
      await completedMission.save()

      // Update user stats and XP
      const updatedUser = await User.findByIdAndUpdate(
        mission.userId,
        { 
          $inc: { 
            "stats.missions": 1,
            "xp.current": mission.xp
          }
        },
        { new: true }
      )

      // Emit real-time updates
      const io = req.app.get("io")
      if (io) {
        io.to(mission.userId.toString()).emit("missionCompleted", {
          mission,
          completedMission,
          user: updatedUser
        })
      }
    } else {
      // Emit progress update
      const io = req.app.get("io")
      if (io && mission.userId) {
        io.to(mission.userId.toString()).emit("missionUpdated", mission)
      }
    }

    res.json(mission)
  } catch (error) {
    console.error("Error updating mission:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete mission
router.delete("/:id", async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id)

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" })
    }

    // Emit real-time update
    const io = req.app.get("io")
    if (io && mission.userId) {
      io.to(mission.userId.toString()).emit("missionDeleted", mission._id)
    }

    res.json({ message: "Mission deleted successfully" })
  } catch (error) {
    console.error("Error deleting mission:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
