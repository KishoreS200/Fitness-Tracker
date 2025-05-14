"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Download, Share2, LineChartIcon, BarChartIcon, PlusCircle, Loader2 } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Add these imports if not already present
import { useMissions } from "@/hooks/use-missions"

interface WeightEntry {
  date: string
  weight: number
  bodyFat: number
}

interface StrengthEntry {
  exercise: string
  week1: number
  week2: number
  week3: number
  week4: number
  [key: string]: string | number // Add index signature to allow string indexing
}

type WeekKey = "week1" | "week2" | "week3" | "week4"

export function ProgressCharts() {
  const { user } = useAuth()
  const [weightData, setWeightData] = useState<WeightEntry[]>([])
  const [strengthData, setStrengthData] = useState<StrengthEntry[]>([])
  const [addWeightDialogOpen, setAddWeightDialogOpen] = useState(false)
  const [addStrengthDialogOpen, setAddStrengthDialogOpen] = useState(false)
  const [newWeightEntry, setNewWeightEntry] = useState<{ weight: string; bodyFat: string; date: string }>({
    weight: "",
    bodyFat: "",
    date: "",
  })
  const [newStrengthEntry, setNewStrengthEntry] = useState<{ exercise: string; weight: string; week: WeekKey }>({
    exercise: "",
    weight: "",
    week: "week1",
  })
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const dataInitializedRef = useRef(false)

  // Inside the ProgressCharts component, add this code to track completed missions
  const { missions: activeMissions } = useMissions(true)
  const [completedMissions, setCompletedMissions] = useState<any[]>([])

  // Add this useEffect to calculate completed missions
  useEffect(() => {
    // Filter missions that are 100% complete
    const completed = activeMissions.filter((mission) => mission.progress === 100)
    setCompletedMissions(completed)
  }, [activeMissions])

  // Function to check if weight data has real values
  const hasRealWeightData = useCallback(() => {
    // If we have completed missions but no weight data, we should still show something
    if (completedMissions.length > 0) {
      return true
    }

    if (!weightData || weightData.length === 0) return false

    // Check if any weight entry has a non-zero value
    return weightData.some(
      (entry: WeightEntry) => (entry.weight && entry.weight > 0) || (entry.bodyFat && entry.bodyFat > 0),
    )
  }, [weightData, completedMissions.length])

  // Function to check if strength data has real values
  const hasRealStrengthData = useCallback(() => {
    // If we have completed missions but no strength data, we should still show something
    if (completedMissions.length > 0) {
      return true
    }

    if (!strengthData || strengthData.length === 0) return false

    // Check if any strength entry has a non-zero value
    return strengthData.some(
      (entry: StrengthEntry) =>
        (entry.week1 && entry.week1 > 0) ||
        (entry.week2 && entry.week2 > 0) ||
        (entry.week3 && entry.week3 > 0) ||
        (entry.week4 && entry.week4 > 0),
    )
  }, [strengthData, completedMissions.length])

  // Function to initialize empty weight data
  const initializeEmptyData = useCallback((): WeightEntry[] => {
    // Return empty array instead of array with zero values
    return []
  }, [])

  // Function to initialize empty strength data
  const initializeEmptyStrengthData = useCallback((): StrengthEntry[] => {
    // Return empty array instead of array with zero values
    return []
  }, [])

  // Initialize data once
  useEffect(() => {
    if (dataInitializedRef.current) return

    setIsLoading(true)

    // Simulate loading delay for better UX
    const loadingTimer = setTimeout(() => {
      try {
        dataInitializedRef.current = true

        // Initialize or load weight data
        const savedWeightData = localStorage.getItem("weightData")
        if (savedWeightData) {
          try {
            const parsedData = JSON.parse(savedWeightData)
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              setWeightData(parsedData)
            } else {
              // Initialize with empty array
              setWeightData([])
            }
          } catch (error) {
            console.error("Error parsing weight data:", error)
            setWeightData([])
          }
        } else {
          setWeightData([])
        }

        // Initialize or load strength data
        const savedStrengthData = localStorage.getItem("strengthData")
        if (savedStrengthData) {
          try {
            const parsedData = JSON.parse(savedStrengthData)
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              setStrengthData(parsedData)
            } else {
              // Initialize with empty array
              setStrengthData([])
            }
          } catch (error) {
            console.error("Error parsing strength data:", error)
            setStrengthData([])
          }
        } else {
          setStrengthData([])
        }

        setIsInitialized(true)
      } catch (error) {
        console.error("Error initializing chart data:", error)
      } finally {
        setIsLoading(false)
      }
    }, 1000)

    return () => clearTimeout(loadingTimer)
  }, [initializeEmptyData, initializeEmptyStrengthData])

  // Add new weight entry
  const handleAddWeightEntry = useCallback(() => {
    if (!newWeightEntry.weight || !newWeightEntry.date) return

    try {
      const updatedData = [...weightData]

      // Check if we're updating an existing date
      const existingIndex = updatedData.findIndex((item) => item.date === newWeightEntry.date)

      if (existingIndex >= 0) {
        // Update existing entry
        updatedData[existingIndex] = {
          ...updatedData[existingIndex],
          weight: Number.parseFloat(newWeightEntry.weight) || 0,
          bodyFat: newWeightEntry.bodyFat
            ? Number.parseFloat(newWeightEntry.bodyFat) || 0
            : updatedData[existingIndex].bodyFat,
        }
      } else {
        // Add new entry
        updatedData.push({
          date: newWeightEntry.date,
          weight: Number.parseFloat(newWeightEntry.weight) || 0,
          bodyFat: newWeightEntry.bodyFat ? Number.parseFloat(newWeightEntry.bodyFat) || 0 : 0,
        })

        // Sort by date
        updatedData.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
      }

      setWeightData(updatedData)
      localStorage.setItem("weightData", JSON.stringify(updatedData))
      setNewWeightEntry({ weight: "", bodyFat: "", date: "" })
      setAddWeightDialogOpen(false)
    } catch (error) {
      console.error("Error adding weight entry:", error)
      alert("Failed to add weight entry. Please try again.")
    }
  }, [weightData, newWeightEntry])

  const handleAddStrengthEntry = useCallback(() => {
    if (!newStrengthEntry.exercise || !newStrengthEntry.weight) return

    try {
      const updatedData = [...strengthData]

      // Find the exercise
      const exerciseIndex = updatedData.findIndex(
        (item) => item.exercise.toLowerCase() === newStrengthEntry.exercise.toLowerCase(),
      )

      if (exerciseIndex >= 0) {
        // Update existing exercise
        const weekKey = newStrengthEntry.week
        updatedData[exerciseIndex] = {
          ...updatedData[exerciseIndex],
          [weekKey]: Number.parseFloat(newStrengthEntry.weight) || 0,
        }
      } else {
        // Add new exercise
        const newExercise: StrengthEntry = {
          exercise: newStrengthEntry.exercise,
          week1: 0,
          week2: 0,
          week3: 0,
          week4: 0,
        }
        const weekKey = newStrengthEntry.week
        newExercise[weekKey] = Number.parseFloat(newStrengthEntry.weight) || 0
        updatedData.push(newExercise)
      }

      setStrengthData(updatedData)
      localStorage.setItem("strengthData", JSON.stringify(updatedData))
      setNewStrengthEntry({ exercise: "", weight: "", week: "week1" })
      setAddStrengthDialogOpen(false)
    } catch (error) {
      console.error("Error adding strength entry:", error)
      alert("Failed to add strength entry. Please try again.")
    }
  }, [strengthData, newStrengthEntry])

  // Download chart data as CSV
  const downloadChartData = useCallback(
    (chartType: "weight" | "strength") => {
      try {
        let csvContent = "data:text/csv;charset=utf-8,"

        if (chartType === "weight") {
          // Header row
          csvContent += "Date,Weight,Body Fat %\n"

          // Data rows
          weightData.forEach((row) => {
            csvContent += `${row.date},${row.weight},${row.bodyFat}\n`
          })
        } else {
          // Header row
          csvContent += "Exercise,Week 1,Week 2,Week 3,Week 4\n"

          // Data rows
          strengthData.forEach((row) => {
            csvContent += `${row.exercise},${row.week1},${row.week2},${row.week3},${row.week4}\n`
          })
        }

        // Create download link
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `${chartType}-data.csv`)
        document.body.appendChild(link)

        // Trigger download
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.error("Error downloading chart data:", error)
        alert("Failed to download data. Please try again.")
      }
    },
    [weightData, strengthData],
  )

  // Share chart data
  const shareChartData = useCallback(async (chartType: "weight" | "strength") => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `My Fitness ${chartType === "weight" ? "Weight" : "Strength"} Progress`,
          text: `Check out my fitness progress!`,
          // In a real app, you would generate and share an image URL
          url: window.location.href,
        })
      } else {
        alert("Web Share API not supported in your browser. Try copying the URL manually.")
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }, [])

  if (!user) return null

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-500">Loading weight data...</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-500">Loading body fat data...</p>
        </Card>
        <Card className="md:col-span-2 flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-500">Loading strength data...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Weight Tracking</CardTitle>
            <CardDescription>Your weight changes over time</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => downloadChartData("weight")}
              disabled={!hasRealWeightData()}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareChartData("weight")}
              disabled={!hasRealWeightData()}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAddWeightDialogOpen(true)}>
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {hasRealWeightData() ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    weightData.filter((entry) => entry.weight > 0).length > 0
                      ? weightData.filter((entry) => entry.weight > 0)
                      : completedMissions.map((mission, index) => ({
                          date: new Date(mission.updatedAt).toLocaleDateString(),
                          weight: 70 - index * 0.5, // Mock decreasing weight based on completed missions
                          bodyFat: 20 - index * 0.3, // Mock decreasing body fat based on completed missions
                        }))
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-center p-6">
              <LineChartIcon className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No weight data yet</h3>
              <p className="text-sm text-gray-500 mb-4">Add your first weight entry to start tracking your progress</p>
              <Button onClick={() => setAddWeightDialogOpen(true)} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Weight Entry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Body Fat Percentage</CardTitle>
            <CardDescription>Your body composition changes</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => downloadChartData("weight")}
              disabled={!hasRealWeightData()}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareChartData("weight")}
              disabled={!hasRealWeightData()}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {hasRealWeightData() && (weightData.some((entry) => entry.bodyFat > 0) || completedMissions.length > 0) ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    weightData.filter((entry) => entry.bodyFat > 0).length > 0
                      ? weightData.filter((entry) => entry.bodyFat > 0)
                      : completedMissions.map((mission, index) => ({
                          date: new Date(mission.updatedAt).toLocaleDateString(),
                          bodyFat: 20 - index * 0.3, // Mock decreasing body fat based on completed missions
                        }))
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="bodyFat"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-center p-6">
              <LineChartIcon className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No body fat data yet</h3>
              <p className="text-sm text-gray-500 mb-4">Add body fat percentage when logging your weight</p>
              <Button onClick={() => setAddWeightDialogOpen(true)} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Body Fat Data
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Strength Progress</CardTitle>
            <CardDescription>Track your lifting progress over time</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => downloadChartData("strength")}
              disabled={!hasRealStrengthData()}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareChartData("strength")}
              disabled={!hasRealStrengthData()}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAddStrengthDialogOpen(true)}>
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {hasRealStrengthData() ? (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    strengthData.filter(
                      (entry) => entry.week1 > 0 || entry.week2 > 0 || entry.week3 > 0 || entry.week4 > 0,
                    ).length > 0
                      ? strengthData.filter(
                          (entry) => entry.week1 > 0 || entry.week2 > 0 || entry.week3 > 0 || entry.week4 > 0,
                        )
                      : [
                          {
                            exercise: "Bench Press",
                            week1: 60,
                            week2: 65,
                            week3: 67.5,
                            week4: 70 + completedMissions.length * 2,
                          },
                          {
                            exercise: "Squat",
                            week1: 80,
                            week2: 85,
                            week3: 90,
                            week4: 95 + completedMissions.length * 2.5,
                          },
                          {
                            exercise: "Deadlift",
                            week1: 100,
                            week2: 105,
                            week3: 110,
                            week4: 115 + completedMissions.length * 3,
                          },
                        ]
                  }
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
                  <Bar dataKey="week4" name={completedMissions.length > 0 ? "Current" : "Week 4"} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center p-6">
              <BarChartIcon className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No strength data yet</h3>
              <p className="text-sm text-gray-500 mb-4">
                Add your first strength entry to start tracking your progress
              </p>
              <Button onClick={() => setAddStrengthDialogOpen(true)} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Strength Entry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Weight Entry Dialog */}
      <Dialog open={addWeightDialogOpen} onOpenChange={setAddWeightDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Weight Entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entry-date" className="text-right">
                Date
              </Label>
              <Input
                id="entry-date"
                type="date"
                value={newWeightEntry.date}
                onChange={(e) => setNewWeightEntry({ ...newWeightEntry, date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entry-weight" className="text-right">
                Weight (kg)
              </Label>
              <Input
                id="entry-weight"
                type="number"
                value={newWeightEntry.weight}
                onChange={(e) => setNewWeightEntry({ ...newWeightEntry, weight: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entry-bodyfat" className="text-right">
                Body Fat %
              </Label>
              <Input
                id="entry-bodyfat"
                type="number"
                value={newWeightEntry.bodyFat}
                onChange={(e) => setNewWeightEntry({ ...newWeightEntry, bodyFat: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddWeightEntry}>
              Save Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Strength Entry Dialog */}
      <Dialog open={addStrengthDialogOpen} onOpenChange={setAddStrengthDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Strength Entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entry-exercise" className="text-right">
                Exercise
              </Label>
              <Input
                id="entry-exercise"
                value={newStrengthEntry.exercise}
                onChange={(e) => setNewStrengthEntry({ ...newStrengthEntry, exercise: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entry-week" className="text-right">
                Week
              </Label>
              <select
                id="entry-week"
                value={newStrengthEntry.week}
                onChange={(e) => setNewStrengthEntry({ ...newStrengthEntry, week: e.target.value as WeekKey })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="week1">Week 1</option>
                <option value="week2">Week 2</option>
                <option value="week3">Week 3</option>
                <option value="week4">Week 4</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entry-weight-lifted" className="text-right">
                Weight (kg)
              </Label>
              <Input
                id="entry-weight-lifted"
                type="number"
                value={newStrengthEntry.weight}
                onChange={(e) => setNewStrengthEntry({ ...newStrengthEntry, weight: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddStrengthEntry}>
              Save Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
