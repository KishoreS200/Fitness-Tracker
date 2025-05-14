import { workoutService } from "@/services/workout-service"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get("difficulty")
    const category = searchParams.get("category")

    console.log(`API request for workouts - difficulty: ${difficulty}, category: ${category}`)

    // Build query
    let workouts

    try {
      if (difficulty && category) {
        workouts = await workoutService.findByDifficultyAndCategory(difficulty, category)
      } else if (difficulty) {
        workouts = await workoutService.findByDifficulty(difficulty)
      } else if (category) {
        workouts = await workoutService.findByCategory(category)
      } else {
        workouts = await workoutService.find()
      }

      console.log(`Found ${workouts.length} workouts`)
      return NextResponse.json(workouts)
    } catch (dbError) {
      console.error("Database error fetching workouts:", dbError)

      // Return mock data in development environment
      if (process.env.NODE_ENV === "development") {
        console.log("Returning mock workout data due to database error")
        const mockWorkouts = [
          {
            _id: "mock1",
            title: "Full Body Strength",
            difficulty: "intermediate",
            duration: 45,
            categories: ["strength", "core"],
            exercises: [
              { name: "Push-ups", sets: 3, reps: 12, rest: 60 },
              { name: "Squats", sets: 3, reps: 15, rest: 60 },
              { name: "Plank", sets: 3, reps: 1, rest: 60 },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: "mock2",
            title: "HIIT Cardio Blast",
            difficulty: "advanced",
            duration: 30,
            categories: ["cardio", "endurance"],
            exercises: [
              { name: "Jumping Jacks", sets: 4, reps: 30, rest: 30 },
              { name: "Burpees", sets: 4, reps: 10, rest: 30 },
              { name: "Mountain Climbers", sets: 4, reps: 20, rest: 30 },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]

        return NextResponse.json(mockWorkouts)
      }

      throw dbError
    }
  } catch (error) {
    console.error("Error fetching workouts:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch workouts",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const workout = await workoutService.create(data)
    return NextResponse.json(workout, { status: 201 })
  } catch (error) {
    console.error("Error creating workout:", error)
    return NextResponse.json({ error: "Failed to create workout" }, { status: 500 })
  }
}
