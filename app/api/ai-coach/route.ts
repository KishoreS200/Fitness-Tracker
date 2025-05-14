import { connectToMongoDB } from "@/lib/mongodb"
import { AICoachMessage } from "@/models"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  await connectToMongoDB()
  const { message } = await request.json()

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

  // Try to get userId from cookies (if set by auth)
  let userId = null
  try {
    const cookieStore = await cookies()
    const userEmail = cookieStore.get("userEmail")?.value
    if (userEmail) {
      // Dynamically import User model to avoid circular dependency
      const User = (await import("@/models/user")).default
      const user = await User.findOne({ email: userEmail })
      if (user) userId = user._id
    }
  } catch (e) {
    // Ignore errors, userId will be null
  }

  // Store the message and response in the database
  try {
    await AICoachMessage.create({
      userId,
      message,
      response,
    })
  } catch (e) {
    console.error("Failed to store AI coach message:", e)
  }

  return NextResponse.json({
    text: response,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  })
}
