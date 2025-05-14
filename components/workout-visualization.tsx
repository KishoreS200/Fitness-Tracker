"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Heart, ArrowRight, Play, Info } from "lucide-react"

interface Exercise {
  id: string
  name: string
  description: string
  imageUrl: string
  difficulty: "beginner" | "intermediate" | "advanced"
  targetMuscles: string[]
  duration: number
  sets?: number
  reps?: number
}

interface MuscleGroup {
  id: string
  name: string
  exercises: Exercise[]
  color: string
  position: {
    x: number
    y: number
  }
}

export function WorkoutVisualization() {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null)

  const muscleGroups: MuscleGroup[] = [
    {
      id: "chest",
      name: "Chest",
      color: "#FF5757",
      position: { x: 50, y: 25 },
      exercises: [
        {
          id: "push-ups",
          name: "Push-Ups",
          description: "Classic chest exercise that also engages triceps and shoulders",
          imageUrl: "/placeholder.svg?height=150&width=200",
          difficulty: "beginner",
          targetMuscles: ["chest", "triceps", "shoulders"],
          duration: 60,
          sets: 3,
          reps: 12,
        },
        {
          id: "chest-press",
          name: "Dumbbell Chest Press",
          description: "Targets the pectoral muscles with added resistance",
          imageUrl: "/placeholder.svg?height=150&width=200",
          difficulty: "intermediate",
          targetMuscles: ["chest", "triceps"],
          duration: 45,
          sets: 3,
          reps: 10,
        },
      ],
    },
    {
      id: "abs",
      name: "Abs",
      color: "#5271FF",
      position: { x: 50, y: 45 },
      exercises: [
        {
          id: "crunches",
          name: "Crunches",
          description: "Targets the rectus abdominis for core strength",
          imageUrl: "/placeholder.svg?height=150&width=200",
          difficulty: "beginner",
          targetMuscles: ["abs"],
          duration: 60,
          sets: 3,
          reps: 15,
        },
        {
          id: "plank",
          name: "Plank",
          description: "Isometric core exercise that engages multiple muscle groups",
          imageUrl: "/placeholder.svg?height=150&width=200",
          difficulty: "beginner",
          targetMuscles: ["abs", "shoulders", "back"],
          duration: 60,
        },
      ],
    },
    {
      id: "back",
      name: "Back",
      color: "#38B6FF",
      position: { x: 50, y: 35 },
      exercises: [
        {
          id: "pull-ups",
          name: "Pull-Ups",
          description: "Compound exercise for back and arm strength",
          imageUrl: "/placeholder.svg?height=150&width=200",
          difficulty: "advanced",
          targetMuscles: ["back", "biceps"],
          duration: 45,
          sets: 3,
          reps: 8,
        },
        {
          id: "rows",
          name: "Dumbbell Rows",
          description: "Targets the latissimus dorsi and rhomboids",
          imageUrl: "/placeholder.svg?height=150&width=200",
          difficulty: "intermediate",
          targetMuscles: ["back", "biceps"],
          duration: 60,
          sets: 3,
          reps: 12,
        },
      ],
    },
    {
      id: "arms",
      name: "Arms",
      color: "#8C52FF",
      position: { x: 75, y: 35 },
      exercises: [
        {
          id: "bicep-curls",
          name: "Bicep Curls",
          description: "Isolation exercise for the biceps",
          imageUrl: "/placeholder.svg?height=150&width=200",
          difficulty: "beginner",
          targetMuscles: ["biceps"],
          duration: 45,
          sets: 3,
          reps: 12,
        },
        {
          id: "tricep-dips",
          name: "Tricep Dips",
          description: "Targets the triceps with bodyweight resistance",
          imageUrl: "/placeholder.svg?height=150&width=200",
          difficulty: "intermediate",
          targetMuscles: ["triceps"],
          duration: 45,
          sets: 3,
          reps: 10,
        },
      ],
    },
    {
      id: "legs",
      name: "Legs",
      color: "#5CE1E6",
      position: { x: 50, y: 70 },
      exercises: [
        {
          id: "squats",
          name: "Squats",
          description: "Compound exercise for lower body strength",
          imageUrl: "/placeholder.svg?height=150&width=200",
          difficulty: "beginner",
          targetMuscles: ["quads", "glutes", "hamstrings"],
          duration: 60,
          sets: 3,
          reps: 15,
        },
        {
          id: "lunges",
          name: "Lunges",
          description: "Unilateral exercise for leg strength and balance",
          imageUrl: "/placeholder.svg?height=150&width=200",
          difficulty: "intermediate",
          targetMuscles: ["quads", "glutes", "hamstrings"],
          duration: 60,
          sets: 3,
          reps: 12,
        },
      ],
    },
    {
      id: "shoulders",
      name: "Shoulders",
      color: "#FF66C4",
      position: { x: 50, y: 15 },
      exercises: [
        {
          id: "shoulder-press",
          name: "Shoulder Press",
          description: "Targets the deltoid muscles for shoulder strength",
          imageUrl: "/placeholder.svg?height=150&width=200",
          difficulty: "intermediate",
          targetMuscles: ["shoulders", "triceps"],
          duration: 45,
          sets: 3,
          reps: 10,
        },
        {
          id: "lateral-raises",
          name: "Lateral Raises",
          description: "Isolation exercise for the lateral deltoids",
          imageUrl: "/placeholder.svg?height=150&width=200",
          difficulty: "beginner",
          targetMuscles: ["shoulders"],
          duration: 45,
          sets: 3,
          reps: 12,
        },
      ],
    },
  ]

  const getSelectedMuscleGroup = () => {
    return muscleGroups.find((group) => group.id === selectedMuscle) || null
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-blue-100 text-blue-800"
      case "advanced":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-blue-600" />
          Targeted Workout Guide
        </CardTitle>
        <CardDescription>Select a muscle group to see exercises that target that area</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-[3/4] bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
            {/* Human body silhouette */}
            <div className="relative w-[280px] h-[400px]">
              {/* Body silhouette - simplified representation */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                {/* Head */}
                <circle cx="50" cy="10" r="8" fill="#e0e0e0" stroke="#c0c0c0" />

                {/* Torso */}
                <path d="M42,18 L42,45 L58,45 L58,18 Z" fill="#e0e0e0" stroke="#c0c0c0" />

                {/* Arms */}
                <path d="M42,18 L30,35 L28,50" fill="none" stroke="#c0c0c0" strokeWidth="6" />
                <path d="M58,18 L70,35 L72,50" fill="none" stroke="#c0c0c0" strokeWidth="6" />

                {/* Legs */}
                <path d="M42,45 L40,75 L38,95" fill="none" stroke="#c0c0c0" strokeWidth="8" />
                <path d="M58,45 L60,75 L62,95" fill="none" stroke="#c0c0c0" strokeWidth="8" />
              </svg>

              {/* Clickable muscle groups */}
              {muscleGroups.map((group) => (
                <button
                  key={group.id}
                  className={`absolute rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  style={{
                    left: `${group.position.x}%`,
                    top: `${group.position.y}%`,
                    transform: "translate(-50%, -50%)",
                    backgroundColor: selectedMuscle === group.id ? group.color : `${group.color}80`,
                    width: selectedMuscle === group.id ? "50px" : "40px",
                    height: selectedMuscle === group.id ? "50px" : "40px",
                    zIndex: selectedMuscle === group.id ? 10 : 5,
                    boxShadow: selectedMuscle === group.id ? "0 0 15px rgba(0,0,0,0.3)" : "none",
                  }}
                  onClick={() => setSelectedMuscle(group.id === selectedMuscle ? null : group.id)}
                >
                  <span className="sr-only">{group.name}</span>
                </button>
              ))}

              {/* Labels for muscle groups */}
              {muscleGroups.map((group) => (
                <div
                  key={`label-${group.id}`}
                  className="absolute text-xs font-bold text-gray-700 pointer-events-none"
                  style={{
                    left: `${group.position.x}%`,
                    top: `${group.position.y + (group.id === "shoulders" ? -12 : 12)}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {group.name}
                </div>
              ))}
            </div>
          </div>

          <div>
            {selectedMuscle ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getSelectedMuscleGroup()?.color }}
                  ></div>
                  <h3 className="text-lg font-semibold">{getSelectedMuscleGroup()?.name} Exercises</h3>
                </div>

                <div className="space-y-4">
                  {getSelectedMuscleGroup()?.exercises.map((exercise) => (
                    <Card key={exercise.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="sm:w-1/3 rounded-md overflow-hidden bg-gray-100">
                            <div className="aspect-video relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <img
                                  src={exercise.imageUrl || "/placeholder.svg"}
                                  alt={exercise.name}
                                  className="w-full h-full object-cover"
                                />
                                <Button
                                  size="icon"
                                  className="absolute inset-0 m-auto bg-blue-600/80 hover:bg-blue-600 w-10 h-10 rounded-full"
                                >
                                  <Play className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="sm:w-2/3">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">{exercise.name}</h4>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(exercise.difficulty)}`}
                              >
                                {exercise.difficulty}
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {exercise.targetMuscles.map((muscle) => (
                                <span key={muscle} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                  {muscle}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Dumbbell className="h-4 w-4 text-gray-500" />
                                {exercise.sets && exercise.reps ? (
                                  <span>
                                    {exercise.sets} sets × {exercise.reps} reps
                                  </span>
                                ) : (
                                  <span>{exercise.duration}s</span>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4 text-red-500" />
                                <span>
                                  {exercise.difficulty === "beginner"
                                    ? "Low"
                                    : exercise.difficulty === "intermediate"
                                      ? "Medium"
                                      : "High"}{" "}
                                  intensity
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button className="w-full mt-2">
                  View All {getSelectedMuscleGroup()?.name} Exercises
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <Info className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Select a Muscle Group</h3>
                <p className="text-gray-600 mb-4">
                  Click on any highlighted area of the body to see exercises that target that muscle group
                </p>
                <div className="grid grid-cols-3 gap-2 w-full max-w-md">
                  {muscleGroups.map((group) => (
                    <Button
                      key={group.id}
                      variant="outline"
                      className="w-full"
                      style={{ borderColor: group.color, color: group.color }}
                      onClick={() => setSelectedMuscle(group.id)}
                    >
                      {group.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
