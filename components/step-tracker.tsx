"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/context/auth-context"
import { AlertCircle, Calendar, Footprints, PlusCircle, TrendingUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface StepTrackerProps {
  dailyGoal?: number
  onUpdateSteps?: (steps: number) => void
}

export function StepTracker({ dailyGoal = 10000, onUpdateSteps }: StepTrackerProps) {
  const { user, updateUser } = useAuth()

  // Safe localStorage getter with fallback
  const safeGetItem = (key: string, fallback: string): string => {
    try {
      const value = localStorage.getItem(key)
      return value !== null ? value : fallback
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return fallback
    }
  }

  // Safe localStorage setter
  const safeSetItem = (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }

  const [steps, setSteps] = useState<number>(0)
  const [weeklySteps, setWeeklySteps] = useState<number[]>([])
  const [isTracking, setIsTracking] = useState<boolean>(false)
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false)
  const [deviceSupport, setDeviceSupport] = useState<boolean>(true)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  // Refs for step detection algorithm
  const accelerometerDataRef = useRef<{ x: number; y: number; z: number }[]>([])
  const lastStepTimeRef = useRef<number>(Date.now())
  const lastAccelerationRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 })
  const stepThresholdRef = useRef<number>(10) // Threshold for step detection
  const stepCooldownRef = useRef<number>(250) // Minimum time between steps in ms
  const motionListenerRef = useRef<((event: DeviceMotionEvent) => void) | null>(null)
  const lastSavedStepsRef = useRef<number>(0)
  const lastSavedDateRef = useRef<string>("")

  // Initialize default notifications
  useEffect(() => {
    if (isInitialized) return

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]
    const savedDate = safeGetItem("lastStepDate", "")

    // If it's a new day, reset steps
    if (savedDate !== today) {
      // Save yesterday's steps to weekly data before resetting
      if (savedDate) {
        updateWeeklySteps(Number.parseInt(safeGetItem("dailySteps", "0"), 10))
      }

      safeSetItem("dailySteps", "0")
      safeSetItem("lastStepDate", today)
      lastSavedDateRef.current = today
    } else {
      lastSavedDateRef.current = savedDate
    }

    // Load saved steps from localStorage
    const savedSteps = safeGetItem("dailySteps", "0")
    const parsedSteps = Number.parseInt(savedSteps, 10)
    if (!isNaN(parsedSteps)) {
      setSteps(parsedSteps)
      lastSavedStepsRef.current = parsedSteps
    } else {
      setSteps(0)
      lastSavedStepsRef.current = 0
    }

    // Load weekly data
    const savedWeeklySteps = safeGetItem("weeklySteps", "[]")
    try {
      const parsedWeeklySteps = JSON.parse(savedWeeklySteps)
      if (Array.isArray(parsedWeeklySteps) && parsedWeeklySteps.length === 7) {
        setWeeklySteps(parsedWeeklySteps)
      } else {
        // Initialize with zeros if not a valid array
        setWeeklySteps([0, 0, 0, 0, 0, 0, 0])
        safeSetItem("weeklySteps", JSON.stringify([0, 0, 0, 0, 0, 0, 0]))
      }
    } catch (e) {
      console.error("Error parsing weekly steps:", e)
      setWeeklySteps([0, 0, 0, 0, 0, 0, 0])
      safeSetItem("weeklySteps", JSON.stringify([0, 0, 0, 0, 0, 0, 0]))
    }

    // Check if tracking is enabled
    const trackingStatus = safeGetItem("stepTrackingEnabled", "false")
    setIsTracking(trackingStatus === "true")

    // Check if device supports motion sensors
    if (typeof window !== "undefined") {
      if ("DeviceMotionEvent" in window) {
        // Check if we need to request permission (iOS 13+)
        if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
          setDeviceSupport(true)
        } else {
          // No permission needed, device supports motion
          setDeviceSupport(true)
        }
      } else {
        // Device doesn't support motion events
        setDeviceSupport(false)
      }
    }

    setIsInitialized(true)
  }, [isInitialized])

  // Update user's total steps when steps change significantly
  useEffect(() => {
    // Only update if initialized and steps have changed significantly (by 100)
    if (isInitialized && user && Math.abs(steps - lastSavedStepsRef.current) >= 100) {
      // Update the user's total steps
      const currentTotalSteps = user.stats?.totalSteps ?? 0
      const stepDifference = steps - lastSavedStepsRef.current

      if (stepDifference > 0) {
        updateUser({
          stats: {
            ...user.stats,
            totalSteps: currentTotalSteps + stepDifference,
          },
        })

        lastSavedStepsRef.current = steps
      }
    }
  }, [steps, user, updateUser, isInitialized])

  // Function to update weekly steps array
  const updateWeeklySteps = (stepsToAdd: number) => {
    setWeeklySteps((prev) => {
      // Remove the oldest day and add today's steps
      const newWeekly = [...prev.slice(1), stepsToAdd]
      safeSetItem("weeklySteps", JSON.stringify(newWeekly))
      return newWeekly
    })
  }

  // Handle motion event setup/teardown
  useEffect(() => {
    if (!isInitialized || !isTracking) return

    // Define the motion handler
    const handleMotionEvent = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity
      if (!acceleration || acceleration.x === null || acceleration.y === null || acceleration.z === null) return

      // Add current acceleration to buffer
      accelerometerDataRef.current.push({
        x: acceleration.x,
        y: acceleration.y,
        z: acceleration.z,
      })

      // Keep buffer at reasonable size
      if (accelerometerDataRef.current.length > 20) {
        accelerometerDataRef.current.shift()
      }

      // Calculate magnitude of acceleration change
      const currentAcc = {
        x: acceleration.x,
        y: acceleration.y,
        z: acceleration.z,
      }

      const lastAcc = lastAccelerationRef.current
      const deltaX = currentAcc.x - lastAcc.x
      const deltaY = currentAcc.y - lastAcc.y
      const deltaZ = currentAcc.z - lastAcc.z

      const accelerationDelta = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ)

      // Update last acceleration
      lastAccelerationRef.current = currentAcc

      // Check if this is a step
      const now = Date.now()
      if (accelerationDelta > stepThresholdRef.current && now - lastStepTimeRef.current > stepCooldownRef.current) {
        // Detected a step
        lastStepTimeRef.current = now

        // Update steps
        setSteps((prevSteps) => {
          const newSteps = prevSteps + 1
          safeSetItem("dailySteps", newSteps.toString())
          if (onUpdateSteps) onUpdateSteps(newSteps)
          return newSteps
        })
      }
    }

    // Store the handler in a ref so we can remove it later
    motionListenerRef.current = handleMotionEvent

    // Set up the event listener
    window.addEventListener("devicemotion", handleMotionEvent)

    // Clean up on unmount or when tracking changes
    return () => {
      if (motionListenerRef.current) {
        window.removeEventListener("devicemotion", motionListenerRef.current)
      }
    }
  }, [isTracking, isInitialized, onUpdateSteps])

  // Function to request motion permission (for iOS)
  const requestMotionPermission = async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
      try {
        const permissionState = await (DeviceMotionEvent as any).requestPermission()
        if (permissionState === "granted") {
          setPermissionDenied(false)
          return true
        } else {
          setPermissionDenied(true)
          return false
        }
      } catch (error) {
        console.error("Error requesting motion permission:", error)
        setPermissionDenied(true)
        return false
      }
    }
    return true // Permission not needed
  }

  // Toggle step tracking
  const toggleTracking = async () => {
    const newStatus = !isTracking

    if (newStatus) {
      // Starting tracking
      if (!deviceSupport) {
        alert("Your device doesn't support motion detection for step tracking.")
        return
      }

      // Request permission if needed
      const permissionGranted = await requestMotionPermission()
      if (!permissionGranted) return

      // Reset tracking variables
      lastStepTimeRef.current = Date.now()
      accelerometerDataRef.current = []
    }

    setIsTracking(newStatus)
    safeSetItem("stepTrackingEnabled", newStatus.toString())
  }

  const resetSteps = () => {
    setSteps(0)
    safeSetItem("dailySteps", "0")
    lastSavedStepsRef.current = 0
    if (onUpdateSteps) onUpdateSteps(0)
  }

  const getProgressPercentage = () => {
    return Math.min((steps / dailyGoal) * 100, 100)
  }

  const getDayName = (index: number) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const today = new Date().getDay()
    const dayIndex = (today - 6 + index) % 7
    return days[dayIndex < 0 ? dayIndex + 7 : dayIndex]
  }

  // Check if there's any step data
  const hasStepData = steps > 0 || weeklySteps.some((daySteps) => daySteps > 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Footprints className="h-5 w-5 text-blue-500" />
              Step Tracker
            </CardTitle>
            <CardDescription>Track your daily steps</CardDescription>
          </div>
          <Button
            variant={isTracking ? "default" : "outline"}
            size="sm"
            onClick={toggleTracking}
            disabled={!deviceSupport}
            suppressHydrationWarning
          >
            {isTracking ? "Tracking" : "Start Tracking"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {permissionDenied && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Permission to access motion sensors was denied. Step tracking requires motion sensor access.
            </AlertDescription>
          </Alert>
        )}

        {!deviceSupport && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Your device doesn't support motion detection for step tracking.</AlertDescription>
          </Alert>
        )}

        {!hasStepData && !isTracking ? (
          <div className="text-center py-8">
            <Footprints className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No step data yet</h3>
            <p className="text-sm text-gray-500 mb-4">Start tracking your steps to see your progress</p>
            <Button onClick={toggleTracking} disabled={!deviceSupport} className="flex items-center gap-2 mx-auto" suppressHydrationWarning>
              <PlusCircle className="h-4 w-4" />
              Start Tracking
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <p className="text-5xl font-bold text-blue-600">{steps.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">of {dailyGoal.toLocaleString()} steps</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>{steps > 0 ? `${((steps / dailyGoal) * 100).toFixed(1)}% of daily goal` : "Start walking!"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>Today</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Weekly Progress</p>
              <div className="flex justify-between items-end h-32">
                {weeklySteps.map((daySteps, index) => {
                  const height = Math.max((daySteps / dailyGoal) * 100, 5)
                  const isToday = index === 6

                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-8 rounded-t-sm ${isToday ? "bg-blue-500" : "bg-blue-200"}`}
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs mt-1">{getDayName(index)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
      {hasStepData && (
        <CardFooter className="border-t pt-4">
          <Button variant="outline" size="sm" className="w-full" onClick={resetSteps} suppressHydrationWarning>
            Reset Steps
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
