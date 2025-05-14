import { connectToMongoDB } from "@/lib/mongodb"
import { CompletedMission } from "@/models"
import { workoutService } from "@/services/workout-service"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("Workout completion API called")
  try {
    // Connect to MongoDB first
    console.log("Attempting to connect to MongoDB...")
    const connection = await connectToMongoDB()
    if (!connection) {
      console.error("Failed to connect to MongoDB")
      return NextResponse.json({ 
        error: "Database connection failed",
        details: "Could not establish connection to MongoDB"
      }, { status: 500 })
    }
    console.log("Successfully connected to MongoDB")
    
    // Parse request body
    const body = await request.json()
    console.log("Request body:", body)
    const { workoutId, userId, xpGained, exercisesCompleted } = body

    // Validate required fields
    if (!workoutId || !userId || !xpGained || !exercisesCompleted) {
      console.error("Missing required fields:", { workoutId, userId, xpGained, exercisesCompleted })
      return NextResponse.json(
        { 
          error: "Missing required fields",
          details: "All fields (workoutId, userId, xpGained, exercisesCompleted) are required"
        },
        { status: 400 }
      )
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
      console.error("Invalid workout ID:", workoutId)
      return NextResponse.json(
        { 
          error: "Invalid workout ID",
          details: "The provided workout ID is not a valid MongoDB ObjectId"
        },
        { status: 400 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid user ID:", userId)
      return NextResponse.json(
        { 
          error: "Invalid user ID",
          details: "The provided user ID is not a valid MongoDB ObjectId"
        },
        { status: 400 }
      )
    }

    try {
      // Update the workout with completion data
      console.log("Finding workout:", workoutId)
      const workout = await workoutService.findById(workoutId)
      if (!workout) {
        console.error("Workout not found:", workoutId)
        return NextResponse.json(
          { 
            error: "Workout not found",
            details: `No workout found with ID: ${workoutId}`
          },
          { status: 404 }
        )
      }

      // Add completion data
      console.log("Adding completion data to workout")
      workout.completedBy = workout.completedBy || []
      workout.completedBy.push({
        userId: new mongoose.Types.ObjectId(userId), // Convert to ObjectId
        completedAt: new Date(),
        xpGained,
        exercisesCompleted
      })

      // Save the updated workout
      console.log("Saving updated workout")
      const savedWorkout = await workout.save()
      if (!savedWorkout) {
        throw new Error("Failed to save workout")
      }

      // Record completed mission
      await CompletedMission.create({ userId, missionId: workoutId, completedAt: new Date() })

      console.log("Workout completion recorded successfully")
      return NextResponse.json({ 
        success: true, 
        message: "Workout completion recorded successfully",
        workout: savedWorkout
      })
    } catch (error) {
      console.error("Error processing workout completion:", error)
      return NextResponse.json(
        { 
          error: "Error processing workout completion",
          details: error instanceof Error ? error.message : "Unknown error"
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in workout completion API:", error)
    return NextResponse.json(
      { 
        error: "Failed to record workout completion",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
} 