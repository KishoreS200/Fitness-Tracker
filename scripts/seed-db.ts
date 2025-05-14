import { connectToMongoDB, disconnectFromMongoDB } from "@/lib/mongodb"
import { IUser } from "@/models/user"
import { missionService } from "@/services/mission-service"
import { userService } from "@/services/user-service"
import { workoutService } from "@/services/workout-service"
import mongoose from "mongoose"

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...")
    await connectToMongoDB()
    console.log("Connected to MongoDB")

    // Clear existing data
    console.log("Clearing existing data...")
    await userService.deleteMany({})
    await missionService.deleteMany({})
    await workoutService.deleteMany({})
    console.log("Existing data cleared")

    // Create demo user
    console.log("Creating demo user...")
    const user = await userService.create({
      name: "Alex Fitness",
      email: "alex@example.com",
      level: 7,
      status: "gold",
      badge: "athlete",
      xp: {
        current: 750,
        max: 1000,
      },
      stats: {
        streak: 12,
        missions: 34,
        badges: 40,
      },
    }) as IUser & { _id: mongoose.Types.ObjectId }
    console.log("Demo user created:", user.name)

    // Convert user._id to string to ensure type safety
    const userId = user._id.toString()

    // Create missions
    console.log("Creating missions...")
    const missions = await Promise.all([
      missionService.create({
        title: "10K Step Challenge",
        description: "Walk 10,000 steps daily for 7 days",
        difficulty: "medium",
        xp: 200,
        duration: 7,
        category: "cardio",
        isActive: true,
        progress: 71,
        userId: new mongoose.Types.ObjectId(userId),
      }),
      missionService.create({
        title: "Core Strength Master",
        description: "Complete 5 core workouts this week",
        difficulty: "hard",
        xp: 250,
        duration: 7,
        category: "strength",
        isActive: true,
        progress: 40,
        userId: new mongoose.Types.ObjectId(userId),
      }),
      missionService.create({
        title: "Flexibility Challenge",
        description: "Do 10 minutes of stretching daily",
        difficulty: "easy",
        xp: 150,
        duration: 7,
        category: "flexibility",
        isActive: false,
        progress: 0,
        userId: new mongoose.Types.ObjectId(userId),
      }),
      missionService.create({
        title: "Meditation Journey",
        description: "Meditate for 5 minutes daily for 5 days",
        difficulty: "easy",
        xp: 100,
        duration: 5,
        category: "mindfulness",
        isActive: false,
        progress: 0,
        userId: new mongoose.Types.ObjectId(userId),
      }),
      missionService.create({
        title: "Epic Strength Quest",
        description: "Complete 3 strength workouts and increase weights by 5%",
        difficulty: "epic",
        xp: 350,
        duration: 10,
        category: "strength",
        isActive: false,
        progress: 0,
        userId: new mongoose.Types.ObjectId(userId),
      }),
    ])
    console.log(`Created ${missions.length} missions`)

    // Create workouts
    console.log("Creating workouts...")
    const workouts = await Promise.all([
      workoutService.create({
        title: "Full Body Strength",
        difficulty: "intermediate",
        duration: 45,
        categories: ["strength", "core"],
        exercises: [
          {
            name: "Push-ups",
            sets: 3,
            reps: 12,
            rest: 60,
          },
          {
            name: "Squats",
            sets: 3,
            reps: 15,
            rest: 60,
          },
          {
            name: "Plank",
            sets: 3,
            reps: 1,
            rest: 60,
          },
        ],
      }),
      workoutService.create({
        title: "HIIT Cardio Blast",
        difficulty: "advanced",
        duration: 30,
        categories: ["cardio", "endurance"],
        exercises: [
          {
            name: "Jumping Jacks",
            sets: 4,
            reps: 30,
            rest: 30,
          },
          {
            name: "Burpees",
            sets: 4,
            reps: 10,
            rest: 30,
          },
          {
            name: "Mountain Climbers",
            sets: 4,
            reps: 20,
            rest: 30,
          },
        ],
      }),
      workoutService.create({
        title: "Yoga Flow",
        difficulty: "beginner",
        duration: 60,
        categories: ["flexibility", "mindfulness"],
        exercises: [
          {
            name: "Downward Dog",
            sets: 1,
            reps: 5,
            rest: 10,
          },
          {
            name: "Warrior Pose",
            sets: 1,
            reps: 5,
            rest: 10,
          },
          {
            name: "Child's Pose",
            sets: 1,
            reps: 5,
            rest: 10,
          },
        ],
      }),
      workoutService.create({
        title: "Upper Body Focus",
        difficulty: "intermediate",
        duration: 40,
        categories: ["strength", "arms"],
        exercises: [
          {
            name: "Bicep Curls",
            sets: 3,
            reps: 12,
            rest: 60,
          },
          {
            name: "Tricep Dips",
            sets: 3,
            reps: 12,
            rest: 60,
          },
          {
            name: "Shoulder Press",
            sets: 3,
            reps: 12,
            rest: 60,
          },
        ],
      }),
    ])
    console.log(`Created ${workouts.length} workouts`)

    console.log("Database seeded successfully!")
    await disconnectFromMongoDB()
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    await disconnectFromMongoDB()
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
