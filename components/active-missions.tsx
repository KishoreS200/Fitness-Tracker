"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Mission, useMissions } from "@/hooks/use-missions"
import { Award, Brain, Clock, Dumbbell, Heart, Info, Play, StretchVerticalIcon as Stretch } from "lucide-react"
import { useState } from "react"

// Import the ExerciseVideoTips component
import { ExerciseVideoTips } from "@/components/exercise-video-tips"

// Exercise demonstration data with real images
const exerciseDemos = {
  "Push-ups": {
    description:
      "Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.",
    tips: [
      "Keep your body in a straight line from head to heels",
      "Don't let your hips sag or pike up",
      "Elbows should be at about a 45-degree angle to your body",
    ],
    imageUrl: "https://images.unsplash.com/photo-1566241142559-40a9552c8a76?q=80&w=2000&auto=format&fit=crop",
    videoUrl: null,
    variations: ["Knee push-ups", "Incline push-ups", "Decline push-ups"],
  },
  Squats: {
    description:
      "Stand with feet shoulder-width apart. Bend your knees and lower your hips as if sitting in a chair, then return to standing.",
    tips: [
      "Keep your chest up and back straight",
      "Push your knees outward in line with your toes",
      "Lower until thighs are parallel to the ground (or as low as comfortable)",
    ],
    imageUrl: "https://images.unsplash.com/photo-1567598508481-65985588e295?q=80&w=2000&auto=format&fit=crop",
    videoUrl: null,
    variations: ["Bodyweight squats", "Goblet squats", "Sumo squats"],
  },
  Plank: {
    description:
      "Hold a push-up position with your body in a straight line from head to heels, supporting yourself on your forearms and toes.",
    tips: [
      "Keep your core engaged and don't let your hips sag",
      "Breathe normally throughout the hold",
      "Look slightly ahead to maintain neutral neck position",
    ],
    imageUrl: "https://images.unsplash.com/photo-1566241142295-21f8397fdcc4?q=80&w=2000&auto=format&fit=crop",
    videoUrl: null,
    variations: ["Forearm plank", "Side plank", "Plank with shoulder taps"],
  },
  "Jumping Jacks": {
    description:
      "Stand with feet together and arms at sides, then jump while spreading legs and raising arms overhead. Return to starting position.",
    tips: [
      "Land softly with slightly bent knees",
      "Keep movements controlled and rhythmic",
      "Maintain good posture throughout",
    ],
    imageUrl: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=2000&auto=format&fit=crop",
    videoUrl: null,
    variations: ["Half jacks", "Low-impact jacks", "Cross jacks"],
  },
  Burpees: {
    description:
      "From standing, drop into a squat position, kick feet back to a plank, do a push-up, jump feet forward, then explosively jump up with arms overhead.",
    tips: [
      "Modify by removing the push-up or jump if needed",
      "Focus on form rather than speed initially",
      "Land softly with bent knees after the jump",
    ],
    imageUrl: "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=2000&auto=format&fit=crop",
    videoUrl: null,
    variations: ["No push-up burpees", "No jump burpees", "Half burpees"],
  },
  "Mountain Climbers": {
    description:
      "Start in a plank position. Alternately drive knees toward chest in a running motion while maintaining the plank position.",
    tips: [
      "Keep hips level and don't pike up",
      "Engage core throughout the movement",
      "Control the pace - quality over speed",
    ],
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=2000&auto=format&fit=crop",
    videoUrl: null,
    variations: ["Slow mountain climbers", "Cross-body mountain climbers", "Sliding mountain climbers"],
  },
  Lunges: {
    description:
      "From standing, step forward with one leg and lower your body until both knees are bent at 90 degrees. Push back to starting position.",
    tips: [
      "Keep your torso upright",
      "Front knee should track over ankle, not past toes",
      "Keep back knee from touching the ground",
    ],
    imageUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=2000&auto=format&fit=crop",
    videoUrl: null,
    variations: ["Static lunges", "Walking lunges", "Reverse lunges"],
  },
  "Bicycle Crunches": {
    description:
      "Lie on your back with hands behind head. Alternate bringing opposite elbow to opposite knee while extending the other leg.",
    tips: [
      "Keep lower back pressed into the floor",
      "Focus on the rotation, not just the elbow movement",
      "Maintain controlled breathing throughout",
    ],
    imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2000&auto=format&fit=crop",
    videoUrl: null,
    variations: ["Slow bicycle crunches", "Seated bicycle crunches", "Flutter kicks"],
  },
  Walking: {
    description:
      "A low-impact cardio exercise where you move at a steady pace. Walking is accessible to people of all fitness levels and has numerous health benefits.",
    tips: [
      "Maintain good posture with shoulders back and head up",
      "Land heel-to-toe with each step",
      "Swing arms naturally to increase intensity",
    ],
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2000&auto=format&fit=crop",
    videoUrl: null,
    variations: ["Brisk walking", "Incline walking", "Nordic walking"],
  },
  Running: {
    description:
      "A high-impact cardio exercise that involves moving at a faster pace than walking, with a moment where both feet are off the ground.",
    tips: [
      "Land midfoot, not on your heels or toes",
      "Keep your shoulders relaxed and elbows at 90 degrees",
      "Maintain a slight forward lean from the ankles",
    ],
    imageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=2000&auto=format&fit=crop",
    videoUrl: null,
    variations: ["Jogging", "Sprinting", "Interval running"],
  },
}

// Default exercise demo for exercises not in our database
const defaultExerciseDemo = {
  description: "This exercise helps build strength and endurance in targeted muscle groups.",
  tips: [
    "Maintain proper form throughout the movement",
    "Breathe steadily - exhale during exertion",
    "Start with lighter weights/fewer reps and progress gradually",
  ],
  imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2000&auto=format&fit=crop",
  videoUrl: null,
  variations: ["Modified version", "Standard version", "Advanced version"],
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

// Map mission categories to suggested exercises
const missionExercises = {
  cardio: ["Walking", "Running", "Jumping Jacks", "Mountain Climbers"],
  strength: ["Push-ups", "Squats", "Lunges", "Plank"],
  flexibility: ["Lunges", "Plank"],
  mindfulness: ["Plank"],
}

interface ExerciseDemo {
  name: string
  description: string
  tips: string[]
  imageUrl: string
  videoUrl: string | null
  variations: string[]
}

export function ActiveMissions() {
  const { missions, loading, error, updateProgress } = useMissions(true)
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [missionDetailsOpen, setMissionDetailsOpen] = useState(false)

  // Add state for exercise demonstration
  const [showExerciseDemo, setShowExerciseDemo] = useState(false)
  const [currentExerciseDemo, setCurrentExerciseDemo] = useState<ExerciseDemo | null>(null)

  const handleContinueMission = (missionId: string) => {
    // Find the mission
    const mission = missions.find((m) => m._id === missionId)
    if (mission) {
      setSelectedMission(mission)
      setMissionDetailsOpen(true)
    }
  }

  const handleUpdateProgress = (missionId: string, newProgress: number) => {
    updateProgress(missionId, newProgress)
    setMissionDetailsOpen(false)
  }

  // Function to show exercise demonstration
  const handleShowExerciseDemo = (exerciseName: string) => {
    // Get exercise demo data or use default if not found
    const demoData = exerciseDemos[exerciseName as keyof typeof exerciseDemos] || {
      ...defaultExerciseDemo,
      description: `${exerciseName}: ${defaultExerciseDemo.description}`,
    }

    setCurrentExerciseDemo({
      name: exerciseName,
      ...demoData,
    })
    setShowExerciseDemo(true)
  }

  // Get suggested exercises for a mission
  const getSuggestedExercises = (mission: any) => {
    if (!mission) return []

    const category = mission.category.toLowerCase()
    return missionExercises[category as keyof typeof missionExercises] || missionExercises["cardio"] // Default to cardio if category not found
  }

  const getExerciseNameForMission = (mission: any): string => {
    // Safety check for undefined mission
    if (!mission || !mission.title) {
      return "Push-ups" // Default exercise if mission is undefined
    }

    const title = mission.title.toLowerCase()

    if (title.includes("step") || title.includes("run")) return "Running"
    if (title.includes("core")) return "Plank"
    if (title.includes("strength")) return "Push-ups"
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
      core: "Plank"
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
        <h2 className="text-xl font-bold mb-4">Active Missions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <h2 className="text-xl font-bold mb-4">Active Missions</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Error loading missions: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (missions.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Active Missions</h2>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">You don't have any active missions yet.</p>
            <p className="text-gray-500">Check out the available missions below to get started!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Active Missions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((mission) => (
          <Card key={mission._id}>
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
                  <span className="text-sm text-gray-600">{mission.duration} days left</span>
                </div>
              </div>

              <div className="mb-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{mission.progress}%</span>
                </div>
                <Progress value={mission.progress} className="h-2" />
              </div>

              <div className="flex items-center mt-4">
                {getCategoryIcon(mission.category)}
                <span className="text-sm text-gray-600 capitalize">{mission.category}</span>
              </div>

              {/* Add video tips for exercises */}
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-xs text-gray-500">Watch proper technique</span>
                <ExerciseVideoTips
                  exerciseName={getExerciseNameForMission(mission)}
                  category={mission.category}
                  missionTitle={mission.title}
                />
              </div>
            </CardContent>
            <CardFooter className="px-6 py-4 bg-gray-50 border-t">
              <Button className="w-full" onClick={() => handleContinueMission(mission._id)}>
                Continue Mission
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Mission Details Dialog */}
      <Dialog open={missionDetailsOpen} onOpenChange={setMissionDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedMission?.title}</DialogTitle>
            <DialogDescription>
              {selectedMission?.difficulty} • {selectedMission?.duration} days
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <p className="text-sm text-gray-700">{selectedMission?.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Current Progress</h4>
              <div className="mb-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{selectedMission?.progress}% complete</span>
                  <span className="text-sm">{selectedMission?.xp} XP reward</span>
                </div>
                <Progress value={selectedMission?.progress} className="h-2" />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Suggested Exercises</h4>
              <div className="space-y-2">
                {selectedMission &&
                  getSuggestedExercises(selectedMission).map((exercise, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{exercise}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleShowExerciseDemo(exercise)}
                        >
                          <Info className="h-4 w-4" />
                          <span className="sr-only">How to do {exercise}</span>
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">Recommended for {selectedMission.category}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex flex-col gap-2">
                {selectedMission && (
                  <>
                    <Button
                      onClick={() =>
                        handleUpdateProgress(selectedMission._id, Math.min(selectedMission.progress + 10, 100))
                      }
                    >
                      Update Progress (+10%)
                    </Button>
                    {selectedMission.progress < 100 && (
                      <Button variant="outline" onClick={() => handleUpdateProgress(selectedMission._id, 100)}>
                        Mark as Completed
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exercise Demonstration Dialog */}
      <Dialog open={showExerciseDemo} onOpenChange={setShowExerciseDemo}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>How to do: {currentExerciseDemo?.name}</DialogTitle>
            <DialogDescription>Follow these instructions for proper form and technique</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Exercise image or video */}
            <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
              {currentExerciseDemo?.videoUrl ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-blue-600/80 text-white">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              ) : (
                <img
                  src={currentExerciseDemo?.imageUrl || "/placeholder.svg"}
                  alt={`${currentExerciseDemo?.name} demonstration`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Exercise description */}
            <div>
              <h4 className="text-sm font-medium mb-2">Instructions</h4>
              <p className="text-sm text-gray-700">{currentExerciseDemo?.description}</p>
            </div>

            {/* Exercise tips */}
            <div>
              <h4 className="text-sm font-medium mb-2">Form Tips</h4>
              <ul className="space-y-1">
                {currentExerciseDemo?.tips?.map((tip: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <div className="rounded-full bg-blue-100 text-blue-800 w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exercise variations */}
            <div>
              <h4 className="text-sm font-medium mb-2">Variations</h4>
              <div className="flex flex-wrap gap-2">
                {currentExerciseDemo?.variations?.map((variation: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                    {variation}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowExerciseDemo(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
