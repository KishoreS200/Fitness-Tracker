"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/auth-context"
import { Trophy, Target, Dumbbell, Flame } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Define achievement types
interface Achievement {
  id: string
  name: string
  description: string
  category: "workout" | "streak" | "milestone" | "challenge" | "nutrition"
  icon: React.ReactNode
  requirement: number
  currentProgress: number
  completed: boolean
  dateCompleted?: string
  xp: number
  level: "bronze" | "silver" | "gold" | "platinum"
  badge: string
}

export function AchievementsSystem() {
  const { user, updateUser } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [initialized, setInitialized] = useState(false)

  // Use refs to track previous stats to avoid unnecessary updates
  const prevStatsRef = useRef<any>(null)
  const processingUpdateRef = useRef<boolean>(false)

  // Initialize achievements based on user data
  useEffect(() => {
    if (!user || initialized || processingUpdateRef.current) return

    // Load achievements from localStorage or initialize
    const savedAchievements = localStorage.getItem("userAchievements")
    let userAchievements: Achievement[] = []

    if (savedAchievements) {
      try {
        userAchievements = JSON.parse(savedAchievements)
      } catch (error) {
        console.error("Error parsing achievements:", error)
      }
    }

    // If no saved achievements or parsing failed, initialize default achievements
    if (!userAchievements || !Array.isArray(userAchievements) || userAchievements.length === 0) {
      userAchievements = [
        {
          id: "workout-beginner",
          name: "Workout Beginner",
          description: "Complete 5 workouts",
          category: "workout",
          icon: <Dumbbell className="h-5 w-5" />,
          requirement: 5,
          currentProgress: user.stats?.workouts || 0,
          completed: false,
          xp: 50,
          level: "bronze",
          badge: "workout-beginner",
        },
        {
          id: "workout-intermediate",
          name: "Workout Enthusiast",
          description: "Complete 20 workouts",
          category: "workout",
          icon: <Dumbbell className="h-5 w-5" />,
          requirement: 20,
          currentProgress: user.stats?.workouts || 0,
          completed: false,
          xp: 100,
          level: "silver",
          badge: "workout-intermediate",
        },
        {
          id: "workout-advanced",
          name: "Workout Master",
          description: "Complete 50 workouts",
          category: "workout",
          icon: <Dumbbell className="h-5 w-5" />,
          requirement: 50,
          currentProgress: user.stats?.workouts || 0,
          completed: false,
          xp: 200,
          level: "gold",
          badge: "workout-advanced",
        },
        {
          id: "streak-beginner",
          name: "Consistency Starter",
          description: "Maintain a 3-day streak",
          category: "streak",
          icon: <Flame className="h-5 w-5" />,
          requirement: 3,
          currentProgress: user.stats?.streak || 0,
          completed: false,
          xp: 30,
          level: "bronze",
          badge: "streak-beginner",
        },
        {
          id: "streak-intermediate",
          name: "Consistency Builder",
          description: "Maintain a 7-day streak",
          category: "streak",
          icon: <Flame className="h-5 w-5" />,
          requirement: 7,
          currentProgress: user.stats?.streak || 0,
          completed: false,
          xp: 75,
          level: "silver",
          badge: "streak-intermediate",
        },
        {
          id: "streak-advanced",
          name: "Consistency Master",
          description: "Maintain a 30-day streak",
          category: "streak",
          icon: <Flame className="h-5 w-5" />,
          requirement: 30,
          currentProgress: user.stats?.streak || 0,
          completed: false,
          xp: 300,
          level: "gold",
          badge: "streak-advanced",
        },
        {
          id: "steps-beginner",
          name: "Step Starter",
          description: "Walk 50,000 total steps",
          category: "milestone",
          icon: <Target className="h-5 w-5" />,
          requirement: 50000,
          currentProgress: user.stats?.totalSteps || 0,
          completed: false,
          xp: 50,
          level: "bronze",
          badge: "steps-beginner",
        },
        {
          id: "steps-intermediate",
          name: "Step Enthusiast",
          description: "Walk 250,000 total steps",
          category: "milestone",
          icon: <Target className="h-5 w-5" />,
          requirement: 250000,
          currentProgress: user.stats?.totalSteps || 0,
          completed: false,
          xp: 150,
          level: "silver",
          badge: "steps-intermediate",
        },
        {
          id: "steps-advanced",
          name: "Step Master",
          description: "Walk 1,000,000 total steps",
          category: "milestone",
          icon: <Target className="h-5 w-5" />,
          requirement: 1000000,
          currentProgress: user.stats?.totalSteps || 0,
          completed: false,
          xp: 500,
          level: "gold",
          badge: "steps-advanced",
        },
        {
          id: "mission-beginner",
          name: "Mission Starter",
          description: "Complete 3 missions",
          category: "challenge",
          icon: <Trophy className="h-5 w-5" />,
          requirement: 3,
          currentProgress: user.stats?.missions || 0,
          completed: false,
          xp: 75,
          level: "bronze",
          badge: "mission-beginner",
        },
        {
          id: "mission-intermediate",
          name: "Mission Enthusiast",
          description: "Complete 10 missions",
          category: "challenge",
          icon: <Trophy className="h-5 w-5" />,
          requirement: 10,
          currentProgress: user.stats?.missions || 0,
          completed: false,
          xp: 150,
          level: "silver",
          badge: "mission-intermediate",
        },
        {
          id: "mission-advanced",
          name: "Mission Master",
          description: "Complete 25 missions",
          category: "challenge",
          icon: <Trophy className="h-5 w-5" />,
          requirement: 25,
          currentProgress: user.stats?.missions || 0,
          completed: false,
          xp: 300,
          level: "gold",
          badge: "mission-advanced",
        },
      ]
    }

    setAchievements(userAchievements)
    setInitialized(true)

    // Store initial stats for comparison
    if (user.stats) {
      prevStatsRef.current = {
        workouts: user.stats.workouts || 0,
        streak: user.stats.streak || 0,
        totalSteps: user.stats.totalSteps || 0,
        missions: user.stats.missions || 0,
      }
    }
  }, [user, initialized])

  // Check for achievement updates when user stats change
  useEffect(() => {
    if (!user || !initialized || achievements.length === 0 || !user.stats || processingUpdateRef.current) return

    // Get current stats with safe defaults
    const currentStats = {
      workouts: user.stats.workouts || 0,
      streak: user.stats.streak || 0,
      totalSteps: user.stats.totalSteps || 0,
      missions: user.stats.missions || 0,
    }

    // Check if stats have actually changed to avoid unnecessary updates
    const prevStats = prevStatsRef.current
    if (!prevStats) return

    const statsChanged =
      currentStats.workouts !== prevStats.workouts ||
      currentStats.streak !== prevStats.streak ||
      currentStats.totalSteps !== prevStats.totalSteps ||
      currentStats.missions !== prevStats.missions

    if (!statsChanged) return

    // Set processing flag to prevent concurrent updates
    processingUpdateRef.current = true

    try {
      // Update previous stats reference
      prevStatsRef.current = { ...currentStats }

      // Update achievements based on new stats
      const updatedAchievements = achievements.map((achievement) => {
        // Skip already completed achievements
        if (achievement.completed) return achievement

        let currentProgress = 0

        // Update progress based on achievement category
        switch (achievement.category) {
          case "workout":
            currentProgress = currentStats.workouts
            break
          case "streak":
            currentProgress = currentStats.streak
            break
          case "milestone":
            if (achievement.id.startsWith("steps")) {
              currentProgress = currentStats.totalSteps
            }
            break
          case "challenge":
            if (achievement.id.startsWith("mission")) {
              currentProgress = currentStats.missions
            }
            break
        }

        // Check if achievement is completed
        if (currentProgress >= achievement.requirement && !achievement.completed) {
          // Show toast notification
          try {
            toast({
              title: "Achievement Unlocked!",
              description: `${achievement.name}: ${achievement.description}`,
              variant: "default",
            })
          } catch (error) {
            console.error("Error showing toast notification:", error)
          }

          return {
            ...achievement,
            currentProgress,
            completed: true,
            dateCompleted: new Date().toISOString(),
          }
        }

        // Just update progress
        return {
          ...achievement,
          currentProgress,
        }
      })

      // Save updated achievements
      setAchievements(updatedAchievements)
      localStorage.setItem("userAchievements", JSON.stringify(updatedAchievements))
    } catch (error) {
      console.error("Error updating achievements:", error)
    } finally {
      // Reset processing flag
      processingUpdateRef.current = false
    }
  }, [user, achievements, initialized])

  // This component doesn't render anything directly
  return null
}
