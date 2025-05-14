"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

export function UserProfile() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <Skeleton className="h-6 w-40" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mt-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return null
  }

  // Ensure user object and XP values are valid
  const currentXP = user?.xp?.current !== undefined && typeof user.xp.current === "number" ? user.xp.current : 0
  const maxXP = user?.xp?.max !== undefined && typeof user.xp.max === "number" ? user.xp.max : 1000

  // Ensure progress is between 0-100% and handle division by zero
  const progressPercentage = maxXP > 0 ? Math.min(Math.max((currentXP / maxXP) * 100, 0), 100) : 0

  // Additional safety check for user name
  const userName = user?.name || "User"
  const initials = userName
    .split(" ")
    .map((name) => (name && name[0]) || "")
    .join("")
    .toUpperCase()

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Level</span>
                  <span className="text-sm font-medium">{user.level}</span>
                </div>
                <div className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">{user.status}</div>
                <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">{user.badge}</div>
              </div>
            </div>

            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">XP Progress</span>
              <span className="text-sm font-medium">
                {currentXP} / {maxXP} XP
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
