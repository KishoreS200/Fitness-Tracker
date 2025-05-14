import { connectToMongoDB } from "@/lib/mongodb"
import { missionService } from "@/services/mission-service"
import { workoutService } from "@/services/workout-service"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Connect to MongoDB
  const connection = await connectToMongoDB()
  if (!connection) {
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
  }
  
  // Get query parameters
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const userLevel = parseInt(searchParams.get("userLevel") || "1", 10)
  const userGoal = searchParams.get("userGoal") || "general"

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  // Get user's active missions
  let activeMissions = []
  if (mongoose.Types.ObjectId.isValid(userId)) {
    activeMissions = await missionService.find({ userId, isActive: true })
  } else {
    activeMissions = [
      {
        _id: "507f1f77bcf86cd799439012",
        title: "Strength Training I",
        progress: 50,
        category: "strength",
        isActive: true
      }
    ]
  }
  
  const missionCategories = activeMissions.map(mission => mission.category)

  // Get all workouts
  const workouts = await workoutService.find()
  if (!workouts || workouts.length === 0) {
    return NextResponse.json({ error: "No workouts available" }, { status: 404 })
  }

  // Score each workout based on user profile and active missions
  const scoredWorkouts = workouts.map(workout => {
    let score = 0

    // Score based on difficulty match
    const recommendedDifficulty = userLevel >= 7 ? "advanced" : userLevel >= 3 ? "intermediate" : "beginner"
    if (workout.difficulty === recommendedDifficulty) {
      score += 5
    } else if (
      (recommendedDifficulty === "beginner" && workout.difficulty === "intermediate") ||
      (recommendedDifficulty === "intermediate" && (workout.difficulty === "beginner" || workout.difficulty === "advanced")) ||
      (recommendedDifficulty === "advanced" && workout.difficulty === "intermediate")
    ) {
      score += 3
    }

    // Score based on goal match
    if (userGoal === "weightLoss" && workout.categories.includes("cardio")) {
      score += 3
    } else if (userGoal === "muscleGain" && workout.categories.includes("strength")) {
      score += 3
    } else if (userGoal === "flexibility" && workout.categories.includes("flexibility")) {
      score += 3
    }

    // Score based on active mission alignment
    workout.categories.forEach(category => {
      if (missionCategories.includes(category)) {
        score += 2
      }
    })

    // Add a small random factor for variety
    score += Math.random() * 2

    return { ...workout, aiScore: score }
  })

  // Sort by score and take top 2
  const recommendations = scoredWorkouts
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 2)

  return NextResponse.json(recommendations)
} 