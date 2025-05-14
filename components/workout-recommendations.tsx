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
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { useMissions } from "@/hooks/use-missions"
import { useWorkouts } from "@/hooks/use-workouts"
import { Clock, Info, Play, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-green-100 text-green-800"
    case "intermediate":
      return "bg-blue-100 text-blue-800"
    case "advanced":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-blue-100 text-blue-800"
  }
}

// Exercise demonstration data with real images and videos
const exerciseDemos = {
  "Push-ups": {
    description: "A classic exercise targeting the chest, shoulders, and triceps. It's a great way to build upper body strength using your own body weight.",
    instructions: [
      "Start in a high plank position with hands slightly wider than shoulder-width",
      "Keep your body in a straight line from head to heels",
      "Lower your chest towards the floor by bending your elbows",
      "Push back up to the starting position",
      "Keep your core engaged throughout the movement"
    ],
    variations: ["Incline push-ups (easier)", "Decline push-ups (harder)", "Diamond push-ups (triceps focus)"],
  },
  Squats: {
    description: "A fundamental exercise for building lower body strength. Squats target the quads, hamstrings, and glutes.",
    instructions: [
      "Stand with feet shoulder-width apart, toes slightly outward",
      "Keep your chest up and back straight",
      "Lower your hips as if sitting into a chair",
      "Keep your knees behind your toes",
      "Push through your heels to return to standing"
    ],
    variations: ["Bodyweight squats", "Goblet squats (with a weight)", "Jump squats (advanced)"],
  },
  Plank: {
    description: "An isometric exercise that strengthens the core, back, and shoulders. It involves holding a straight line from head to heels.",
    instructions: [
      "Start in a push-up position with hands under shoulders",
      "Engage your core by pulling your belly button towards your spine",
      "Keep your body in a straight line from head to heels",
      "Hold the position while breathing normally",
      "Keep your shoulders away from your ears"
    ],
    variations: ["Forearm plank", "High plank (on hands)", "Side plank (obliques focus)"],
  },
  "Jumping Jacks": {
    description: "A classic cardio exercise that elevates your heart rate and works your entire body. It's a great warm-up or standalone activity.",
    instructions: [
      "Start with feet together and arms at your sides",
      "Jump while spreading your legs shoulder-width apart",
      "Simultaneously raise your arms overhead",
      "Jump back to the starting position",
      "Land softly with slightly bent knees"
    ],
    variations: ["Low-impact jumping jacks (step instead of jump)", "Power jacks (more explosive)"],
  },
  Burpees: {
    description: "A full-body exercise that combines cardio and strength. It involves a squat, push-up, and jump, providing a high-intensity workout.",
    instructions: [
      "Start in a standing position",
      "Squat down and place your hands on the floor",
      "Kick your feet back into a plank position",
      "Perform a push-up",
      "Jump your feet back to your hands",
      "Explosively jump up with arms overhead"
    ],
    variations: ["No push-up burpees", "No jump burpees", "Box jump burpees"],
  },
  "Mountain Climbers": {
    description: "A dynamic exercise that works your core, shoulders, and legs. It mimics the motion of climbing a mountain in a plank position.",
    instructions: [
      "Start in a high plank position",
      "Keep your core engaged and back flat",
      "Bring one knee towards your chest",
      "Return to plank and switch legs",
      "Maintain a steady rhythm"
    ],
    variations: ["Slow mountain climbers", "Cross-body mountain climbers", "Sliding mountain climbers"],
  },
  Lunges: {
    description: "A unilateral exercise that builds leg strength and improves balance. Lunges target the quads, hamstrings, and glutes.",
    instructions: [
      "Stand with feet hip-width apart",
      "Step forward with one leg",
      "Lower your hips until both knees are bent at 90 degrees",
      "Keep your front knee above your ankle",
      "Push through your front heel to return to start"
    ],
    variations: ["Forward lunges", "Reverse lunges", "Walking lunges"],
  },
  "Bicycle Crunches": {
    description: "An abdominal exercise that targets the obliques and core. It involves alternating bringing your elbow to the opposite knee.",
    instructions: [
      "Lie on your back with hands behind your head",
      "Lift your shoulders off the ground",
      "Bring one knee towards your chest",
      "Rotate to bring opposite elbow to knee",
      "Switch sides in a pedaling motion"
    ],
    variations: ["Slow bicycle crunches", "Seated bicycle crunches", "Flutter kicks"],
  },
}

// Default exercise demo for exercises not in our database
const defaultExerciseDemo = {
  description: "This exercise helps build strength and endurance in targeted muscle groups.",
  instructions: [
    "Start in the proper position",
    "Maintain proper form throughout the movement",
    "Breathe steadily - exhale during exertion",
    "Complete the full range of motion",
    "Control the movement in both directions"
  ],
  variations: ["Modified version", "Standard version", "Advanced version"],
}

export function WorkoutRecommendations() {
  const router = useRouter()
  const [refreshKey, setRefreshKey] = useState(0)
  const { workouts, loading, error } = useWorkouts()
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { user, updateXP } = useAuth()
  const { missions: activeMissions } = useMissions(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([])
  const [showVideoMap, setShowVideoMap] = useState<Record<number, boolean>>({})

  // Add state for tracking active workout
  const [activeWorkout, setActiveWorkout] = useState<any>(null)
  const [workoutInProgress, setWorkoutInProgress] = useState(false)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [exerciseTimer, setExerciseTimer] = useState(0)
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const restIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Add state for exercise demonstration
  const [showExerciseDemo, setShowExerciseDemo] = useState(false)
  const [currentExerciseDemo, setCurrentExerciseDemo] = useState<any>(null)

  // Fetch initial workout data
  useEffect(() => {
    fetchWorkouts()
  }, [])

  // Function to fetch workouts
  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/workouts')
      if (!response.ok) {
        throw new Error('Failed to fetch workouts')
      }
      const data = await response.json()
      setAiRecommendations(data || [])
    } catch (error) {
      console.error('Error fetching workouts:', error)
      setAiRecommendations([])
    }
  }

  // Display error message if there's an issue loading workouts
  useEffect(() => {
    if (error) {
      toast({
        title: "Workout Data Issue",
        description: error,
        variant: "destructive",
      })
    }
  }, [error])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchWorkouts()
      toast({
        title: "Workouts Refreshed",
        description: "Your workout recommendations have been updated.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error refreshing workouts:', error)
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh workouts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleViewWorkout = (workout: any) => {
    setSelectedWorkout(workout)
    setDialogOpen(true)
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

  // Add function to start workout
  const handleStartWorkout = (workout: any) => {
    setActiveWorkout(workout)
    setWorkoutInProgress(true)
    setCurrentExerciseIndex(0)
    setExerciseTimer(0)
    setRestTimer(0)
    setIsResting(false)
    setDialogOpen(false)
  }

  // Add function to complete current exercise
  const handleCompleteExercise = () => {
    if (!activeWorkout) return

    // If this was the last exercise, complete the workout
    if (currentExerciseIndex >= activeWorkout.exercises.length - 1) {
      handleCompleteWorkout()
      return
    }

    // Otherwise, start rest period
    setIsResting(true)
    // Get rest time from current exercise, fallback to 60 seconds if not specified
    const currentExercise = activeWorkout.exercises[currentExerciseIndex]
    const restTime = typeof currentExercise === 'string' ? 60 : (currentExercise.rest || 60)
    setRestTimer(restTime)

    // Clear any existing interval
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current)
    }

    // Set up timer to move to next exercise after rest
    restIntervalRef.current = setInterval(() => {
      setRestTimer((prev) => {
        if (prev <= 1) {
          if (restIntervalRef.current) {
            clearInterval(restIntervalRef.current)
          }
          setIsResting(false)
          setCurrentExerciseIndex((prev) => prev + 1)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Update handleCompleteWorkout to include more XP rewards
  const handleCompleteWorkout = async () => {
    try {
      let xpGained = 0;

      if (activeWorkout) {
        // Base XP on difficulty
        switch (activeWorkout.difficulty?.toLowerCase()) {
          case "beginner":
            xpGained = 50;
            break;
          case "intermediate":
            xpGained = 100;
            break;
          case "advanced":
            xpGained = 150;
            break;
          default:
            xpGained = 75;
        }

        // Add bonus XP based on duration
        if (activeWorkout.duration) {
          xpGained += Math.floor(activeWorkout.duration / 2);
        }

        // Add bonus XP for completing all exercises
        xpGained += 25;

        // Award XP to the user
        await updateXP(xpGained);

        toast({
          title: "Workout Completed! 🎉",
          description: (
            <div className="space-y-1">
              <p>Congratulations on completing {activeWorkout.title}!</p>
              <p className="font-semibold text-yellow-600">
                You've earned {xpGained} XP:
              </p>
              <ul className="text-sm list-disc list-inside">
                <li>Base workout: {xpGained - 25} XP</li>
                <li>Completion bonus: 25 XP</li>
              </ul>
            </div>
          ),
          variant: "default",
        });
      } else {
        toast({
          title: "Workout Completed!",
          description: "Great job on finishing your workout!",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error awarding XP:", error);
      toast({
        title: "Workout Completed",
        description: "Your workout was completed, but there was an issue awarding XP.",
        variant: "destructive",
      });
    } finally {
      setWorkoutInProgress(false);
      setActiveWorkout(null);
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current);
      }
    }
  };

  // Add function to cancel workout
  const handleCancelWorkout = () => {
    if (confirm("Are you sure you want to cancel this workout?")) {
      setWorkoutInProgress(false)
      setActiveWorkout(null)
      // Clear the interval when the workout is cancelled
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current)
      }
    }
  }

  const getExerciseName = (workout: any): string => {
    // Add safety check for undefined workout or exercises
    if (!workout) return "Push-ups"
    if (!workout.exercises || !Array.isArray(workout.exercises) || workout.exercises.length === 0) {
      return "Push-ups"
    }

    // Add safety check for first exercise name
    if (!workout.exercises[0] || !workout.exercises[0].name) {
      return "Push-ups"
    }

    return workout.exercises[0].name
  }

  // Mock data for mission alignments
  const missionAlignments = [
    { workoutId: "1", alignedMissions: [{ _id: "m1", title: "Strength Training I", progress: 50 }] },
    { workoutId: "2", alignedMissions: [] },
  ]

  // Mock data for recommended workouts
  const recommendedWorkouts = [
    {
      _id: "1",
      title: "Full Body Strength Training",
      difficulty: "intermediate",
      duration: 45,
      categories: ["strength", "core"],
      exercises: [{ name: "Push-ups" }, { name: "Squats" }],
    },
    {
      _id: "2",
      title: "Cardio Blast HIIT",
      difficulty: "advanced",
      duration: 30,
      categories: ["cardio", "hiit"],
      exercises: [{ name: "Jumping Jacks" }, { name: "Burpees" }],
    },
  ]

  // Declare hasAlignedMissions
  const hasAlignedMissions = false

  // Add a fallback for when there are no workouts available
  const displayWorkouts =
    aiRecommendations.length > 0
      ? aiRecommendations
      : recommendedWorkouts.length > 0
        ? recommendedWorkouts
        : workouts.slice(0, 2)

  // Add function to toggle video visibility
  const toggleVideo = (index: number) => {
    setShowVideoMap(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  // Add logging to debug AI recommendations
  useEffect(() => {
    console.log("AI Recommendations:", aiRecommendations);
  }, [aiRecommendations]);

  useEffect(() => {
    console.log("Workouts from useWorkouts hook:", workouts);
  }, [workouts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Workout Recommendations</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {aiRecommendations.map((workout, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{workout?.name || 'Workout'}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(workout?.difficulty || 'beginner')}`}>
                  {workout?.difficulty || 'beginner'}
                </span>
              </div>

              {workout?.videoUrl && (
                <div className="mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mb-2"
                    onClick={() => toggleVideo(index)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {showVideoMap[index] ? 'Hide Video' : 'Watch Technique'}
                  </Button>
                  
                  {showVideoMap[index] && (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={workout.videoUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span>{workout?.duration || '30'} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-yellow-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium text-yellow-600">
                      {(() => {
                        // Calculate XP based on difficulty and duration
                        let xp = 0;
                        switch (workout?.difficulty?.toLowerCase()) {
                          case "beginner":
                            xp = 50;
                            break;
                          case "intermediate":
                            xp = 100;
                            break;
                          case "advanced":
                            xp = 150;
                            break;
                          default:
                            xp = 75;
                        }
                        // Add bonus XP based on duration
                        xp += Math.floor((workout?.duration || 30) / 2);
                        return `${xp} XP`;
                      })()}
                    </span>
                  </div>
                </div>

                {workout?.exercises && workout.exercises.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Exercises Include:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {workout.exercises.map((exercise: any, i: number) => (
                        <li key={i}>{typeof exercise === 'string' ? exercise : exercise.name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {workout?.instructions && workout.instructions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Instructions:</h4>
                    <ul className="list-decimal list-inside space-y-1 text-gray-600">
                      {workout.instructions.map((instruction: string, i: number) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
              <div className="flex gap-4 w-full">
                <Button
                  className="flex-1"
                  onClick={() => handleViewWorkout(workout)}
                >
                  View Details
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleStartWorkout(workout)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Workout
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Exercise Demo Dialog */}
      <Dialog open={showExerciseDemo} onOpenChange={setShowExerciseDemo}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>How to do: {currentExerciseDemo?.name}</DialogTitle>
            <DialogDescription>{currentExerciseDemo?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Exercise instructions */}
            <div>
              <h4 className="text-sm font-medium mb-2">Step-by-Step Instructions</h4>
              <ol className="space-y-2">
                {currentExerciseDemo?.instructions?.map((instruction: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <div className="rounded-full bg-blue-100 text-blue-800 w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
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

      {/* Workout Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedWorkout?.title || 'Workout Details'}</DialogTitle>
            <DialogDescription>
              {selectedWorkout?.difficulty || 'beginner'} • {selectedWorkout?.duration || '30'} min
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedWorkout?.categories && selectedWorkout.categories.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedWorkout.categories.map((category: string) => (
                    <span key={category} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedWorkout?.exercises && selectedWorkout.exercises.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Exercises</h4>
                <div className="space-y-3">
                  {selectedWorkout.exercises.map((exercise: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{typeof exercise === 'string' ? exercise : exercise.name}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleShowExerciseDemo(typeof exercise === 'string' ? exercise : exercise.name)}
                        >
                          <Info className="h-4 w-4" />
                          <span className="sr-only">How to do {typeof exercise === 'string' ? exercise : exercise.name}</span>
                        </Button>
                      </div>
                      {typeof exercise !== 'string' && (
                        <div className="text-sm text-gray-600">
                          {exercise.sets || 3} sets × {exercise.reps || 10} reps • {typeof exercise.rest === 'number' ? exercise.rest : 30}s rest
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button className="w-full" onClick={() => handleStartWorkout(selectedWorkout)}>
                Start Workout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add workout in progress dialog */}
      {workoutInProgress && activeWorkout && (
        <Dialog open={workoutInProgress} onOpenChange={setWorkoutInProgress}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{activeWorkout.title || 'Workout in Progress'}</DialogTitle>
              <DialogDescription>
                {activeWorkout.difficulty || 'beginner'} • {activeWorkout.duration || '30'} min
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {isResting ? (
                <div className="text-center py-8">
                  <h3 className="text-xl font-bold mb-2">Rest Time</h3>
                  <p className="text-4xl font-bold text-blue-600 mb-4">{Math.max(0, restTimer)}s</p>
                  <p className="text-sm text-gray-600">
                    Next exercise: {activeWorkout.exercises && activeWorkout.exercises[currentExerciseIndex + 1]
                      ? (typeof activeWorkout.exercises[currentExerciseIndex + 1] === 'string'
                        ? activeWorkout.exercises[currentExerciseIndex + 1]
                        : activeWorkout.exercises[currentExerciseIndex + 1].name)
                      : "Finish"}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setIsResting(false)
                      setCurrentExerciseIndex((prev) => prev + 1)
                    }}
                  >
                    Skip Rest
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg">
                        {activeWorkout.exercises && activeWorkout.exercises[currentExerciseIndex]
                          ? (typeof activeWorkout.exercises[currentExerciseIndex] === 'string'
                            ? activeWorkout.exercises[currentExerciseIndex]
                            : activeWorkout.exercises[currentExerciseIndex].name)
                          : "Exercise"}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {currentExerciseIndex + 1}/{activeWorkout.exercises?.length || 1}
                      </span>
                    </div>
                    {activeWorkout.exercises && activeWorkout.exercises[currentExerciseIndex] && 
                     typeof activeWorkout.exercises[currentExerciseIndex] !== 'string' && (
                      <div className="flex justify-between text-sm text-gray-600 mb-3">
                        <span>{activeWorkout.exercises[currentExerciseIndex].sets || 3} sets</span>
                        <span>{activeWorkout.exercises[currentExerciseIndex].reps || 10} reps</span>
                        <span>{activeWorkout.exercises[currentExerciseIndex].rest || 30}s rest</span>
                      </div>
                    )}

                    {/* Add exercise instructions */}
                    {activeWorkout.exercises && activeWorkout.exercises[currentExerciseIndex] && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="font-medium text-sm mb-2">Instructions:</h4>
                        <div className="space-y-2">
                          {(() => {
                            const exerciseName = typeof activeWorkout.exercises[currentExerciseIndex] === 'string'
                              ? activeWorkout.exercises[currentExerciseIndex]
                              : activeWorkout.exercises[currentExerciseIndex].name;
                            
                            const exerciseDemo = exerciseDemos[exerciseName as keyof typeof exerciseDemos] || defaultExerciseDemo;
                            
                            return exerciseDemo.instructions.map((instruction: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <div className="rounded-full bg-blue-100 text-blue-800 w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {idx + 1}
                                </div>
                                <span>{instruction}</span>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button className="w-full mb-2" onClick={handleCompleteExercise}>
                    Complete Exercise
                  </Button>

                  <Button variant="outline" className="w-full" onClick={handleCancelWorkout}>
                    Cancel Workout
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
