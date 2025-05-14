"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Flame, Target, Award, PlusCircle, Dumbbell } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function StatsCards() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [animatedStats, setAnimatedStats] = useState({
    streak: 0,
    missions: 0,
    badges: 0,
  })
  const [isAnimating, setIsAnimating] = useState(false)

  // Check if user has any meaningful stats
  const hasStats =
    user &&
    ((user.stats?.streak && user.stats.streak > 0) ||
      (user.stats?.missions && user.stats.missions > 0) ||
      (user.stats?.badges && user.stats.badges > 0))

  // Animate stats when they change
  useEffect(() => {
    if (!user || !user.stats) return

    // Only animate if we have real stats
    if (hasStats) {
      setIsAnimating(true)

      // Start from current animated values
      const startValues = { ...animatedStats }
      const endValues = {
        streak: user.stats.streak || 0,
        missions: user.stats.missions || 0,
        badges: user.stats.badges || 0,
      }

      // Calculate step sizes for smooth animation
      const steps = 20
      const stepSizes = {
        streak: (endValues.streak - startValues.streak) / steps,
        missions: (endValues.missions - startValues.missions) / steps,
        badges: (endValues.badges - startValues.badges) / steps,
      }

      let step = 0
      const animationInterval = setInterval(() => {
        if (step >= steps) {
          clearInterval(animationInterval)
          setAnimatedStats(endValues)
          setIsAnimating(false)
          return
        }

        setAnimatedStats((prev) => ({
          streak: Math.round(prev.streak + stepSizes.streak),
          missions: Math.round(prev.missions + stepSizes.missions),
          badges: Math.round(prev.badges + stepSizes.badges),
        }))

        step++
      }, 50)

      return () => clearInterval(animationInterval)
    } else {
      // If no stats, just set to zeros without animation
      setAnimatedStats({
        streak: 0,
        missions: 0,
        badges: 0,
      })
    }
  }, [user, hasStats])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Skeleton className="w-10 h-10 rounded-full mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!hasStats) {
    return (
      <div className="mb-6">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="py-8">
              <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stats to display yet</h3>
              <p className="text-sm text-gray-500 mb-4">
                Complete missions, maintain streaks, and earn badges to see your stats here
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 max-w-2xl mx-auto">
                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Flame className="h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-sm font-medium text-blue-700">Start a streak</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Target className="h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-sm font-medium text-blue-700">Complete missions</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Dumbbell className="h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-sm font-medium text-blue-700">Track workouts</p>
                  </CardContent>
                </Card>
              </div>
              <Button onClick={() => router.push("/missions")} className="flex items-center gap-2 mx-auto mt-6">
                <PlusCircle className="h-4 w-4" />
                Start a Mission
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className={isAnimating ? "border-blue-200" : ""}>
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <Flame className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{animatedStats.streak}</div>
          <div className="text-sm text-gray-500">Day Streak</div>
        </CardContent>
      </Card>

      <Card className={isAnimating ? "border-blue-200" : ""}>
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{animatedStats.missions}</div>
          <div className="text-sm text-gray-500">Missions</div>
        </CardContent>
      </Card>

      <Card className={isAnimating ? "border-blue-200" : ""}>
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <Award className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{animatedStats.badges}</div>
          <div className="text-sm text-gray-500">Badges</div>
        </CardContent>
      </Card>
    </div>
  )
}
