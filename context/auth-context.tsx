"use client"

import { useRouter } from "next/navigation"
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

// Define the API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Set to true to always use mock data in development
const USE_MOCK_DATA = process.env.NODE_ENV === "development"

type Photo = {
  id: string
  url: string
  date: string
  type: string
}

type User = {
  _id: string
  name: string
  email: string
  level: number
  status: string
  badge: string
  xp: {
    current: number
    max: number
  }
  stats: {
    streak: number
    missions: number
    badges: number
    workouts: number
    totalSteps: number
  }
  authProvider?: "email" | "apple"
  profile?: {
    age?: number
    gender?: string
    height?: number
    weight?: number
    activityLevel?: string
    fitnessGoal?: string
    dietPreference?: string
  }
  photos?: Photo[]
}

type AuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password?: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
  updateXP: (xpAmount: number) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a mock user for development
const createMockUser = (email: string, provider: "email" | "apple" = "email") => {
  return {
    _id: "507f1f77bcf86cd799439011", // Valid MongoDB ObjectId format
    name: provider === "apple" ? email.split("@")[0] + " (Apple)" : email.split("@")[0],
    email,
    level: 1,
    status: "bronze",
    badge: "beginner",
    authProvider: provider,
    xp: {
      current: 0,
      max: 1000,
    },
    stats: {
      streak: 0,
      missions: 0,
      badges: 0,
      workouts: 0,
      totalSteps: 0,
    },
    profile: {
      age: 28,
      gender: "male",
      height: 175,
      weight: 70,
      activityLevel: "moderate",
      fitnessGoal: "general",
      dietPreference: "balanced",
    },
    photos: [],
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()

  // Check if user is already logged in - only run once
  useEffect(() => {
    if (initialized) return

    const checkLoggedIn = async () => {
      try {
        // Check for stored email in localStorage
        const storedEmail = localStorage.getItem("userEmail")
        const authProvider = localStorage.getItem("authProvider") as "email" | "apple" | null

        if (storedEmail) {
          // If we're in development mode and USE_MOCK_DATA is true, use mock data
          if (USE_MOCK_DATA) {
            console.log("Using mock user data for development")
            setUser(createMockUser(storedEmail, authProvider || "email"))
            setLoading(false)
            setInitialized(true)
            return
          }

          // Try to fetch user data from API
          try {
            const response = await fetch(`${API_URL}/user?email=${encodeURIComponent(storedEmail)}`)

            if (response.ok) {
              const userData = await response.json()
              setUser(userData)
            } else {
              // If API call fails, clear localStorage
              localStorage.removeItem("userEmail")
              localStorage.removeItem("authProvider")
              document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
            }
          } catch (err) {
            console.error("Error fetching user data:", err)

            // If in development, fall back to mock data
            if (process.env.NODE_ENV === "development") {
              console.log("Falling back to mock user data after API failure")
              setUser(createMockUser(storedEmail, authProvider || "email"))
            }
          }
        }
      } catch (err) {
        console.error("Error checking login status:", err)
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    checkLoggedIn()
  }, [initialized])

  const login = useCallback(async (email: string, password?: string) => {
    try {
      setLoading(true)
      setError(null)

      console.log("Login function called with email:", email)

      // Validate email format
      if (!email.includes("@")) {
        setError("Please enter a valid email address")
        setLoading(false)
        return
      }

      // Validate password length if provided
      if (password && password.length < 6) {
        setError("Password must be at least 6 characters")
        setLoading(false)
        return
      }

      // If we're in development mode and USE_MOCK_DATA is true, use mock data
      if (USE_MOCK_DATA) {
        console.log("Using mock data for login")

        // For development, accept any password
        const mockUser = createMockUser(email)
        setUser(mockUser)
        localStorage.setItem("userEmail", email)
        localStorage.setItem("authProvider", "email")

        // Set cookie for middleware
        document.cookie = `userEmail=${encodeURIComponent(email)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`

        return
      }

      // Call login API
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important for cookies
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Login failed")
      }

      const data = await response.json()
      setUser(data.user)

      // Store email in localStorage for convenience
      localStorage.setItem("userEmail", email)
      localStorage.setItem("authProvider", "email")
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      setError(null)

      // Validate inputs
      if (!email.includes("@")) {
        setError("Please enter a valid email address")
        return false
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        return false
      }

      if (!name.trim()) {
        setError("Please enter your name")
        return false
      }

      // If we're in development mode and USE_MOCK_DATA is true, use mock data
      if (USE_MOCK_DATA) {
        console.log("Using mock data for registration")
        return true
      }

      // Call register API
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Registration failed")
      }

      return true
    } catch (err) {
      console.error("Registration error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setLoading(true)

      // If we're in development mode and USE_MOCK_DATA is true, just clear local state
      if (USE_MOCK_DATA) {
        setUser(null)
        localStorage.removeItem("userEmail")
        localStorage.removeItem("authProvider")
        document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        router.push("/login")
        return
      }

      // Call logout API
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // Important for cookies
      })

      setUser(null)
      localStorage.removeItem("userEmail")
      localStorage.removeItem("authProvider")
      router.push("/login")
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setLoading(false)
    }
  }, [router])

  const updateUser = useCallback(
    async (userData: Partial<User>) => {
      if (!user) return

      try {
        setLoading(true)

        // If we're in development mode and USE_MOCK_DATA is true, just update the local state
        if (USE_MOCK_DATA) {
          console.log("Using mock data for updateUser")
          setUser((prev) => (prev ? { ...prev, ...userData } : null))
          return
        }

        // Call update user API
        const response = await fetch(`${API_URL}/user`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            ...userData,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update user")
        }

        const updatedUser = await response.json()
        setUser(updatedUser)
      } catch (err) {
        console.error("Update user error:", err)
        setError(err instanceof Error ? err.message : "Failed to update user")
      } finally {
        setLoading(false)
      }
    },
    [user],
  )

  const updateXP = useCallback(
    async (xpAmount: number) => {
      if (!user) return

      try {
        setLoading(true)

        // Calculate new XP
        const currentXP = user.xp.current + xpAmount
        let newLevel = user.level
        let newXP = currentXP
        let maxXP = user.xp.max

        // Check if user leveled up
        while (newXP >= maxXP) {
          newLevel++
          newXP -= maxXP
          // Increase max XP for next level (by 10%)
          maxXP = Math.round(maxXP * 1.1)
        }

        // Update user stats
        const updatedStats = {
          ...user.stats,
          missions: user.stats.missions + (xpAmount > 0 ? 1 : 0),
        }

        // If we're in development mode and USE_MOCK_DATA is true, just update the local state
        if (USE_MOCK_DATA) {
          console.log("Using mock data for updateXP")
          setUser((prev) => {
            if (!prev) return null
            return {
              ...prev,
              level: newLevel,
              xp: {
                current: newXP,
                max: maxXP,
              },
              stats: updatedStats,
            }
          })
          return
        }

        // Call update user API
        const response = await fetch(`${API_URL}/user`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            level: newLevel,
            xp: {
              current: newXP,
              max: maxXP,
            },
            stats: updatedStats,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update XP")
        }

        const updatedUser = await response.json()
        setUser(updatedUser)
      } catch (err) {
        console.error("Update XP error:", err)
        setError(err instanceof Error ? err.message : "Failed to update XP")
      } finally {
        setLoading(false)
      }
    },
    [user],
  )

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateUser,
    updateXP,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
