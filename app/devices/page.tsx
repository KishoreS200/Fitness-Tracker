"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Smartphone,
  Watch,
  Bluetooth,
  RefreshCw,
  Check,
  X,
  Heart,
  Footprints,
  Moon,
  Activity,
  BarChart2,
} from "lucide-react"

interface Device {
  id: string
  name: string
  type: "watch" | "phone" | "scale" | "tracker"
  brand: string
  connected: boolean
  lastSync?: string
  batteryLevel?: number
  permissions: {
    steps: boolean
    heartRate: boolean
    sleep: boolean
    workouts: boolean
    calories: boolean
  }
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "Apple Watch Series 7",
      type: "watch",
      brand: "Apple",
      connected: true,
      lastSync: "10 minutes ago",
      batteryLevel: 68,
      permissions: {
        steps: true,
        heartRate: true,
        sleep: true,
        workouts: true,
        calories: true,
      },
    },
    {
      id: "2",
      name: "iPhone 13 Pro",
      type: "phone",
      brand: "Apple",
      connected: true,
      lastSync: "2 minutes ago",
      batteryLevel: 82,
      permissions: {
        steps: true,
        heartRate: false,
        sleep: false,
        workouts: true,
        calories: true,
      },
    },
  ])

  const [scanning, setScanning] = useState(false)

  const handleScan = () => {
    setScanning(true)

    // Simulate finding a device after 3 seconds
    setTimeout(() => {
      setScanning(false)

      // Add a new device to the list
      const newDevice: Device = {
        id: "3",
        name: "Fitbit Charge 5",
        type: "tracker",
        brand: "Fitbit",
        connected: false,
        permissions: {
          steps: true,
          heartRate: true,
          sleep: true,
          workouts: true,
          calories: true,
        },
      }

      setDevices((prev) => [...prev, newDevice])
    }, 3000)
  }

  const toggleConnection = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) => (device.id === deviceId ? { ...device, connected: !device.connected } : device)),
    )
  }

  const togglePermission = (deviceId: string, permission: keyof Device["permissions"]) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              permissions: {
                ...device.permissions,
                [permission]: !device.permissions[permission],
              },
            }
          : device,
      ),
    )
  }

  const getDeviceIcon = (type: Device["type"]) => {
    switch (type) {
      case "watch":
        return <Watch className="h-5 w-5" />
      case "phone":
        return <Smartphone className="h-5 w-5" />
      case "scale":
        return <BarChart2 className="h-5 w-5" />
      case "tracker":
        return <Activity className="h-5 w-5" />
      default:
        return <Bluetooth className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Connected Devices</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Devices</CardTitle>
                    <CardDescription>Manage your connected fitness devices</CardDescription>
                  </div>
                  <Button onClick={handleScan} disabled={scanning} className="flex items-center gap-2">
                    {scanning ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Scanning...</span>
                      </>
                    ) : (
                      <>
                        <Bluetooth className="h-4 w-4" />
                        <span>Scan for Devices</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {devices.map((device) => (
                    <Card key={device.id} className={device.connected ? "border-blue-200" : ""}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-3 rounded-full ${
                                device.connected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {getDeviceIcon(device.type)}
                            </div>
                            <div>
                              <h3 className="font-medium">{device.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={device.connected ? "default" : "outline"}>{device.brand}</Badge>
                                {device.connected ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Connected
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                    Disconnected
                                  </Badge>
                                )}
                              </div>

                              {device.connected && device.lastSync && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Last synced: {device.lastSync}
                                  {device.batteryLevel !== undefined && (
                                    <span className="ml-2">• Battery: {device.batteryLevel}%</span>
                                  )}
                                </p>
                              )}
                            </div>
                          </div>

                          <Button
                            variant={device.connected ? "outline" : "default"}
                            size="sm"
                            onClick={() => toggleConnection(device.id)}
                          >
                            {device.connected ? "Disconnect" : "Connect"}
                          </Button>
                        </div>

                        {device.connected && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="text-sm font-medium mb-3">Data Permissions</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                              <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center mb-2">
                                  <Switch
                                    checked={device.permissions.steps}
                                    onCheckedChange={() => togglePermission(device.id, "steps")}
                                  />
                                </div>
                                <div className="flex flex-col items-center">
                                  <Footprints className="h-4 w-4 mb-1 text-gray-600" />
                                  <span className="text-xs text-gray-600">Steps</span>
                                </div>
                              </div>

                              <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center mb-2">
                                  <Switch
                                    checked={device.permissions.heartRate}
                                    onCheckedChange={() => togglePermission(device.id, "heartRate")}
                                  />
                                </div>
                                <div className="flex flex-col items-center">
                                  <Heart className="h-4 w-4 mb-1 text-gray-600" />
                                  <span className="text-xs text-gray-600">Heart Rate</span>
                                </div>
                              </div>

                              <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center mb-2">
                                  <Switch
                                    checked={device.permissions.sleep}
                                    onCheckedChange={() => togglePermission(device.id, "sleep")}
                                  />
                                </div>
                                <div className="flex flex-col items-center">
                                  <Moon className="h-4 w-4 mb-1 text-gray-600" />
                                  <span className="text-xs text-gray-600">Sleep</span>
                                </div>
                              </div>

                              <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center mb-2">
                                  <Switch
                                    checked={device.permissions.workouts}
                                    onCheckedChange={() => togglePermission(device.id, "workouts")}
                                  />
                                </div>
                                <div className="flex flex-col items-center">
                                  <Activity className="h-4 w-4 mb-1 text-gray-600" />
                                  <span className="text-xs text-gray-600">Workouts</span>
                                </div>
                              </div>

                              <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center mb-2">
                                  <Switch
                                    checked={device.permissions.calories}
                                    onCheckedChange={() => togglePermission(device.id, "calories")}
                                  />
                                </div>
                                <div className="flex flex-col items-center">
                                  <BarChart2 className="h-4 w-4 mb-1 text-gray-600" />
                                  <span className="text-xs text-gray-600">Calories</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Sync Status</CardTitle>
                <CardDescription>View the status of your data synchronization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      category: "Steps & Activity",
                      status: "success",
                      lastSync: "10 minutes ago",
                      count: "12,456 steps today",
                    },
                    {
                      category: "Heart Rate",
                      status: "success",
                      lastSync: "15 minutes ago",
                      count: "72 bpm (resting)",
                    },
                    { category: "Sleep", status: "success", lastSync: "8 hours ago", count: "7h 20m last night" },
                    { category: "Workouts", status: "warning", lastSync: "2 days ago", count: "No recent workouts" },
                    { category: "Weight", status: "error", lastSync: "Never", count: "Not connected" },
                  ].map((item) => (
                    <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">{item.category}</h3>
                        <p className="text-xs text-gray-500">Last sync: {item.lastSync}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm">{item.count}</span>
                        {item.status === "success" ? (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Check className="h-5 w-5" />
                          </div>
                        ) : item.status === "warning" ? (
                          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                            <RefreshCw className="h-5 w-5" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <X className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Compatible Apps</CardTitle>
                <CardDescription>Connect with other fitness apps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Apple Health", connected: true, icon: "🍎" },
                    { name: "Google Fit", connected: false, icon: "🏃" },
                    { name: "Strava", connected: true, icon: "🚴" },
                    { name: "Fitbit", connected: false, icon: "⌚" },
                    { name: "MyFitnessPal", connected: false, icon: "🍽️" },
                  ].map((app) => (
                    <div key={app.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                          {app.icon}
                        </div>
                        <span>{app.name}</span>
                      </div>
                      <Button variant={app.connected ? "outline" : "default"} size="sm">
                        {app.connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Devices</CardTitle>
                <CardDescription>Devices that work well with Fitness Quest</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Apple Watch", description: "Best for iPhone users", price: "$399+" },
                    { name: "Fitbit Charge 5", description: "Great sleep tracking", price: "$179" },
                    { name: "Garmin Forerunner", description: "For serious runners", price: "$349+" },
                  ].map((device) => (
                    <Card key={device.name} className="bg-gray-50">
                      <CardContent className="p-4">
                        <h3 className="font-medium">{device.name}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-600">{device.description}</p>
                          <p className="text-xs font-medium">{device.price}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Compatible Devices
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
