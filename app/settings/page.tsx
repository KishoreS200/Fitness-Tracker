"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Moon,
  Sun,
  User,
  Lock,
  Smartphone,
  Save,
  Loader2,
  Info,
  Clock,
  Mail,
  MessageSquare,
  Globe,
  Shield,
  Users,
  AlertTriangle,
  Utensils,
  Target,
  Award,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    missionUpdates: true,
    achievements: true,
    nutritionReminders: false,
    appUpdates: true,
    socialInteractions: true,
    communityEvents: false,
    progressMilestones: true,
  })

  const [notificationMethods, setNotificationMethods] = useState({
    push: true,
    email: true,
    inApp: true,
  })

  const [language, setLanguage] = useState("english")
  const [measurementSystem, setMeasurementSystem] = useState("metric")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [testNotificationOpen, setTestNotificationOpen] = useState(false)
  const [notificationTestType, setNotificationTestType] = useState("workout")
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null)

  const [workoutTimes, setWorkoutTimes] = useState({
    morning: "07:00",
    evening: "18:00",
  })

  const [reminderDays, setReminderDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    shareWorkouts: true,
    shareMissions: true,
    shareAchievements: true,
    allowFriendRequests: true,
    showInLeaderboards: true,
    allowDataCollection: true,
    allowPersonalization: true,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications")
    const savedNotificationMethods = localStorage.getItem("notificationMethods")
    const savedLanguage = localStorage.getItem("language")
    const savedMeasurementSystem = localStorage.getItem("measurementSystem")
    const savedWorkoutTimes = localStorage.getItem("workoutTimes")
    const savedReminderDays = localStorage.getItem("reminderDays")
    const savedPrivacySettings = localStorage.getItem("privacySettings")

    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications))
      } catch (error) {
        console.error("Error parsing notifications:", error)
      }
    }

    if (savedNotificationMethods) {
      try {
        setNotificationMethods(JSON.parse(savedNotificationMethods))
      } catch (error) {
        console.error("Error parsing notification methods:", error)
      }
    }

    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
    if (savedMeasurementSystem) {
      setMeasurementSystem(savedMeasurementSystem)
    }
    if (savedWorkoutTimes) {
      try {
        setWorkoutTimes(JSON.parse(savedWorkoutTimes))
      } catch (error) {
        console.error("Error parsing workout times:", error)
      }
    }

    if (savedReminderDays) {
      try {
        setReminderDays(JSON.parse(savedReminderDays))
      } catch (error) {
        console.error("Error parsing reminder days:", error)
      }
    }

    if (savedPrivacySettings) {
      try {
        setPrivacySettings(JSON.parse(savedPrivacySettings))
      } catch (error) {
        console.error("Error parsing privacy settings:", error)
      }
    }
  }, [])

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handleNotificationMethodChange = (key: string, value: boolean) => {
    setNotificationMethods((prev) => ({ ...prev, [key]: value }))
  }

  const handleReminderDayChange = (key: string, value: boolean) => {
    setReminderDays((prev) => ({ ...prev, [key]: value }))
  }

  const handlePrivacyChange = (key: string, value: any) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }))
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    // Validate passwords
    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required")
      return
    }

    if (!passwordData.newPassword) {
      setPasswordError("New password is required")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    setIsChangingPassword(true)

    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate a successful password change
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPasswordSuccess("Password changed successfully")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      })
    } catch (error) {
      setPasswordError("Failed to change password. Please try again.")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setPasswordError("Please type DELETE to confirm account deletion")
      return
    }

    setIsDeletingAccount(true)

    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate account deletion
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Clear user data and redirect to login
      logout()
    } catch (error) {
      setPasswordError("Failed to delete account. Please try again.")
      setIsDeletingAccount(false)
    }
  }

  const handleSaveSettings = async () => {
    // In a real app, this would save to the backend
    setIsSaving(true)
    setSaveMessage("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      localStorage.setItem("notifications", JSON.stringify(notifications))
      localStorage.setItem("notificationMethods", JSON.stringify(notificationMethods))
      localStorage.setItem("language", language)
      localStorage.setItem("measurementSystem", measurementSystem)
      localStorage.setItem("workoutTimes", JSON.stringify(workoutTimes))
      localStorage.setItem("reminderDays", JSON.stringify(reminderDays))
      localStorage.setItem("privacySettings", JSON.stringify(privacySettings))

      // Update user settings in auth context
      if (user) {
        await updateUser({
          settings: {
            notifications,
            notificationMethods,
            workoutTimes,
            reminderDays,
            theme,
            language,
            measurementSystem,
            privacy: privacySettings,
          },
        } as any)
      }

      // Show success message
      setSaveMessage("Settings saved successfully!")

      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      setSaveMessage("Failed to save settings. Please try again.")

      toast({
        title: "Error Saving Settings",
        description: "There was a problem saving your preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestNotification = () => {
    setTestNotificationOpen(true)
  }

  const sendTestNotification = () => {
    let title = "Test Notification"
    let description = "This is a test notification."

    switch (notificationTestType) {
      case "workout":
        title = "Workout Reminder"
        description = "Don't forget your scheduled workout today at " + workoutTimes.morning
        break
      case "mission":
        title = "Mission Update"
        description = "You're making great progress on your active mission! Keep it up!"
        break
      case "achievement":
        title = "Achievement Unlocked!"
        description = "Congratulations! You've earned the 'Test Achievement' badge."
        break
    }

    toast({
      title,
      description,
    })

    setTestNotificationOpen(false)
  }

  // Custom accordion section that avoids nesting buttons
  const NotificationSection = ({
    id,
    title,
    description,
    icon,
    checked,
    onCheckedChange,
    children,
  }: {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    children?: React.ReactNode
  }) => {
    const isExpanded = expandedAccordion === id

    return (
      <div className="border-b">
        <div className="flex items-center justify-between py-4">
          <div
            className="flex items-center gap-2 flex-1 cursor-pointer"
            onClick={() => setExpandedAccordion(isExpanded ? null : id)}
          >
            {icon}
            <div className="text-left">
              <p className="font-medium">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
          </div>
        </div>
        {isExpanded && checked && <div className="ml-6 space-y-4 border-l-2 border-gray-100 pl-4 pb-4">{children}</div>}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Notification Methods</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestNotification}
                    className="flex items-center gap-1"
                  >
                    <Bell className="h-4 w-4" />
                    <span>Test Notification</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-500">Receive alerts on your device</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationMethods.push}
                      onCheckedChange={(checked) => handleNotificationMethodChange("push", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationMethods.email}
                      onCheckedChange={(checked) => handleNotificationMethodChange("email", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">In-App Notifications</p>
                        <p className="text-sm text-gray-500">Show notifications in the app</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationMethods.inApp}
                      onCheckedChange={(checked) => handleNotificationMethodChange("inApp", checked)}
                    />
                  </div>
                </div>

                {/* Custom accordion implementation to avoid nested buttons */}
                <NotificationSection
                  id="workout-reminders"
                  title="Workout Reminders"
                  description="Receive reminders for your scheduled workouts"
                  icon={<Clock className="h-5 w-5 text-blue-500" />}
                  checked={notifications.workoutReminders}
                  onCheckedChange={(checked) => handleNotificationChange("workoutReminders", checked)}
                >
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Reminder Schedule</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="morning-workout">Morning Workout</Label>
                        <Input
                          id="morning-workout"
                          type="time"
                          value={workoutTimes.morning}
                          onChange={(e) => setWorkoutTimes((prev) => ({ ...prev, morning: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="evening-workout">Evening Workout</Label>
                        <Input
                          id="evening-workout"
                          type="time"
                          value={workoutTimes.evening}
                          onChange={(e) => setWorkoutTimes((prev) => ({ ...prev, evening: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Reminder Days</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {Object.entries({
                        monday: "M",
                        tuesday: "T",
                        wednesday: "W",
                        thursday: "T",
                        friday: "F",
                        saturday: "S",
                        sunday: "S",
                      }).map(([day, letter]) => (
                        <div
                          key={day}
                          className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer ${
                            reminderDays[day as keyof typeof reminderDays]
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                          onClick={() => handleReminderDayChange(day, !reminderDays[day as keyof typeof reminderDays])}
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Reminder Settings</Label>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reminder-advance">Send reminder in advance</Label>
                        <p className="text-sm text-muted-foreground">Get notified 30 minutes before scheduled time</p>
                      </div>
                      <Switch id="reminder-advance" defaultChecked />
                    </div>
                  </div>
                </NotificationSection>

                <NotificationSection
                  id="mission-updates"
                  title="Mission Updates"
                  description="Get notified about mission progress and new missions"
                  icon={<Target className="h-5 w-5 text-blue-500" />}
                  checked={notifications.missionUpdates}
                  onCheckedChange={(checked) => handleNotificationChange("missionUpdates", checked)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="mission-progress">Mission Progress Updates</Label>
                        <p className="text-sm text-muted-foreground">Get notified when you make significant progress</p>
                      </div>
                      <Switch id="mission-progress" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="mission-completion">Mission Completion</Label>
                        <p className="text-sm text-muted-foreground">Get notified when you complete a mission</p>
                      </div>
                      <Switch id="mission-completion" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="new-missions">New Missions Available</Label>
                        <p className="text-sm text-muted-foreground">Get notified when new missions are available</p>
                      </div>
                      <Switch id="new-missions" defaultChecked />
                    </div>
                  </div>
                </NotificationSection>

                <NotificationSection
                  id="achievements"
                  title="Achievements"
                  description="Celebrate when you earn badges and reach milestones"
                  icon={<Award className="h-5 w-5 text-blue-500" />}
                  checked={notifications.achievements}
                  onCheckedChange={(checked) => handleNotificationChange("achievements", checked)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="badges-earned">Badges Earned</Label>
                        <p className="text-sm text-muted-foreground">Get notified when you earn a new badge</p>
                      </div>
                      <Switch id="badges-earned" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="level-up">Level Up</Label>
                        <p className="text-sm text-muted-foreground">Get notified when you level up</p>
                      </div>
                      <Switch id="level-up" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="milestones">Milestone Achievements</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when you reach significant milestones
                        </p>
                      </div>
                      <Switch id="milestones" defaultChecked />
                    </div>
                  </div>
                </NotificationSection>

                <NotificationSection
                  id="nutrition-reminders"
                  title="Nutrition Reminders"
                  description="Get reminders about meal times and water intake"
                  icon={<Utensils className="h-5 w-5 text-blue-500" />}
                  checked={notifications.nutritionReminders}
                  onCheckedChange={(checked) => handleNotificationChange("nutritionReminders", checked)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="meal-reminders">Meal Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminders for breakfast, lunch, and dinner</p>
                      </div>
                      <Switch id="meal-reminders" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="water-reminders">Water Intake Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminders to drink water throughout the day</p>
                      </div>
                      <Switch id="water-reminders" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Meal Reminder Times</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="breakfast-time">Breakfast</Label>
                        <Input id="breakfast-time" type="time" defaultValue="07:30" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lunch-time">Lunch</Label>
                        <Input id="lunch-time" type="time" defaultValue="12:30" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dinner-time">Dinner</Label>
                        <Input id="dinner-time" type="time" defaultValue="18:30" />
                      </div>
                    </div>
                  </div>
                </NotificationSection>

                <NotificationSection
                  id="social-interactions"
                  title="Social Interactions"
                  description="Get notified about friend requests and social activity"
                  icon={<Users className="h-5 w-5 text-blue-500" />}
                  checked={notifications.socialInteractions}
                  onCheckedChange={(checked) => handleNotificationChange("socialInteractions", checked)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="friend-requests">Friend Requests</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when someone sends you a friend request
                        </p>
                      </div>
                      <Switch id="friend-requests" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="comments">Comments and Reactions</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when someone comments on or reacts to your posts
                        </p>
                      </div>
                      <Switch id="comments" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="mentions">Mentions</Label>
                        <p className="text-sm text-muted-foreground">Get notified when someone mentions you</p>
                      </div>
                      <Switch id="mentions" defaultChecked />
                    </div>
                  </div>
                </NotificationSection>

                <NotificationSection
                  id="app-updates"
                  title="App Updates"
                  description="Stay informed about new features and improvements"
                  icon={<Globe className="h-5 w-5 text-blue-500" />}
                  checked={notifications.appUpdates}
                  onCheckedChange={(checked) => handleNotificationChange("appUpdates", checked)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="feature-updates">New Features</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new app features and improvements
                        </p>
                      </div>
                      <Switch id="feature-updates" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="content-updates">New Content</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new workouts, exercises, and content
                        </p>
                      </div>
                      <Switch id="content-updates" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="maintenance">Maintenance Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about scheduled maintenance and downtime
                        </p>
                      </div>
                      <Switch id="maintenance" defaultChecked />
                    </div>
                  </div>
                </NotificationSection>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the app looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex gap-4">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        className="flex items-center gap-2 w-full"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-4 w-4" />
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        className="flex items-center gap-2 w-full"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-4 w-4" />
                        Dark
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        className="flex items-center gap-2 w-full"
                        onClick={() => setTheme("system")}
                      >
                        <Smartphone className="h-4 w-4" />
                        System
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="measurement">Measurement System</Label>
                    <Select value={measurementSystem} onValueChange={setMeasurementSystem}>
                      <SelectTrigger id="measurement">
                        <SelectValue placeholder="Select measurement system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                        <SelectItem value="imperial">Imperial (lb, ft)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text-size">Text Size</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="text-size">
                        <SelectValue placeholder="Select text size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="animations">Animations</Label>
                        <p className="text-sm text-muted-foreground">Enable animations throughout the app</p>
                      </div>
                      <Switch id="animations" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reduced-motion">Reduced Motion</Label>
                        <p className="text-sm text-muted-foreground">Minimize animations for accessibility</p>
                      </div>
                      <Switch id="reduced-motion" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name || ""} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                    <p className="text-xs text-muted-foreground">
                      Your email address is used for login and cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button variant="outline" size="sm" onClick={() => setIsChangingPassword(!isChangingPassword)}>
                        {isChangingPassword ? "Cancel" : "Change Password"}
                      </Button>
                    </div>

                    {isChangingPassword ? (
                      <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input
                            id="current-password"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          />
                        </div>

                        {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}

                        {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}

                        <Button type="submit" disabled={isChangingPassword && !passwordData.currentPassword}>
                          {isChangingPassword ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Changing Password...
                            </>
                          ) : (
                            "Update Password"
                          )}
                        </Button>
                      </form>
                    ) : (
                      <Input id="password" type="password" value="••••••••" disabled />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-type">Account Type</Label>
                    <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-800 rounded-md">
                      <Shield className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Free Account</p>
                        <p className="text-sm">Basic features and limited storage</p>
                      </div>
                    </div>
                    <Button variant="outline" className="mt-2 w-full">
                      Upgrade to Premium
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium text-red-600 mb-2">Delete Account</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      This action is permanent and cannot be undone. All your data will be permanently deleted.
                    </p>

                    {!showDeleteConfirm ? (
                      <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                        Delete Account
                      </Button>
                    ) : (
                      <div className="space-y-4 border p-4 rounded-md border-red-200 bg-red-50">
                        <p className="text-sm font-medium">To confirm deletion, type "DELETE" below:</p>
                        <Input
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          className="border-red-300"
                        />

                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={isDeletingAccount || deleteConfirmText !== "DELETE"}
                          >
                            {isDeletingAccount ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Confirm Deletion"
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowDeleteConfirm(false)
                              setDeleteConfirmText("")
                              setPasswordError(null)
                            }}
                          >
                            Cancel
                          </Button>
                        </div>

                        {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">Profile Privacy</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            These settings control who can see your profile information and activity. Your privacy is
                            important to us.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-visibility">Profile Visibility</Label>
                    <Select
                      value={privacySettings.profileVisibility}
                      onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
                    >
                      <SelectTrigger id="profile-visibility">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span>Public</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="friends">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Friends Only</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            <span>Private</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {privacySettings.profileVisibility === "public"
                        ? "Anyone can view your profile"
                        : privacySettings.profileVisibility === "friends"
                          ? "Only your friends can view your profile"
                          : "Your profile is private and only visible to you"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="share-workouts">Share Workouts</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your completed workouts</p>
                    </div>
                    <Switch
                      id="share-workouts"
                      checked={privacySettings.shareWorkouts}
                      onCheckedChange={(checked) => handlePrivacyChange("shareWorkouts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="share-missions">Share Missions</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to see your active and completed missions
                      </p>
                    </div>
                    <Switch
                      id="share-missions"
                      checked={privacySettings.shareMissions}
                      onCheckedChange={(checked) => handlePrivacyChange("shareMissions", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="share-achievements">Share Achievements</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your badges and achievements</p>
                    </div>
                    <Switch
                      id="share-achievements"
                      checked={privacySettings.shareAchievements}
                      onCheckedChange={(checked) => handlePrivacyChange("shareAchievements", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-friend-requests">Allow Friend Requests</Label>
                      <p className="text-sm text-muted-foreground">Allow others to send you friend requests</p>
                    </div>
                    <Switch
                      id="allow-friend-requests"
                      checked={privacySettings.allowFriendRequests}
                      onCheckedChange={(checked) => handlePrivacyChange("allowFriendRequests", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-in-leaderboards">Show in Leaderboards</Label>
                      <p className="text-sm text-muted-foreground">Allow your name to appear in public leaderboards</p>
                    </div>
                    <Switch
                      id="show-in-leaderboards"
                      checked={privacySettings.showInLeaderboards}
                      onCheckedChange={(checked) => handlePrivacyChange("showInLeaderboards", checked)}
                    />
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">Data Privacy</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="allow-data-collection">Data Collection</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow anonymous usage data collection to improve the app
                          </p>
                        </div>
                        <Switch
                          id="allow-data-collection"
                          checked={privacySettings.allowDataCollection}
                          onCheckedChange={(checked) => handlePrivacyChange("allowDataCollection", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="allow-personalization">Personalization</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow us to personalize your experience based on your activity
                          </p>
                        </div>
                        <Switch
                          id="allow-personalization"
                          checked={privacySettings.allowPersonalization}
                          onCheckedChange={(checked) => handlePrivacyChange("allowPersonalization", checked)}
                        />
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start gap-3 mt-4">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">Important Privacy Information</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Disabling data collection and personalization may limit some app features and
                            recommendations. We respect your privacy choices and will only use your data as described in
                            our
                            <a href="/privacy" className="text-blue-600 hover:underline ml-1">
                              Privacy Policy
                            </a>
                            .
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-2">Data Export & Deletion</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You can export your data or request deletion of your data at any time.
                    </p>
                    <div className="flex gap-4">
                      <Button variant="outline" size="sm">
                        Export My Data
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Request Data Deletion
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveSettings} className="flex items-center gap-2" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save All Settings
              </>
            )}
          </Button>
        </div>

        {saveMessage && (
          <p
            className={`mt-2 text-sm text-right ${saveMessage.includes("successfully") ? "text-green-600" : "text-red-600"}`}
          >
            {saveMessage}
          </p>
        )}
      </div>
      <Footer />

      {/* Test Notification Dialog */}
      <Dialog open={testNotificationOpen} onOpenChange={setTestNotificationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Test Notification</DialogTitle>
            <DialogDescription>Send a test notification to verify your notification settings.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Notification Type</Label>
              <Select value={notificationTestType} onValueChange={setNotificationTestType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workout">Workout Reminder</SelectItem>
                  <SelectItem value="mission">Mission Update</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTestNotificationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendTestNotification}>Send Test Notification</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
