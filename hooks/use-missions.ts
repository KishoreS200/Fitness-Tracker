"use client"

import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"

// Define the API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// Set to true to always use mock data in development
const USE_MOCK_DATA = process.env.NODE_ENV === "development"

export interface Mission {
  _id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard" | "epic"
  xp: number
  duration: number
  category: string
  isActive: boolean
  progress: number
  userId: string
  createdAt: string
  updatedAt: string
}

// Mock data for development when API is unavailable
const mockMissions: Mission[] = [
  {
    _id: "1",
    title: "10K Step Challenge",
    description: "Walk 10,000 steps daily for 7 days",
    difficulty: "medium",
    xp: 200,
    duration: 7,
    category: "cardio",
    isActive: true,
    progress: 0, // Start with 0 progress
    userId: "mock123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Core Strength Master",
    description: "Complete 5 core workouts this week",
    difficulty: "hard",
    xp: 250,
    duration: 7,
    category: "strength",
    isActive: true,
    progress: 0, // Start with 0 progress
    userId: "mock123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "Flexibility Challenge",
    description: "Do 10 minutes of stretching daily",
    difficulty: "easy",
    xp: 150,
    duration: 7,
    category: "flexibility",
    isActive: false,
    progress: 0,
    userId: "mock123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    title: "Meditation Journey",
    description: "Meditate for 5 minutes daily for 5 days",
    difficulty: "easy",
    xp: 100,
    duration: 5,
    category: "mindfulness",
    isActive: false,
    progress: 0,
    userId: "mock123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "5",
    title: "Epic Strength Quest",
    description: "Complete 3 strength workouts and increase weights by 5%",
    difficulty: "epic",
    xp: 350,
    duration: 10,
    category: "strength",
    isActive: false,
    progress: 0,
    userId: "mock123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Create a copy of the mock missions for manipulation
const mockMissionsCopy = [...mockMissions]

export function useMissions(isActive?: boolean) {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, updateXP } = useAuth()

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true)
        setError(null)

        // If user is not available yet, wait or use mock data
        if (!user) {
          if (USE_MOCK_DATA) {
            console.log("User not available yet, using mock mission data")
            // Filter missions based on isActive parameter
            const filteredMissions =
              isActive !== undefined ? mockMissionsCopy.filter((m) => m.isActive === isActive) : mockMissionsCopy

            setMissions(filteredMissions)
          }
          return
        }

        // If we're in development mode, use mock data
        if (USE_MOCK_DATA) {
          console.log("Using mock mission data for development")
          // Filter missions based on isActive parameter
          const filteredMissions =
            isActive !== undefined ? mockMissionsCopy.filter((m) => m.isActive === isActive) : mockMissionsCopy

          setMissions(filteredMissions)
          return
        }

        try {
          // Build the URL with query parameters
          let url = `${API_URL}/missions`
          const params = new URLSearchParams()

          if (isActive !== undefined) {
            params.append("isActive", isActive.toString())
          }

          // Only add userId if it exists and is a valid string or object
          if (user && user._id) {
            if (typeof user._id === "string") {
              params.append("userId", user._id)
            } else if (typeof user._id === "object" && user._id !== null) {
              // Handle MongoDB ObjectId case
              params.append("userId", (user._id as { toString: () => string }).toString())
            }
          }

          if (params.toString()) {
            url += `?${params.toString()}`
          }

          console.log("Fetching missions from:", url)

          // Fetch missions from API with a timeout
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

          const response = await fetch(url, { signal: controller.signal })
          clearTimeout(timeoutId)

          if (!response.ok) {
            const errorText = await response.text()
            console.error("Server response:", errorText)
            throw new Error(`Failed to fetch missions: ${response.status}`)
          }

          const data = await response.json()

          // Validate that we got an array back
          if (!Array.isArray(data)) {
            console.error("Invalid response format, expected array:", data)
            throw new Error("Invalid response format")
          }

          setMissions(data)
        } catch (err) {
          console.error("Error fetching missions:", err)

          // For development or when API is unavailable, use mock data
          console.log("Using mock mission data due to API error")
          const filteredMissions =
            isActive !== undefined ? mockMissionsCopy.filter((m) => m.isActive === isActive) : mockMissionsCopy

          setMissions(filteredMissions)

          // Set a user-friendly error message
          const errorMessage =
            err instanceof Error
              ? `Failed to load missions: ${err.message}`
              : "Failed to load missions. Please try again later."

          setError(errorMessage)
        }
      } catch (err) {
        console.error("Unexpected error in fetchMissions:", err)

        // Use mock data as a fallback
        const filteredMissions =
          isActive !== undefined ? mockMissionsCopy.filter((m) => m.isActive === isActive) : mockMissionsCopy

        setMissions(filteredMissions)

        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchMissions()
  }, [user, isActive])

  const acceptMission = async (missionId: string) => {
    if (!user) return false

    try {
      setError(null)

      // If we're in development mode, update the mock data
      if (USE_MOCK_DATA) {
        console.log("Using mock data for acceptMission")

        // Find the mission in our copy
        const missionIndex = mockMissionsCopy.findIndex((m) => m._id === missionId)

        if (missionIndex !== -1) {
          // Update the mission to be active
          mockMissionsCopy[missionIndex] = {
            ...mockMissionsCopy[missionIndex],
            isActive: true,
          }

          // Update the missions state based on the current filter
          if (isActive === false) {
            // If we're viewing inactive missions, remove this one
            setMissions((prev) => prev.filter((m) => m._id !== missionId))
          } else if (isActive === true) {
            // If we're viewing active missions, add this one
            setMissions((prev) => [...prev, mockMissionsCopy[missionIndex]])
          } else {
            // If no filter, update in place
            setMissions([...mockMissionsCopy])
          }
        }

        return true
      }

      try {
        // Update mission via API
        const response = await fetch(`${API_URL}/missions/${missionId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: true,
            userId: user._id,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to update mission: ${response.status}`)
        }

        const updatedMission = await response.json()

        // Update local state
        if (isActive === false) {
          setMissions((prev) => prev.filter((m) => m._id !== missionId))
        } else {
          if (isActive === true) {
            setMissions((prev) => [...prev, updatedMission])
          } else {
            setMissions((prev) => prev.map((mission) => (mission._id === missionId ? updatedMission : mission)))
          }
        }

        return true
      } catch (err) {
        // For development, update local state when API is unavailable
        if (process.env.NODE_ENV === "development") {
          console.log("Using mock data for acceptMission due to API error")

          // Find the mission in our copy
          const missionIndex = mockMissionsCopy.findIndex((m) => m._id === missionId)

          if (missionIndex !== -1) {
            // Update the mission to be active
            mockMissionsCopy[missionIndex] = {
              ...mockMissionsCopy[missionIndex],
              isActive: true,
            }

            // Update the missions state based on the current filter
            if (isActive === false) {
              // If we're viewing inactive missions, remove this one
              setMissions((prev) => prev.filter((m) => m._id !== missionId))
            } else if (isActive === true) {
              // If we're viewing active missions, add this one
              setMissions((prev) => [...prev, mockMissionsCopy[missionIndex]])
            } else {
              // If no filter, update in place
              setMissions([...mockMissionsCopy])
            }
          }

          return true
        }

        throw err
      }
    } catch (err) {
      console.error("Error accepting mission:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      return false
    }
  }

  const updateProgress = async (missionId: Mission["_id"], progress: number) => {
    if (!user) {
      setError("You must be logged in to update mission progress")
      return false
    }

    // Validate progress value
    if (progress < 0 || progress > 100) {
      setError("Progress must be between 0 and 100")
      return false
    }

    try {
      setError(null)

      // If we're in development mode, update the mock data
      if (USE_MOCK_DATA) {
        console.log("Using mock data for updateProgress")

        // Find the mission in our copy
        const missionIndex = mockMissionsCopy.findIndex((m) => m._id === missionId)

        if (missionIndex === -1) {
          setError("Mission not found")
          return false
        }

        const mission = mockMissionsCopy[missionIndex]
        const oldProgress = mission.progress

        // Update the mission progress
        mockMissionsCopy[missionIndex] = {
          ...mockMissionsCopy[missionIndex],
          progress,
        }

        // Update the missions state
        setMissions((prev) => prev.map((mission) => (mission._id === missionId ? { ...mission, progress } : mission)))

        // If progress is 100% and it wasn't before, update user XP
        if (progress === 100 && oldProgress < 100) {
          const xpGained = mockMissionsCopy[missionIndex].xp
          try {
            // Update the user's XP
            await updateXP(xpGained)
            console.log(`User gained ${xpGained} XP for completing mission!`)
          } catch (xpError) {
            console.error("Error updating XP:", xpError)
            setError("Failed to update XP. Please try again.")
            return false
          }
        }

        return true
      }

      try {
        // First get the current mission to check its progress
        const getMissionResponse = await fetch(`${API_URL}/missions/${missionId}`)

        if (!getMissionResponse.ok) {
          throw new Error(`Failed to fetch mission: ${getMissionResponse.status}`)
        }

        const currentMission = await getMissionResponse.json() as Mission
        const oldProgress = currentMission.progress

        // Update mission via API
        const updateResponse = await fetch(`${API_URL}/missions/${missionId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ progress }),
        })

        if (!updateResponse.ok) {
          throw new Error(`Failed to update mission progress: ${updateResponse.status}`)
        }

        const updatedMission = await updateResponse.json() as Mission

        // Update local state
        setMissions((prev) => prev.map((mission) => (mission._id === missionId ? updatedMission : mission)))

        // If progress is 100% and it wasn't before, update user XP
        if (progress === 100 && oldProgress < 100) {
          const xpGained = currentMission.xp
          try {
            // Update the user's XP
            await updateXP(xpGained)
            console.log(`User gained ${xpGained} XP for completing mission!`)
          } catch (xpError) {
            console.error("Error updating XP:", xpError)
            setError("Failed to update XP. Please try again.")
            return false
          }
        }

        return true
      } catch (err) {
        console.error("Error updating mission progress:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        return false
      }
    } catch (err) {
      console.error("Error in updateProgress:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      return false
    }
  }

  return { missions, loading, error, acceptMission, updateProgress }
}
