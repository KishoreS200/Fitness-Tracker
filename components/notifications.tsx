"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"

type Notification = {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "mission" | "workout" | "achievement" | "system"
}

export function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  // Initialize default notifications
  const initializeDefaultNotifications = () => {
    const sampleNotifications: Notification[] = [
      {
        id: "1",
        title: "Welcome to Fitness Quest!",
        message: "Start your fitness journey by accepting your first mission.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
        type: "system",
      },
      {
        id: "2",
        title: "New Workout Available",
        message: "Check out the new HIIT workout tailored for your fitness level.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
        type: "workout",
      },
    ]
    return sampleNotifications
  }

  // Load notifications from localStorage on component mount
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem("notifications")
      const notificationSettings = localStorage.getItem("notificationSettings")

      if (savedNotifications) {
        try {
          const parsedNotifications = JSON.parse(savedNotifications)

          // Ensure parsedNotifications is an array
          if (Array.isArray(parsedNotifications)) {
            setNotifications(parsedNotifications)
            setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length)
          } else {
            console.error("Saved notifications is not an array, resetting to defaults")
            const defaultNotifications = initializeDefaultNotifications()
            setNotifications(defaultNotifications)
            setUnreadCount(defaultNotifications.length)
            localStorage.setItem("notifications", JSON.stringify(defaultNotifications))
          }
        } catch (error) {
          console.error("Error parsing notifications:", error)
          const defaultNotifications = initializeDefaultNotifications()
          setNotifications(defaultNotifications)
          setUnreadCount(defaultNotifications.length)
          localStorage.setItem("notifications", JSON.stringify(defaultNotifications))
        }
      } else {
        // Create some sample notifications for new users
        const defaultNotifications = initializeDefaultNotifications()
        setNotifications(defaultNotifications)
        setUnreadCount(defaultNotifications.length)
        localStorage.setItem("notifications", JSON.stringify(defaultNotifications))
      }

      // Check if notifications are enabled
      if (notificationSettings) {
        try {
          const settings = JSON.parse(notificationSettings)
          setNotificationsEnabled(settings.enabled)
        } catch (error) {
          console.error("Error parsing notification settings:", error)
          setNotificationsEnabled(false)
        }
      }
    } catch (error) {
      console.error("Error in notifications initialization:", error)
      // Fallback to default state
      const defaultNotifications = initializeDefaultNotifications()
      setNotifications(defaultNotifications)
      setUnreadCount(defaultNotifications.length)
    }
  }, [])

  // Function to mark a notification as read
  const markAsRead = (id: string) => {
    try {
      const updatedNotifications = notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      )
      setNotifications(updatedNotifications)
      setUnreadCount(updatedNotifications.filter((n) => !n.read).length)
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    try {
      const updatedNotifications = notifications.map((notification) => ({ ...notification, read: true }))
      setNotifications(updatedNotifications)
      setUnreadCount(0)
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  // Function to toggle notifications
  const toggleNotifications = () => {
    try {
      const newState = !notificationsEnabled
      setNotificationsEnabled(newState)
      localStorage.setItem("notificationSettings", JSON.stringify({ enabled: newState }))

      // If enabling notifications, show a new notification
      if (newState) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: "Notifications Enabled",
          message: "You will now receive notifications about your fitness journey.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          read: false,
          type: "system",
        }

        const updatedNotifications = [newNotification, ...notifications]
        setNotifications(updatedNotifications)
        setUnreadCount(updatedNotifications.filter((n) => !n.read).length)
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
      }
    } catch (error) {
      console.error("Error toggling notifications:", error)
    }
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto py-0 px-2 text-xs">
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-4 px-2 text-center text-sm text-gray-500">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer ${!notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="w-full">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-xs text-gray-500">{notification.time}</div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-2 cursor-pointer" onClick={toggleNotifications}>
          <div className="w-full text-center text-sm">
            {notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
