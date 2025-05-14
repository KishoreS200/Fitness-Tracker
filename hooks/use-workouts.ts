"use client"

import { useEffect, useState } from "react"

// First, let's improve the API_URL handling
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
// Note: Changed default from 5000 to 3000 to match Next.js default port

// Set to true to always use mock data in development
const USE_MOCK_DATA = process.env.NODE_ENV === "development"

export interface Workout {
  _id: string
  title: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: number
  categories: string[]
  exercises?: {
    name: string
    sets: number
    reps: number
    rest: number
  }[]
  createdAt: string
  updatedAt: string
}

// Mock data for development when API is unavailable
const mockWorkouts: Workout[] = [
  {
    _id: "1",
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
    _id: "2",
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
  {
    _id: "3",
    title: "Yoga Flow",
    difficulty: "beginner",
    duration: 60,
    categories: ["flexibility", "mindfulness"],
    exercises: [
      { name: "Downward Dog", sets: 1, reps: 5, rest: 10 },
      { name: "Warrior Pose", sets: 1, reps: 5, rest: 10 },
      { name: "Child's Pose", sets: 1, reps: 5, rest: 10 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function useWorkouts(category?: string, difficulty?: string) {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true)
        setError(null)

        // Use mock data in development
        if (USE_MOCK_DATA) {
          console.log("Using mock workout data for development")
          let filteredWorkouts = [...mockWorkouts]

          if (category) {
            filteredWorkouts = filteredWorkouts.filter((w) => w.categories.includes(category))
          }

          if (difficulty) {
            filteredWorkouts = filteredWorkouts.filter((w) => w.difficulty === difficulty)
          }

          setWorkouts(filteredWorkouts)
          setLoading(false)
          return
        }

        try {
          let url = `${API_URL}/workouts`
          const params = new URLSearchParams()

          if (category) params.append("category", category)
          if (difficulty) params.append("difficulty", difficulty)

          if (params.toString()) url += `?${params.toString()}`
          console.log(`Fetching workouts from: ${url}`)

          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 10000)

          try {
            const response = await fetch(url, {
              signal: controller.signal,
              method: "GET",
              headers: { Accept: "application/json" },
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
              const errorText = await response.text().catch(() => "No error details available")
              console.error(`Server responded with ${response.status}: ${errorText}`)
              throw new Error(`Server responded with ${response.status}: ${errorText}`)
            }

            const data = await response.json()
            if (!Array.isArray(data)) {
              console.error("Invalid response format, expected array:", data)
              throw new Error("Invalid response format from server")
            }

            setWorkouts(data)
          } catch (fetchError: unknown) {
            if (fetchError instanceof Error) {
              if (fetchError.name === "AbortError") {
                console.error("Request timed out after 10 seconds")
                throw new Error("Request timed out. Please try again later.")
              } else if (fetchError.message.includes("Failed to fetch")) {
                console.error("Network error:", fetchError)
                throw new Error("Network error. Please check your connection and try again.")
              } else {
                console.error("Fetch error:", fetchError)
                throw fetchError
              }
            } else {
              console.error("Unknown fetch error:", fetchError)
              throw new Error("An unknown error occurred during fetch.")
            }
          }
        } catch (apiError) {
          console.error("API error:", apiError)

          if (process.env.NODE_ENV === "development") {
            console.log("Using mock workout data due to API error")
            let filteredWorkouts = [...mockWorkouts]

            if (category) {
              filteredWorkouts = filteredWorkouts.filter((w) => w.categories.includes(category))
            }

            if (difficulty) {
              filteredWorkouts = filteredWorkouts.filter((w) => w.difficulty === difficulty)
            }

            setWorkouts(filteredWorkouts)
            return
          }

          throw apiError
        }
      } catch (err: unknown) {
        console.error("Error in fetchWorkouts:", err)

        console.log("Falling back to mock workout data")
        let filteredWorkouts = [...mockWorkouts]

        if (category) {
          filteredWorkouts = filteredWorkouts.filter((w) => w.categories.includes(category))
        }

        if (difficulty) {
          filteredWorkouts = filteredWorkouts.filter((w) => w.difficulty === difficulty)
        }

        setWorkouts(filteredWorkouts)

        setError(
          err instanceof Error
            ? `Could not load workouts: ${err.message}`
            : "Could not load workouts. Using sample data instead.",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [category, difficulty])

  return { workouts, loading, error }
}
