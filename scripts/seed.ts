import mongoose from "mongoose"
import User from "../models/user"
import Mission from "../models/mission"
import Workout from "../models/workout"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/fitness-quest"

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Mission.deleteMany({})
    await Workout.deleteMany({})

    // Create demo user
    const user = await User.create({
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
    })

    // Create missions
    const missions = await Mission.create([
      {
        title: "10K Step Challenge",
        description: "Walk 10,000 steps daily for 7 days",
        difficulty: "medium",
        xp: 200,
        duration: 7,
        category: "cardio",
        isActive: true,
        progress: 71,
        userId: user._id,
      },
      {
        title: "Core Strength Master",
        description: "Complete 5 core workouts this week",
        difficulty: "hard",
        xp: 250,
        duration: 7,
        category: "strength",
        isActive: true,
        progress: 40,
        userId: user._id,
      },
      {
        title: "Flexibility Challenge",
        description: "Do 10 minutes of stretching daily",
        difficulty: "easy",
        xp: 150,
        duration: 7,
        category: "flexibility",
        isActive: false,
        progress: 0,
        userId: user._id,
      },
      {
        title: "Meditation Journey",
        description: "Meditate for 5 minutes daily for 5 days",
        difficulty: "easy",
        xp: 100,
        duration: 5,
        category: "mindfulness",
        isActive: false,
        progress: 0,
        userId: user._id,
      },
      {
        title: "Epic Strength Quest",
        description: "Complete 3 strength workouts and increase weights by 5%",
        difficulty: "epic",
        xp: 350,
        duration: 10,
        category: "strength",
        isActive: false,
        progress: 0,
        userId: user._id,
      },
    ])

    // Create workouts
    const workouts = await Workout.create([
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
    ])

    console.log("Database seeded successfully!")
    console.log(`Created ${missions.length} missions`)
    console.log(`Created ${workouts.length} workouts`)

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seed()
