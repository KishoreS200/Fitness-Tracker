"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Play, Info, CheckCircle } from "lucide-react"

interface ExerciseVideo {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  tips: string[]
  duration: string
}

interface ExerciseVideoTipsProps {
  exerciseName: string
  category: string
  missionTitle?: string
}

export function ExerciseVideoTips({ exerciseName, category, missionTitle }: ExerciseVideoTipsProps) {
  const [videoOpen, setVideoOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<ExerciseVideo | null>(null)

  // Exercise video database - in a real app, this would come from an API
  const exerciseVideos: Record<string, ExerciseVideo> = {
    "Push-ups": {
      id: "push-ups",
      title: "Perfect Push-up Form",
      description:
        "Learn the correct technique for push-ups to maximize chest and tricep engagement while protecting your shoulders and wrists.",
      videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
      tips: [
        "Keep your body in a straight line from head to heels",
        "Position hands slightly wider than shoulder-width",
        "Lower until your chest nearly touches the floor",
        "Keep elbows at about a 45-degree angle to your body",
        "Breathe in as you lower, out as you push up",
      ],
      duration: "3:24",
    },
    Squats: {
      id: "squats",
      title: "Proper Squat Technique",
      description: "Master the fundamental squat movement pattern for stronger legs and better mobility.",
      videoUrl: "https://www.youtube.com/embed/YaXPRqUwItQ",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
      tips: [
        "Keep feet shoulder-width apart or slightly wider",
        "Maintain weight in your heels and mid-foot",
        "Keep your chest up and back straight",
        "Push your knees outward in line with your toes",
        "Descend until thighs are parallel to the ground (or as low as comfortable)",
      ],
      duration: "4:12",
    },
    Lunges: {
      id: "lunges",
      title: "Lunge Form Guide",
      description: "Learn how to perform lunges correctly to build leg strength and improve balance.",
      videoUrl: "https://www.youtube.com/embed/QOVaHwm-Q6U",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
      tips: [
        "Step forward with one leg, lowering your hips until both knees are bent at 90 degrees",
        "Keep your torso upright",
        "Front knee should track over ankle, not past toes",
        "Keep back knee from touching the ground",
        "Push through the heel of your front foot to return to starting position",
      ],
      duration: "3:45",
    },
    Plank: {
      id: "plank",
      title: "Perfect Plank Position",
      description: "Learn how to hold a proper plank to strengthen your core and improve stability.",
      videoUrl: "https://www.youtube.com/embed/pSHjTRCQxIw",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
      tips: [
        "Keep your body in a straight line from head to heels",
        "Engage your core by pulling your belly button toward your spine",
        "Keep shoulders directly above elbows",
        "Don't let your hips sag or pike up",
        "Breathe normally throughout the hold",
      ],
      duration: "2:58",
    },
    Running: {
      id: "running",
      title: "Proper Running Form",
      description: "Improve your running efficiency and reduce injury risk with proper technique.",
      videoUrl: "https://www.youtube.com/embed/brFHyOtTwH4",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
      tips: [
        "Land midfoot, not on your heels or toes",
        "Keep your shoulders relaxed and elbows at 90 degrees",
        "Maintain a slight forward lean from the ankles",
        "Look ahead, not down at your feet",
        "Take shorter, quicker steps rather than long strides",
      ],
      duration: "5:17",
    },
    "Jumping Jacks": {
      id: "jumping-jacks",
      title: "Jumping Jack Technique",
      description: "Learn how to perform jumping jacks correctly for an effective cardio warm-up.",
      videoUrl: "https://www.youtube.com/embed/c4DAnQ6DtF8",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
      tips: [
        "Start with feet together and arms at sides",
        "Jump while spreading legs and raising arms overhead",
        "Land softly with slightly bent knees",
        "Keep movements controlled and rhythmic",
        "Maintain good posture throughout",
      ],
      duration: "1:45",
    },
    Yoga: {
      id: "yoga",
      title: "Basic Yoga Flow",
      description: "Learn fundamental yoga poses and transitions for improved flexibility and mindfulness.",
      videoUrl: "https://www.youtube.com/embed/v7AYKMP6rOE",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
      tips: [
        "Focus on your breath throughout the practice",
        "Move slowly and mindfully between poses",
        "Listen to your body and modify poses as needed",
        "Keep your core engaged for stability",
        "Aim for proper alignment rather than depth in poses",
      ],
      duration: "4:30",
    },
    Meditation: {
      id: "meditation",
      title: "Guided Meditation Basics",
      description: "Learn the fundamentals of meditation for stress reduction and mental clarity.",
      videoUrl: "https://www.youtube.com/embed/inpok4MKVLM",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
      tips: [
        "Find a comfortable seated position",
        "Focus on your breath as an anchor",
        "Notice thoughts without judgment",
        "Gently return to your breath when your mind wanders",
        "Start with short sessions and gradually increase duration",
      ],
      duration: "5:45",
    },
    Stretching: {
      id: "stretching",
      title: "Full Body Stretching Routine",
      description: "Improve flexibility and reduce muscle tension with this comprehensive stretching routine.",
      videoUrl: "https://www.youtube.com/embed/sTxC3J3gQEU",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
      tips: [
        "Hold each stretch for 20-30 seconds",
        "Breathe deeply and relax into each stretch",
        "Never stretch to the point of pain",
        "Avoid bouncing in stretches",
        "Stretch when muscles are warm for best results",
      ],
      duration: "6:20",
    },
    HIIT: {
      id: "hiit",
      title: "High-Intensity Interval Training Basics",
      description: "Learn proper form for common HIIT exercises to maximize calorie burn and cardiovascular benefits.",
      videoUrl: "https://www.youtube.com/embed/ml6cT4AZdqI",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
      tips: [
        "Work at maximum effort during intense intervals",
        "Focus on proper form even when fatigued",
        "Take full recovery periods between intervals",
        "Modify exercises to match your fitness level",
        "Start with shorter intervals and build up gradually",
      ],
      duration: "4:15",
    },
    Balance: {
      id: "balance",
      title: "Balance Training Fundamentals",
      description: "Improve stability and proprioception with these essential balance exercises.",
      videoUrl: "https://www.youtube.com/embed/jgh6sGwtTwk",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
      tips: [
        "Focus your gaze on a fixed point",
        "Engage your core for stability",
        "Start with easier variations and progress gradually",
        "Practice barefoot when possible",
        "Use a wall or chair for support if needed",
      ],
      duration: "3:50",
    },
  }

  // Get exercise video based on name, category, or mission title
  const getExerciseVideo = () => {
    // First try to match by exact exercise name
    if (exerciseVideos[exerciseName]) {
      return exerciseVideos[exerciseName]
    }

    // Check mission title for specific keywords
    if (missionTitle) {
      const missionTitleLower = missionTitle.toLowerCase()

      if (missionTitleLower.includes("yoga") || missionTitleLower.includes("flexibility")) {
        return exerciseVideos["Yoga"]
      }

      if (
        missionTitleLower.includes("meditation") ||
        missionTitleLower.includes("stress") ||
        missionTitleLower.includes("mindful")
      ) {
        return exerciseVideos["Meditation"]
      }

      if (missionTitleLower.includes("stretch")) {
        return exerciseVideos["Stretching"]
      }

      if (missionTitleLower.includes("hiit") || missionTitleLower.includes("intensity")) {
        return exerciseVideos["HIIT"]
      }

      if (missionTitleLower.includes("balance")) {
        return exerciseVideos["Balance"]
      }

      if (
        missionTitleLower.includes("run") ||
        missionTitleLower.includes("step") ||
        missionTitleLower.includes("cardio")
      ) {
        return exerciseVideos["Running"]
      }

      if (missionTitleLower.includes("strength") || missionTitleLower.includes("core")) {
        return exerciseVideos["Push-ups"]
      }
    }

    // If no match by mission title, try to match by category
    const categoryMap: Record<string, string> = {
      cardio: "Running",
      strength: "Push-ups",
      flexibility: "Stretching",
      mindfulness: "Meditation",
      core: "Plank",
    }

    const fallbackExercise = categoryMap[category.toLowerCase()] || "Push-ups"
    return exerciseVideos[fallbackExercise]
  }

  const handleOpenVideo = () => {
    const video = getExerciseVideo()
    setCurrentVideo(video)
    setVideoOpen(true)
  }

  return (
    <>
      <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleOpenVideo}>
        <Play className="h-3 w-3" />
        <span>Watch Technique</span>
      </Button>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentVideo?.title}</DialogTitle>
            <DialogDescription>{currentVideo?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Video embed */}
            <div className="aspect-video bg-black rounded-md overflow-hidden">
              {currentVideo?.videoUrl && (
                <iframe
                  src={currentVideo.videoUrl}
                  className="w-full h-full"
                  title={currentVideo.title}
                  allowFullScreen
                ></iframe>
              )}
            </div>

            {/* Tips section */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  Key Technique Tips
                </h3>
                <ul className="space-y-2">
                  {currentVideo?.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
