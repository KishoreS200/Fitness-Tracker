"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Award, StretchVerticalIcon as Stretch, Brain, Heart, Dumbbell, Loader2, RefreshCw } from "lucide-react"
import { useMissions } from "@/hooks/use-missions"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { toast } from "@/components/ui/use-toast"
// Import the ExerciseVideoTips component
import { ExerciseVideoTips } from "@/components/exercise-video-tips"

interface Mission {
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

interface MissionAlignment {
  workoutId: string
  alignedMissions: Mission[]
}

interface MissionTemplate {
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard" | "epic"
  xp: number
  duration: number
  category: string
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "cardio":
      return <Heart className="h-4 w-4 text-blue-600 mr-1" />
    case "strength":
      return <Dumbbell className="h-4 w-4 text-blue-600 mr-1" />
    case "flexibility":
      return <Stretch className="h-4 w-4 text-blue-600 mr-1" />
    case "mindfulness":
      return <Brain className="h-4 w-4 text-blue-600 mr-1" />
    default:
      return <Heart className="h-4 w-4 text-blue-600 mr-1" />
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-800"
    case "medium":
      return "bg-blue-100 text-blue-800"
    case "hard":
      return "bg-amber-100 text-amber-800"
    case "epic":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-blue-100 text-blue-800"
  }
}

// Sample mission templates for generating new missions
const missionTemplates = [
  {
    title: "10K Step Challenge",
    description: "Walk 10,000 steps daily for 7 days",
    difficulty: "medium",
    xp: 200,
    duration: 7,
    category: "cardio",
  },
  {
    title: "Core Strength Master",
    description: "Complete 5 core workouts this week",
    difficulty: "hard",
    xp: 250,
    duration: 7,
    category: "strength",
  },
  {
    title: "Flexibility Challenge",
    description: "Do 10 minutes of stretching daily",
    difficulty: "easy",
    xp: 150,
    duration: 7,
    category: "flexibility",
  },
  {
    title: "Meditation Journey",
    description: "Meditate for 5 minutes daily for 5 days",
    difficulty: "easy",
    xp: 100,
    duration: 5,
    category: "mindfulness",
  },
  {
    title: "Epic Strength Quest",
    description: "Complete 3 strength workouts and increase weights by 5%",
    difficulty: "epic",
    xp: 350,
    duration: 10,
    category: "strength",
  },
  {
    title: "Morning Run Challenge",
    description: "Run for 20 minutes before breakfast for 5 days",
    difficulty: "medium",
    xp: 180,
    duration: 5,
    category: "cardio",
  },
  {
    title: "Yoga Flow Master",
    description: "Complete 7 yoga sessions in two weeks",
    difficulty: "medium",
    xp: 220,
    duration: 14,
    category: "flexibility",
  },
  {
    title: "Stress Reduction Quest",
    description: "Practice deep breathing exercises daily for 10 days",
    difficulty: "easy",
    xp: 120,
    duration: 10,
    category: "mindfulness",
  },
  {
    title: "Endurance Builder",
    description: "Increase cardio duration by 5 minutes each session for 6 sessions",
    difficulty: "hard",
    xp: 280,
    duration: 14,
    category: "cardio",
  },
  {
    title: "Bodyweight Master",
    description: "Complete 100 push-ups, 100 squats, and 100 sit-ups over 7 days",
    difficulty: "hard",
    xp: 300,
    duration: 7,
    category: "strength",
  },
  {
    title: "Balance Challenge",
    description: "Practice balance poses for 5 minutes daily for 10 days",
    difficulty: "medium",
    xp: 200,
    duration: 10,
    category: "flexibility",
  },
  {
    title: "Mindful Eating",
    description: "Practice mindful eating at every meal for 5 days",
    difficulty: "easy",
    xp: 120,
    duration: 5,
    category: "mindfulness",
  },
  {
    title: "HIIT Warrior",
    description: "Complete 8 HIIT workouts in 14 days",
    difficulty: "epic",
    xp: 400,
    duration: 14,
    category: "cardio",
  },
  {
    title: "Strength Progression",
    description: "Increase weight on all major lifts by 10% over 21 days",
    difficulty: "epic",
    xp: 450,
    duration: 21,
    category: "strength",
  },
  {
    title: "Mobility Master",
    description: "Improve range of motion in all major joints over 14 days",
    difficulty: "hard",
    xp: 280,
    duration: 14,
    category: "flexibility",
  },
]

export function AvailableMissions() {
  const { missions, loading, error, acceptMission } = useMissions(false)
  const [acceptingMissionId, setAcceptingMissionId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)
  const [displayedMissions, setDisplayedMissions] = useState<any[]>([])
  const { user } = useAuth()

  // Initialize displayed missions when missions load
  useEffect(() => {
    if (!loading && missions.length > 0 && displayedMissions.length === 0) {
      setDisplayedMissions(missions)
    }
  }, [loading, missions, displayedMissions.length])

  const handleAcceptMission = async (missionId: string) => {
    if (!user) return

    setAcceptingMissionId(missionId)
    try {
      await acceptMission(missionId)

      // Remove the accepted mission from displayed missions
      setDisplayedMissions((prev) => prev.filter((mission) => mission._id !== missionId))

      toast({
        title: "Mission Accepted!",
        description: "Your new mission has been added to your active missions.",
        variant: "default",
      })
    } finally {
      setAcceptingMissionId(null)
    }
  }

  const handleRefreshMissions = async () => {
    if (refreshing) return

    setRefreshing(true)

    try {
      // In a real app, this would call an API to get new missions
      // For now, we'll simulate by randomly selecting from templates

      // Track which missions we've already shown
      const existingMissionTitles = new Set(displayedMissions.map((m) => m.title))

      // Get available templates (ones we haven't shown yet)
      const availableTemplates = missionTemplates.filter((t) => !existingMissionTitles.has(t.title))

      // If we've shown all templates, reset
      if (availableTemplates.length < 3) {
        toast({
          title: "Refreshing Mission Pool",
          description: "We've reset the available missions for you to choose from.",
          variant: "default",
        })

        // Wait a moment for visual feedback
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Generate completely new set of missions
        const newMissions = generateRandomMissions(4)
        setDisplayedMissions(newMissions)
      } else {
        // Generate new missions from available templates
        const newMissions = generateRandomMissions(4, availableTemplates)

        // Replace current missions with new ones
        setDisplayedMissions(newMissions)
      }

      // Increment refresh count
      setRefreshCount((prev) => prev + 1)

      toast({
        title: "Missions Refreshed!",
        description: "New missions are now available for you to accept.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error refreshing missions:", error)
      toast({
        title: "Error Refreshing Missions",
        description: "There was a problem getting new missions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  // Function to generate random missions
  const generateRandomMissions = (count: number, templates = missionTemplates) => {
    // Shuffle templates
    const shuffled = [...templates].sort(() => 0.5 - Math.random())

    // Take the first 'count' templates
    const selected = shuffled.slice(0, count)

    // Convert templates to missions with unique IDs
    return selected.map((template, index) => ({
      _id: `generated-${Date.now()}-${index}`,
      ...template,
      isActive: false,
      progress: 0,
      userId: user?._id || "mock123",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
  }

  // Function to get AI-recommended missions based on user profile
  const getRecommendedMissions = (): Mission[] => {
    if (!user || !user.profile) return displayedMissions

    // In a real app, this would use a more sophisticated algorithm
    // For now, we'll do a simple filtering based on user profile

    const userLevel = user.level || 1
    const userGoal = user.profile.fitnessGoal || "general"

    // Filter missions based on user level
    let filteredMissions = [...displayedMissions]

    // Beginners (level 1-3) get more easy missions
    if (userLevel <= 3) {
      filteredMissions = filteredMissions.filter((m) => m.difficulty === "easy" || m.difficulty === "medium")
    }

    // Advanced users (level 7+) get more hard/epic missions
    if (userLevel >= 7) {
      filteredMissions = filteredMissions.filter(
        (m) => m.difficulty === "medium" || m.difficulty === "hard" || m.difficulty === "epic",
      )
    }

    // Filter by user goal if possible
    if (userGoal === "weightLoss") {
      // Prioritize cardio missions
      filteredMissions.sort((a, b) => {
        if (a.category === "cardio" && b.category !== "cardio") return -1
        if (a.category !== "cardio" && b.category === "cardio") return 1
        return 0
      })
    } else if (userGoal === "muscleGain") {
      // Prioritize strength missions
      filteredMissions.sort((a, b) => {
        if (a.category === "strength" && b.category !== "strength") return -1
        if (a.category !== "strength" && b.category === "strength") return 1
        return 0
      })
    } else if (userGoal === "flexibility") {
      // Prioritize flexibility missions
      filteredMissions.sort((a, b) => {
        if (a.category === "flexibility" && b.category !== "flexibility") return -1
        if (a.category !== "flexibility" && b.category === "flexibility") return 1
        return 0
      })
    }

    // If we filtered too aggressively, add some back
    if (filteredMissions.length < 2) {
      return displayedMissions
    }

    return filteredMissions
  }

  const getExerciseNameForMission = (mission: any): string => {
    // Safety check for undefined mission or title
    if (!mission || !mission.title) {
      return "Push-ups" // Default exercise if mission is undefined
    }

    const title = mission.title.toLowerCase()

    if (title.includes("step") || title.includes("run")) return "Running"
    if (title.includes("core") || title.includes("strength")) return "Push-ups"
    if (title.includes("flexibility") || title.includes("yoga")) return "Yoga"
    if (title.includes("meditation") || title.includes("mindful") || title.includes("stress")) return "Meditation"
    if (title.includes("balance")) return "Balance"
    if (title.includes("hiit")) return "HIIT"
    if (title.includes("stretch")) return "Stretching"

    // Default mapping based on category
    const categoryMap: Record<string, string> = {
      cardio: "Running",
      strength: "Push-ups",
      flexibility: "Stretching",
      mindfulness: "Meditation",
    }

    // Safety check for mission.category
    if (mission.category && typeof mission.category === "string") {
      return categoryMap[mission.category.toLowerCase()] || "Jumping Jacks"
    }

    return "Jumping Jacks"
  }

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Available Missions</h2>
          <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-full mb-4" />

                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>

                <Skeleton className="h-2 w-full mb-4" />

                <Skeleton className="h-4 w-24" />
              </CardContent>
              <CardFooter className="px-6 py-4 bg-gray-50 border-t">
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Available Missions</h2>
          <Button variant="outline" size="sm" onClick={handleRefreshMissions} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Missions</span>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Error loading missions: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (displayedMissions.length === 0) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Available Missions</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshMissions}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            {refreshing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>Refresh Missions</span>
              </>
            )}
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No available missions at the moment.</p>
            <p className="text-gray-500">Click "Refresh Missions" to get new challenges!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get recommended missions based on user profile
  const recommendedMissions = getRecommendedMissions()

  // Group missions by difficulty for better display
  const groupedMissions = recommendedMissions.reduce<Record<string, Mission[]>>(
    (acc, mission) => {
      if (!acc[mission.difficulty]) {
        acc[mission.difficulty] = []
      }
      acc[mission.difficulty].push(mission)
      return acc
    },
    {} as Record<string, Mission[]>,
  )

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Available Missions</h2>
          <p className="text-sm text-gray-600">
            {user?.profile?.fitnessGoal
              ? `Tailored for your ${user.profile.fitnessGoal} goal`
              : "Personalized for your fitness journey"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshMissions}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          {refreshing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Missions</span>
            </>
          )}
        </Button>
      </div>

      {Object.entries(groupedMissions).map(([difficulty, difficultyMissions]) => (
        <div key={difficulty} className="mb-6">
          <h3 className="text-lg font-semibold mb-3 capitalize">{difficulty} Missions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {difficultyMissions.map((mission: Mission) => (
              <Card key={mission._id} className="transition-all duration-300 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{mission.title}</h3>
                    <span className={`px-2 py-1 ${getDifficultyColor(mission.difficulty)} text-xs font-medium rounded`}>
                      {mission.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{mission.description}</p>

                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-sm font-medium">{mission.xp} XP</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600">{mission.duration} days</span>
                    </div>
                  </div>

                  <div className="mb-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm font-medium">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  <div className="flex items-center mt-4">
                    {getCategoryIcon(mission.category)}
                    <span className="text-sm text-gray-600 capitalize">{mission.category}</span>
                  </div>

                  {/* Add the video tips component */}
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-xs text-gray-500">Learn proper technique</span>
                    <ExerciseVideoTips
                      exerciseName={getExerciseNameForMission(mission)}
                      category={mission.category}
                      missionTitle={mission.title}
                    />
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 bg-gray-50 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleAcceptMission(mission._id)}
                    disabled={acceptingMissionId === mission._id || !user}
                  >
                    {acceptingMissionId === mission._id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Accepting...
                      </>
                    ) : (
                      "Accept Mission"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
