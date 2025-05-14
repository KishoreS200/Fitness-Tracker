const express = require("express")
const router = express.Router()

// AI Coach response
router.post("/", async (req, res) => {
  try {
    const { message } = req.body

    // In a real app, this would connect to an AI service
    // For now, we'll return some predefined responses

    let response =
      "I'm not sure how to help with that. Could you try asking something about workouts, nutrition, or fitness goals?"

    if (message.toLowerCase().includes("workout")) {
      response =
        "Based on your profile, I recommend focusing on strength training 3 times per week, with cardio sessions on alternate days. Would you like a specific workout plan?"
    } else if (message.toLowerCase().includes("nutrition") || message.toLowerCase().includes("diet")) {
      response =
        "For your fitness goals, I recommend a balanced diet with 30% protein, 40% carbs, and 30% healthy fats. Make sure to stay hydrated and consume enough protein to support muscle recovery."
    } else if (message.toLowerCase().includes("goal") || message.toLowerCase().includes("target")) {
      response =
        "Setting specific, measurable goals is important. Based on your current stats, aiming for a 5% increase in strength over the next month would be challenging but achievable."
    }

    res.json({
      text: response,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    })
  } catch (error) {
    console.error("Error generating AI response:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
