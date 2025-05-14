export const workouts = [
  {
    id: 1,
    name: "Full Body Strength",
    difficulty: "intermediate",
    duration: "45",
    description: "A comprehensive full-body workout targeting all major muscle groups",
    videoUrl: "https://www.youtube.com/embed/UBMk30rjy0o",
    exercises: [
      "Push-ups",
      "Squats",
      "Plank",
      "Dumbbell Rows",
      "Lunges"
    ],
    instructions: [
      "Warm up with 5 minutes of light cardio",
      "Perform each exercise for 45 seconds",
      "Rest 30 seconds between exercises",
      "Complete 3 rounds of all exercises",
      "Cool down with light stretching"
    ],
    details: {
      sets: 3,
      restBetweenSets: "60 sec",
      equipment: ["Dumbbells", "Exercise Mat"],
      targetMuscles: ["Chest", "Back", "Legs", "Core"],
      intensity: "Moderate to High"
    }
  },
  {
    id: 2,
    name: "HIIT Cardio Blast",
    difficulty: "advanced",
    duration: "30",
    description: "High-intensity interval training to boost cardio and burn calories",
    videoUrl: "https://www.youtube.com/embed/ml6cT4AZdqI",
    exercises: [
      "Jumping Jacks",
      "Mountain Climbers",
      "Burpees",
      "High Knees",
      "Jump Squats"
    ],
    instructions: [
      "Start with a 3-minute dynamic warm-up",
      "Work for 30 seconds at maximum effort",
      "Rest for 15 seconds between exercises",
      "Complete 4 rounds of all exercises",
      "Finish with a 3-minute cool-down"
    ],
    details: {
      sets: 4,
      restBetweenSets: "45 sec",
      equipment: ["None required"],
      targetMuscles: ["Full Body", "Cardiovascular System"],
      intensity: "High"
    }
  },
  {
    id: 3,
    name: "Core Strength Master",
    difficulty: "beginner",
    duration: "20",
    description: "Focus on building core strength and stability",
    videoUrl: "https://www.youtube.com/embed/AnYl6Nk9GOA",
    exercises: [
      "Plank Hold",
      "Bicycle Crunches",
      "Russian Twists",
      "Dead Bug",
      "Bird Dog"
    ],
    instructions: [
      "Begin with a brief core activation warm-up",
      "Hold each position for 30-45 seconds",
      "Maintain proper form throughout",
      "Rest when needed while maintaining form",
      "Focus on controlled movements"
    ],
    details: {
      sets: 3,
      restBetweenSets: "30 sec",
      equipment: ["Exercise Mat"],
      targetMuscles: ["Abs", "Lower Back", "Obliques"],
      intensity: "Low to Moderate"
    }
  }
]; 