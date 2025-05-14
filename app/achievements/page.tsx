"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Award, Trophy, Target, Dumbbell, Flame, Heart, Calendar, Zap, Star, Gift, Share2, Unlock } from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  category: "workout" | "streak" | "milestone" | "challenge" | "nutrition"
  icon: React.ReactNode
  progress: number
  maxProgress: number
  completed: boolean
  dateCompleted?: string
  xp: number
  level: "bronze" | "silver" | "gold" | "platinum"
}

interface Reward {
  id: string
  name: string
  description: string
  cost: number
  category: "premium" | "partner" | "virtual"
  icon: React.ReactNode
  available: boolean
  featured?: boolean
  expiresIn?: string
}

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState("achievements")
  const [userPoints, setUserPoints] = useState(750)

  const achievements: Achievement[] = [
    {
      id: "1",
      name: "Workout Warrior",
      description: "Complete 10 workouts",
      category: "workout",
      icon: <Dumbbell className="h-5 w-5" />,
      progress: 10,
      maxProgress: 10,
      completed: true,
      dateCompleted: "Feb 15, 2023",
      xp: 100,
      level: "gold",
    },
    {
      id: "2",
      name: "Early Bird",
      description: "Complete 5 workouts before 8 AM",
      category: "workout",
      icon: <Flame className="h-5 w-5" />,
      progress: 3,
      maxProgress: 5,
      completed: false,
      xp: 50,
      level: "silver",
    },
    {
      id: "3",
      name: "Consistency King",
      description: "Maintain a 7-day streak",
      category: "streak",
      icon: <Calendar className="h-5 w-5" />,
      progress: 7,
      maxProgress: 7,
      completed: true,
      dateCompleted: "Feb 10, 2023",
      xp: 75,
      level: "bronze",
    },
    {
      id: "4",
      name: "Marathon Master",
      description: "Run a total of 26.2 miles",
      category: "milestone",
      icon: <Target className="h-5 w-5" />,
      progress: 18.5,
      maxProgress: 26.2,
      completed: false,
      xp: 150,
      level: "gold",
    },
    {
      id: "5",
      name: "Heart Health Hero",
      description: "Maintain heart rate in target zone for 30 minutes",
      category: "workout",
      icon: <Heart className="h-5 w-5" />,
      progress: 30,
      maxProgress: 30,
      completed: true,
      dateCompleted: "Feb 18, 2023",
      xp: 75,
      level: "silver",
    },
    {
      id: "6",
      name: "Challenge Champion",
      description: "Complete the Spring Fitness Challenge",
      category: "challenge",
      icon: <Trophy className="h-5 w-5" />,
      progress: 15,
      maxProgress: 20,
      completed: false,
      xp: 200,
      level: "platinum",
    },
    {
      id: "7",
      name: "Nutrition Ninja",
      description: "Log your meals for 14 consecutive days",
      category: "nutrition",
      icon: <Zap className="h-5 w-5" />,
      progress: 10,
      maxProgress: 14,
      completed: false,
      xp: 100,
      level: "silver",
    },
  ]

  const rewards: Reward[] = [
    {
      id: "1",
      name: "Premium Workout Plan",
      description: "Unlock a personalized 8-week training program",
      cost: 500,
      category: "premium",
      icon: <Star className="h-5 w-5" />,
      available: true,
      featured: true,
    },
    {
      id: "2",
      name: "20% Off Protein Supplements",
      description: "Discount code for our partner store",
      cost: 300,
      category: "partner",
      icon: <Gift className="h-5 w-5" />,
      available: true,
      expiresIn: "5 days",
    },
    {
      id: "3",
      name: "Exclusive Avatar Frame",
      description: "Show off your dedication with a special profile frame",
      cost: 150,
      category: "virtual",
      icon: <Award className="h-5 w-5" />,
      available: true,
    },
    {
      id: "4",
      name: "Personal Trainer Session",
      description: "30-minute virtual session with a certified trainer",
      cost: 1000,
      category: "premium",
      icon: <Dumbbell className="h-5 w-5" />,
      available: false,
    },
    {
      id: "5",
      name: "Fitness Quest Pro Membership",
      description: "1 month of premium features and content",
      cost: 2000,
      category: "premium",
      icon: <Unlock className="h-5 w-5" />,
      available: false,
      featured: true,
    },
  ]

  const getBadgeColor = (level: Achievement["level"]) => {
    switch (level) {
      case "bronze":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "silver":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "gold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "platinum":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getCategoryIcon = (category: Achievement["category"]) => {
    switch (category) {
      case "workout":
        return <Dumbbell className="h-4 w-4" />
      case "streak":
        return <Flame className="h-4 w-4" />
      case "milestone":
        return <Target className="h-4 w-4" />
      case "challenge":
        return <Trophy className="h-4 w-4" />
      case "nutrition":
        return <Zap className="h-4 w-4" />
      default:
        return <Award className="h-4 w-4" />
    }
  }

  const redeemReward = (reward: Reward) => {
    if (userPoints >= reward.cost) {
      setUserPoints((prev) => prev - reward.cost)
      alert(`You've redeemed: ${reward.name}`)
    } else {
      alert("Not enough points to redeem this reward")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold">Achievements & Rewards</h1>

          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-bold">{userPoints} points</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              <span>Rewards</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="col-span-full md:col-span-1">
                <CardHeader>
                  <CardTitle>Achievement Stats</CardTitle>
                  <CardDescription>Your progress overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">Total Achievements</h3>
                        <span className="text-2xl font-bold">
                          {achievements.filter((a) => a.completed).length}/{achievements.length}
                        </span>
                      </div>
                      <Progress
                        value={(achievements.filter((a) => a.completed).length / achievements.length) * 100}
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">Total XP</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {achievements.filter((a) => a.completed).reduce((sum, a) => sum + a.xp, 0)}
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">Rank</p>
                        <p className="text-2xl font-bold text-purple-700">Silver</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Badges Earned</h3>
                      <div className="flex flex-wrap gap-2">
                        {["bronze", "silver", "gold", "platinum"].map((level) => (
                          <div key={level} className="text-center">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                level === "bronze"
                                  ? "bg-amber-100 text-amber-800"
                                  : level === "silver"
                                    ? "bg-gray-100 text-gray-800"
                                    : level === "gold"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              <Award className="h-6 w-6" />
                            </div>
                            <p className="text-xs mt-1 capitalize">{level}</p>
                            <p className="text-xs text-gray-500">
                              {achievements.filter((a) => a.completed && a.level === level).length}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="col-span-full md:col-span-2">
                <div className="grid grid-cols-1 gap-4">
                  {achievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`${achievement.completed ? "border-green-200 bg-green-50" : ""}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-full ${
                              achievement.completed ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {achievement.icon}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <h3 className="font-medium">{achievement.name}</h3>
                                <p className="text-sm text-gray-600">{achievement.description}</p>
                              </div>
                              <Badge variant="outline" className={getBadgeColor(achievement.level)}>
                                {achievement.level}
                              </Badge>
                            </div>

                            <div className="mt-3">
                              <div className="flex justify-between items-center mb-1 text-sm">
                                <div className="flex items-center gap-1">
                                  {getCategoryIcon(achievement.category)}
                                  <span className="capitalize">{achievement.category}</span>
                                </div>
                                <span>
                                  {achievement.progress}/{achievement.maxProgress}
                                  {achievement.completed && <span className="text-green-600 ml-2">• Completed!</span>}
                                </span>
                              </div>
                              <Progress
                                value={(achievement.progress / achievement.maxProgress) * 100}
                                className={`h-2 ${achievement.completed ? "bg-green-100" : "bg-blue-100"}`}
                              />
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span>{achievement.xp} XP</span>
                              </div>

                              {achievement.completed ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">Earned on {achievement.dateCompleted}</span>
                                  <Button variant="ghost" size="sm">
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-full md:col-span-1">
                <CardHeader>
                  <CardTitle>Your Points</CardTitle>
                  <CardDescription>Redeem for exclusive rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="h-6 w-6 text-yellow-300" />
                      <h3 className="text-xl font-bold">Reward Points</h3>
                    </div>
                    <p className="text-4xl font-bold mb-2">{userPoints}</p>
                    <p className="text-sm opacity-80">Available to redeem</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">How to Earn Points</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-blue-500" />
                        <span>Complete achievements</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>Maintain daily streaks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span>Finish weekly challenges</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-blue-500" />
                        <span>Hit your daily activity goals</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="col-span-full md:col-span-2">
                <h2 className="text-lg font-bold mb-4">Featured Rewards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {rewards
                    .filter((r) => r.featured)
                    .map((reward) => (
                      <Card key={reward.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-full bg-white text-blue-600 shadow-sm">{reward.icon}</div>

                            <div className="flex-1">
                              <h3 className="font-medium">{reward.name}</h3>
                              <p className="text-sm text-gray-600 mb-3">{reward.description}</p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span className="font-bold">{reward.cost} points</span>
                                </div>

                                <Button
                                  size="sm"
                                  disabled={!reward.available || userPoints < reward.cost}
                                  onClick={() => redeemReward(reward)}
                                >
                                  {userPoints >= reward.cost ? "Redeem" : "Not Enough Points"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>

                <h2 className="text-lg font-bold mb-4">All Rewards</h2>
                <div className="space-y-4">
                  {rewards
                    .filter((r) => !r.featured)
                    .map((reward) => (
                      <Card key={reward.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-gray-100 text-gray-600">{reward.icon}</div>

                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{reward.name}</h3>
                                <Badge variant="outline">{reward.category}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">{reward.description}</p>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="font-bold">{reward.cost}</span>
                              </div>

                              <Button
                                size="sm"
                                variant="outline"
                                disabled={!reward.available || userPoints < reward.cost}
                                onClick={() => redeemReward(reward)}
                              >
                                {reward.available ? "Redeem" : "Locked"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
