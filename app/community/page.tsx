"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, Trophy, Share2, ThumbsUp, MessageCircle, Award, Target, Dumbbell } from "lucide-react"

// Sample data
const socialFeed = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SJ",
    },
    content: "Just completed my first 10K run! Feeling amazing and proud of my progress. 🏃‍♀️",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 5,
    achievement: {
      type: "mission",
      name: "10K Runner",
      icon: <Target className="h-4 w-4" />,
    },
  },
  {
    id: 2,
    user: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
    },
    content: "Hit a new PR on bench press today: 225 lbs! The strength program is really paying off.",
    timestamp: "5 hours ago",
    likes: 18,
    comments: 3,
    achievement: {
      type: "personal_record",
      name: "Bench Press PR",
      icon: <Dumbbell className="h-4 w-4" />,
    },
  },
  {
    id: 3,
    user: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ER",
    },
    content: "30 days streak! Consistency is key to progress. Thanks to everyone in the community for the motivation!",
    timestamp: "Yesterday",
    likes: 42,
    comments: 7,
    achievement: {
      type: "streak",
      name: "30 Day Streak",
      icon: <Award className="h-4 w-4" />,
    },
  },
]

const challenges = [
  {
    id: 1,
    title: "Spring Fitness Challenge",
    description: "Complete 20 workouts in 30 days",
    participants: 1243,
    daysLeft: 18,
    progress: 40,
    category: "General",
  },
  {
    id: 2,
    title: "10K Steps Daily",
    description: "Walk 10,000 steps every day for a week",
    participants: 876,
    daysLeft: 5,
    progress: 60,
    category: "Cardio",
  },
  {
    id: 3,
    title: "Strength Builder",
    description: "Complete 12 strength workouts in 4 weeks",
    participants: 654,
    daysLeft: 22,
    progress: 25,
    category: "Strength",
  },
]

const leaderboard = [
  { rank: 1, name: "Alex Thompson", points: 1250, avatar: "/placeholder.svg?height=40&width=40", initials: "AT" },
  { rank: 2, name: "Jessica Wu", points: 1180, avatar: "/placeholder.svg?height=40&width=40", initials: "JW" },
  { rank: 3, name: "David Miller", points: 1050, avatar: "/placeholder.svg?height=40&width=40", initials: "DM" },
  { rank: 4, name: "Sophia Garcia", points: 980, avatar: "/placeholder.svg?height=40&width=40", initials: "SG" },
  { rank: 5, name: "James Wilson", points: 920, avatar: "/placeholder.svg?height=40&width=40", initials: "JW" },
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed")
  const [postContent, setPostContent] = useState("")

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the post to the backend
    alert(`Post submitted: ${postContent}`)
    setPostContent("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Fitness Community</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="feed" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Social Feed</span>
                </TabsTrigger>
                <TabsTrigger value="challenges" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>Challenges</span>
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>Leaderboard</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="mt-6">
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <form onSubmit={handlePostSubmit}>
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your avatar" />
                          <AvatarFallback>YA</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder="Share your fitness journey..."
                            className="mb-2 resize-none"
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                          />
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Button type="button" variant="outline" size="sm">
                                📷 Photo
                              </Button>
                              <Button type="button" variant="outline" size="sm">
                                🏆 Achievement
                              </Button>
                            </div>
                            <Button type="submit" disabled={!postContent.trim()}>
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {socialFeed.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                            <AvatarFallback>{post.user.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium">{post.user.name}</h3>
                              <span className="text-xs text-gray-500">{post.timestamp}</span>
                            </div>

                            {post.achievement && (
                              <div className="mb-2">
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1 text-blue-600 border-blue-200 bg-blue-50"
                                >
                                  {post.achievement.icon}
                                  <span>Earned {post.achievement.name}</span>
                                </Badge>
                              </div>
                            )}

                            <p className="text-gray-700 mb-4">{post.content}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600">
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>{post.likes}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.comments}</span>
                                </Button>
                              </div>
                              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600">
                                <Share2 className="h-4 w-4" />
                                <span>Share</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="challenges" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {challenges.map((challenge) => (
                    <Card key={challenge.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{challenge.title}</CardTitle>
                            <CardDescription>{challenge.description}</CardDescription>
                          </div>
                          <Badge>{challenge.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{challenge.participants.toLocaleString()} participants</span>
                          </div>
                          <div className="text-sm text-gray-600">{challenge.daysLeft} days left</div>
                        </div>

                        <div className="h-2 bg-gray-100 rounded-full mb-4">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${challenge.progress}%` }}
                          ></div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Join Challenge</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="leaderboard" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Leaderboard</CardTitle>
                    <CardDescription>Top performers this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leaderboard.map((user, index) => (
                        <div
                          key={user.rank}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            index === 0
                              ? "bg-yellow-50 border border-yellow-200"
                              : index === 1
                                ? "bg-gray-50 border border-gray-200"
                                : index === 2
                                  ? "bg-amber-50 border border-amber-200"
                                  : "bg-white border border-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                index === 0
                                  ? "bg-yellow-200 text-yellow-800"
                                  : index === 1
                                    ? "bg-gray-200 text-gray-800"
                                    : index === 2
                                      ? "bg-amber-200 text-amber-800"
                                      : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.rank}
                            </div>
                            <Avatar>
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">
                                {index === 0
                                  ? "Gold Trophy"
                                  : index === 1
                                    ? "Silver Trophy"
                                    : index === 2
                                      ? "Bronze Trophy"
                                      : `Rank #${user.rank}`}
                              </p>
                            </div>
                          </div>
                          <div className="font-bold text-blue-600">{user.points.toLocaleString()} pts</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-sm text-gray-500">Your rank: #12 (780 points)</p>
                    <Button variant="outline">View Full Leaderboard</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Friends</CardTitle>
                <CardDescription>Connect with fitness buddies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Taylor Swift",
                      status: "Working out now",
                      avatar: "/placeholder.svg?height=40&width=40",
                      initials: "TS",
                    },
                    {
                      name: "John Smith",
                      status: "Last active 2h ago",
                      avatar: "/placeholder.svg?height=40&width=40",
                      initials: "JS",
                    },
                    {
                      name: "Lisa Johnson",
                      status: "Last active 5h ago",
                      avatar: "/placeholder.svg?height=40&width=40",
                      initials: "LJ",
                    },
                  ].map((friend) => (
                    <div key={friend.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                          <AvatarFallback>{friend.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{friend.name}</p>
                          <p className="text-xs text-gray-500">{friend.status}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Find Friends
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Join fitness events near you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Group Run",
                      location: "Central Park",
                      date: "Sat, Mar 12",
                      time: "8:00 AM",
                      participants: 18,
                    },
                    {
                      title: "Yoga in the Park",
                      location: "Riverside Park",
                      date: "Sun, Mar 13",
                      time: "9:30 AM",
                      participants: 24,
                    },
                    {
                      title: "HIIT Workout",
                      location: "City Gym",
                      date: "Mon, Mar 14",
                      time: "6:00 PM",
                      participants: 12,
                    },
                  ].map((event) => (
                    <Card key={event.title} className="bg-gray-50">
                      <CardContent className="p-4">
                        <h3 className="font-medium">{event.title}</h3>
                        <div className="text-sm text-gray-600 mb-2">
                          {event.location} • {event.date} • {event.time}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Users className="h-3 w-3" />
                            <span>{event.participants} going</span>
                          </div>
                          <Button variant="outline" size="sm">
                            Join
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Events
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
