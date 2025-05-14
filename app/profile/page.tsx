"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Save, Shield, Award, Medal } from "lucide-react"

// Import the new components
import { PhotoUpload } from "@/components/photo-upload"
import { PhotoGallery } from "@/components/photo-gallery"

export default function ProfilePage() {
  const { user, updateUser, loading } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    setSaveMessage("")

    try {
      await updateUser({
        name: formData.name,
      })
      setSaveMessage("Profile updated successfully!")
    } catch (error) {
      setSaveMessage("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-6 max-w-6xl flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-6 max-w-6xl">
          <Card>
            <CardContent className="p-6 text-center">
              <p>Please log in to view your profile.</p>
              <Button className="mt-4" asChild>
                <a href="/login">Log In</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const initials = user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.name} />
                    <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                <div className="mt-4 flex flex-col items-center">
                  <div className="flex items-center gap-1 text-blue-600">
                    <Award className="h-5 w-5" />
                    <span className="font-medium">Level {user.level}</span>
                  </div>
                  <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {user.badge}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Your badges and trophies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: "Starter", icon: <Medal className="h-6 w-6 text-amber-500" /> },
                    { name: "Consistent", icon: <Award className="h-6 w-6 text-blue-500" /> },
                    { name: "Dedicated", icon: <Shield className="h-6 w-6 text-purple-500" /> },
                  ].map((badge) => (
                    <div key={badge.name} className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        {badge.icon}
                      </div>
                      <span className="text-xs text-center">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="account">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Update your account details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" name="email" value={formData.email} disabled className="bg-gray-50" />
                          <p className="text-xs text-gray-500">Your email address cannot be changed</p>
                        </div>

                        <div className="pt-4">
                          <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                              </>
                            )}
                          </Button>
                          {saveMessage && (
                            <p
                              className={`mt-2 text-sm ${
                                saveMessage.includes("successfully") ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {saveMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="preferences" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Preferences</CardTitle>
                    <CardDescription>Customize your experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Preference settings will be available soon.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="photos" className="mt-6">
                <div className="space-y-6">
                  <PhotoUpload />
                  <PhotoGallery />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
