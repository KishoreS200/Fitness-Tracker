"use client"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChartIcon,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Download,
  LineChartIcon,
  PlusCircle,
  Share2,
  Trash2,
} from "lucide-react"
import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Import the ProgressCharts component
import { PhotoUploadDialog } from "@/components/photo-upload-dialog"
import { ProgressCharts } from "@/components/progress-charts"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/context/auth-context"
import { useMissions } from "@/hooks/use-missions"

export default function ProgressPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState("week")
  const [bodyPhotoDate, setBodyPhotoDate] = useState("2023-02-19")
  const [hasActivityData, setHasActivityData] = useState(false)
  const [photoUploadOpen, setPhotoUploadOpen] = useState(false)
  const [progressPhotos, setProgressPhotos] = useState<any[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null)
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [comparePhotos, setComparePhotos] = useState<{ before: any | null; after: any | null }>({
    before: null,
    after: null,
  })

  // Add these imports
  // Inside the component, add this code to track completed missions
  const { missions: allMissions } = useMissions()
  const [completedMissions, setCompletedMissions] = useState<any[]>([])

  // Load saved photos from localStorage
  useEffect(() => {
    // Load saved photos from localStorage
    const savedPhotos = localStorage.getItem("progressPhotos")
    if (savedPhotos) {
      try {
        const parsedPhotos = JSON.parse(savedPhotos)
        if (Array.isArray(parsedPhotos)) {
          setProgressPhotos(parsedPhotos)
        }
      } catch (error) {
        console.error("Error parsing progress photos:", error)
      }
    }
  }, [])

  // Check if user has any activity data
  useEffect(() => {
    // In a real app, this would check the user's actual activity data
    // For now, we'll use localStorage to simulate this check
    const hasData = localStorage.getItem("hasActivityData")
    setHasActivityData(hasData === "true")
  }, [])

  // Add this useEffect to calculate completed missions
  useEffect(() => {
    // Filter missions that are 100% complete
    const completed = allMissions.filter((mission) => mission.progress === 100)
    setCompletedMissions(completed)

    // If we have completed missions, we have activity data
    if (completed.length > 0) {
      setHasActivityData(true)
      localStorage.setItem("hasActivityData", "true")
    }
  }, [allMissions])

  // Function to generate empty activity data
  const getEmptyActivityData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return days.map((day) => ({
      date: day,
      steps: 0,
      calories: 0,
      workouts: 0,
      duration: 0,
    }))
  }

  // Modify the getSampleActivityData function to use completed mission data
  const getSampleActivityData = () => {
    if (completedMissions.length > 0) {
      // Generate activity data based on completed missions
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      return days.map((day, index) => {
        // Find missions completed on this day (for demo purposes, distribute completed missions across the week)
        const dayMissions = completedMissions.filter((_, missionIndex) => missionIndex % 7 === index)

        return {
          date: day,
          steps: 5000 + dayMissions.length * 2000 + Math.floor(Math.random() * 2000),
          calories: 300 + dayMissions.length * 100 + Math.floor(Math.random() * 100),
          workouts: dayMissions.length > 0 ? dayMissions.length : index % 3 === 0 ? 1 : 0,
          duration: dayMissions.length > 0 ? dayMissions.length * 30 : index % 3 === 0 ? 30 : 0,
        }
      })
    }

    // Default sample data if no completed missions
    return [
      { date: "Mon", steps: 8432, calories: 420, workouts: 1, duration: 45 },
      { date: "Tue", steps: 10247, calories: 520, workouts: 1, duration: 60 },
      { date: "Wed", steps: 7893, calories: 380, workouts: 0, duration: 0 },
      { date: "Thu", steps: 9102, calories: 460, workouts: 1, duration: 30 },
      { date: "Fri", steps: 11532, calories: 580, workouts: 2, duration: 75 },
      { date: "Sat", steps: 14287, calories: 720, workouts: 1, duration: 90 },
      { date: "Sun", steps: 6543, calories: 320, workouts: 0, duration: 0 },
    ]
  }

  // Get appropriate data based on whether user has activity data
  const activityData = hasActivityData ? getSampleActivityData() : getEmptyActivityData()

  // Function to simulate adding activity data (for demo purposes)
  const handleAddSampleData = () => {
    localStorage.setItem("hasActivityData", "true")
    setHasActivityData(true)
  }

  // Handle photo upload
  const handlePhotoUpload = (photoData: any) => {
    const updatedPhotos = [...progressPhotos, photoData]
    setProgressPhotos(updatedPhotos)

    // Save to localStorage
    localStorage.setItem("progressPhotos", JSON.stringify(updatedPhotos))
  }

  // Handle photo click
  const handlePhotoClick = (photo: any) => {
    setSelectedPhoto(photo)
    setPhotoViewerOpen(true)
  }

  // Handle photo deletion
  const handleDeletePhoto = (photoId: string) => {
    const updatedPhotos = progressPhotos.filter((photo) => photo.id !== photoId)
    setProgressPhotos(updatedPhotos)

    // Save to localStorage
    localStorage.setItem("progressPhotos", JSON.stringify(updatedPhotos))

    // Close the viewer if the deleted photo is currently selected
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setPhotoViewerOpen(false)
    }
  }

  // Handle compare mode
  const handleCompareSelect = (photo: any, position: "before" | "after") => {
    setComparePhotos((prev) => ({
      ...prev,
      [position]: photo,
    }))
    setPhotoViewerOpen(false)
  }

  // Get photos by type
  const getPhotosByType = (type: string) => {
    return progressPhotos.filter((photo) => photo.type === type)
  }

  // Get photos by date
  const getPhotosByDate = (date: string) => {
    return progressPhotos.filter((photo) => photo.date === date)
  }

  // Get unique dates from photos
  const getUniqueDates = () => {
    const dates = progressPhotos.map((photo) => photo.date)
    return [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold">Progress Tracking</h1>

          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 90 days</SelectItem>
                <SelectItem value="year">Last 12 months</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {hasActivityData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Daily Steps</CardTitle>
                <CardDescription>Average: 9,719 steps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="steps" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Calories Burned</CardTitle>
                <CardDescription>Total: 3,400 calories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="calories" fill="#3b82f6" stroke="#2563eb" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Workout Duration</CardTitle>
                <CardDescription>Total: 300 minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="duration" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="mb-6">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <LineChartIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Activity Data Yet</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Complete workouts, track your steps, or log your activities to see your progress charts here.
              </p>
              <Button onClick={handleAddSampleData} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Add Sample Data (Demo)</span>
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="activity" className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="body">Body Metrics</TabsTrigger>
            <TabsTrigger value="strength">Strength</TabsTrigger>
            <TabsTrigger value="photos">Progress Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-6">
            {hasActivityData ? (
              <Card>
                <CardHeader>
                  <CardTitle>Activity Calendar</CardTitle>
                  <CardDescription>Your daily activity levels over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">February 2023</h3>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                          {day}
                        </div>
                      ))}

                      {/* Calendar heatmap - simplified version */}
                      {Array.from({ length: 35 }).map((_, i) => {
                        const activityLevel = Math.floor(Math.random() * 5)
                        let bgColor = "bg-gray-100"

                        if (activityLevel === 1) bgColor = "bg-blue-100"
                        if (activityLevel === 2) bgColor = "bg-blue-200"
                        if (activityLevel === 3) bgColor = "bg-blue-300"
                        if (activityLevel === 4) bgColor = "bg-blue-500"

                        return (
                          <div
                            key={i}
                            className={`aspect-square rounded-sm ${bgColor} flex items-center justify-center text-xs`}
                          >
                            {i + 1 <= 28 ? i + 1 : ""}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span>Activity Level:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-gray-100 rounded-sm"></div>
                      <span>None</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-blue-100 rounded-sm"></div>
                      <span>Low</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-blue-200 rounded-sm"></div>
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-blue-300 rounded-sm"></div>
                      <span>High</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                      <span>Intense</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Activity Calendar Data</h3>
                  <p className="text-gray-500 mb-6 max-w-md">
                    Your activity calendar will show your daily activity levels once you start logging workouts and
                    activities.
                  </p>
                  <Button onClick={handleAddSampleData} className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Sample Data (Demo)</span>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="body" className="mt-6">
            <ProgressCharts />
          </TabsContent>

          <TabsContent value="strength" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Strength Progress</CardTitle>
                <CardDescription>Track your lifting progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                {hasActivityData ? (
                  <>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { exercise: "Bench Press", week1: 60, week2: 65, week3: 67.5, week4: 70 },
                            { exercise: "Squat", week1: 80, week2: 85, week3: 90, week4: 95 },
                            { exercise: "Deadlift", week1: 100, week2: 105, week3: 110, week4: 115 },
                            { exercise: "Shoulder Press", week1: 40, week2: 42.5, week3: 45, week4: 47.5 },
                            { exercise: "Pull-ups", week1: 8, week2: 9, week3: 10, week4: 11 },
                          ]}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" />
                          <YAxis dataKey="exercise" type="category" width={120} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="week1" name="Week 1" fill="#94a3b8" />
                          <Bar dataKey="week2" name="Week 2" fill="#64748b" />
                          <Bar dataKey="week3" name="Week 3" fill="#475569" />
                          <Bar dataKey="week4" name="Week 4" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Personal Records</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { exercise: "Bench Press", weight: "75 kg", date: "Feb 15, 2023" },
                          { exercise: "Squat", weight: "100 kg", date: "Feb 18, 2023" },
                          { exercise: "Deadlift", weight: "120 kg", date: "Feb 10, 2023" },
                        ].map((record) => (
                          <Card key={record.exercise} className="bg-gradient-to-br from-blue-50 to-indigo-50 border">
                            <CardContent className="p-4">
                              <p className="text-sm font-medium text-gray-500 mb-1">{record.exercise}</p>
                              <p className="text-2xl font-bold text-blue-600">{record.weight}</p>
                              <p className="text-xs text-gray-500">{record.date}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="bg-blue-100 p-3 rounded-full mb-4">
                      <BarChartIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No Strength Data Yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md">
                      Log your strength training workouts to track your progress over time.
                    </p>
                    <Button onClick={handleAddSampleData} className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      <span>Add Sample Data (Demo)</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Progress Photos</CardTitle>
                    <CardDescription>Visual record of your transformation</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={compareMode ? "default" : "outline"}
                      onClick={() => setCompareMode(!compareMode)}
                      className="flex items-center gap-2"
                    >
                      {compareMode ? "Exit Compare" : "Compare Photos"}
                    </Button>
                    <Button onClick={() => setPhotoUploadOpen(true)} className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      <span>Add New Photo</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {progressPhotos.length > 0 ? (
                  <>
                    {compareMode ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Before Photo</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {comparePhotos.before ? (
                                <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                                  <img
                                    src={comparePhotos.before.url || "/placeholder.svg"}
                                    alt="Before"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="mt-2 text-center text-sm text-gray-500">
                                    {new Date(comparePhotos.before.date).toLocaleDateString()}
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="aspect-square bg-gray-100 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200"
                                  onClick={() => setPhotoViewerOpen(true)}
                                >
                                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                                  <span className="text-sm text-gray-500">Select before photo</span>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">After Photo</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {comparePhotos.after ? (
                                <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                                  <img
                                    src={comparePhotos.after.url || "/placeholder.svg"}
                                    alt="After"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="mt-2 text-center text-sm text-gray-500">
                                    {new Date(comparePhotos.after.date).toLocaleDateString()}
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="aspect-square bg-gray-100 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200"
                                  onClick={() => setPhotoViewerOpen(true)}
                                >
                                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                                  <span className="text-sm text-gray-500">Select after photo</span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>

                        {comparePhotos.before && comparePhotos.after && (
                          <div className="text-center">
                            <p className="text-sm text-gray-500 mb-2">
                              Progress period:{" "}
                              {Math.round(
                                (new Date(comparePhotos.after.date).getTime() -
                                  new Date(comparePhotos.before.date).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              )}{" "}
                              days
                            </p>
                            <Button
                              variant="outline"
                              onClick={() => setComparePhotos({ before: null, after: null })}
                              className="flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Clear Selection
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon">
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Select value={bodyPhotoDate} onValueChange={setBodyPhotoDate}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select date" />
                              </SelectTrigger>
                              <SelectContent>
                                {getUniqueDates().map((date) => (
                                  <SelectItem key={date} value={date}>
                                    {new Date(date).toLocaleDateString()}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {["front", "side", "back"].map((view) => (
                            <div key={view} className="space-y-2">
                              <h3 className="text-sm font-medium text-center capitalize">{view} View</h3>
                              {getPhotosByType(view).length > 0 ? (
                                <div
                                  className="aspect-[3/4] bg-gray-100 rounded-md overflow-hidden cursor-pointer"
                                  onClick={() => handlePhotoClick(getPhotosByType(view)[0])}
                                >
                                  <img
                                    src={getPhotosByType(view)[0].url || "/placeholder.svg"}
                                    alt={`${view} view`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div
                                  className="aspect-[3/4] bg-gray-100 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200"
                                  onClick={() => setPhotoUploadOpen(true)}
                                >
                                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                                  <span className="text-sm text-gray-500">Add {view} view</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="mt-6">
                          <h3 className="text-lg font-medium mb-4">All Photos</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {progressPhotos.map((photo) => (
                              <div
                                key={photo.id}
                                className="aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer relative group"
                                onClick={() => handlePhotoClick(photo)}
                              >
                                <img
                                  src={photo.url || "/placeholder.svg"}
                                  alt={`Progress photo from ${new Date(photo.date).toLocaleDateString()}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <div className="text-white text-center">
                                    <p className="text-xs">{new Date(photo.date).toLocaleDateString()}</p>
                                    <p className="text-xs capitalize">{photo.type} view</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="bg-blue-100 p-3 rounded-full mb-4">
                      <Camera className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No Progress Photos Yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md">
                      Upload photos to track your physical transformation over time.
                    </p>
                    <Button onClick={() => setPhotoUploadOpen(true)} className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      <span>Add Your First Photo</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {/* Photo Upload Dialog */}
      <PhotoUploadDialog 
        open={photoUploadOpen} 
        onOpenChangeAction={setPhotoUploadOpen} 
        onPhotoUploadAction={handlePhotoUpload} 
      />

      {/* Photo Viewer Dialog */}
      <Dialog open={photoViewerOpen} onOpenChange={setPhotoViewerOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black">
          <DialogHeader className="sr-only">
            <DialogTitle>Photo Viewer</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="relative">
              <div className="absolute top-2 right-2 z-10 flex gap-2">
                {compareMode && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white bg-black/50 hover:bg-black/70"
                      onClick={() => handleCompareSelect(selectedPhoto, "before")}
                    >
                      Set as Before
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white bg-black/50 hover:bg-black/70"
                      onClick={() => handleCompareSelect(selectedPhoto, "after")}
                    >
                      Set as After
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white bg-black/50 hover:bg-black/70"
                  onClick={() => handleDeletePhoto(selectedPhoto.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-center h-[80vh]">
                <img
                  src={selectedPhoto.url || "/placeholder.svg"}
                  alt="Progress photo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className="inline-flex items-center gap-2 bg-black/70 text-white px-3 py-1 rounded-full">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(selectedPhoto.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
