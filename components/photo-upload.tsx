"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, X, Calendar } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PhotoUpload() {
  const { user, updateUser } = useAuth()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photoDate, setPhotoDate] = useState<string>(new Date().toISOString().split("T")[0])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB")
      return
    }

    setError(null)
    setSelectedFile(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) return

    setUploading(true)
    setError(null)

    try {
      // In a real app, this would upload to a server
      // For now, we'll simulate an upload and store the data URL in the user object

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get the current photos array or initialize it
      const currentPhotos = user.photos || []

      // Add the new photo with date information
      const newPhoto = {
        url: previewUrl as string,
        date: photoDate,
        id: Date.now().toString(),
      }

      // Add the new photo (in a real app, this would be a URL from your server)
      const updatedPhotos = [...currentPhotos, newPhoto]

      // Update the user object
      await updateUser({
        photos: updatedPhotos,
      } as any)

      // Reset the form
      setSelectedFile(null)
      setPreviewUrl(null)
      setPhotoDate(new Date().toISOString().split("T")[0])

      alert("Photo uploaded successfully!")
    } catch (err) {
      setError("Failed to upload photo. Please try again.")
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Photo</CardTitle>
        <CardDescription>Add progress photos to track your fitness journey</CardDescription>
      </CardHeader>
      <CardContent>
        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-lg border border-gray-200">
              <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={handleCancel}
                suppressHydrationWarning
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="photo-date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Photo Date
                </Label>
                <Input
                  id="photo-date"
                  type="date"
                  value={photoDate}
                  onChange={(e) => setPhotoDate(e.target.value)}
                  className="w-full"
                  suppressHydrationWarning
                />
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleCancel} disabled={uploading} suppressHydrationWarning>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={uploading} suppressHydrationWarning>
                  {uploading ? "Uploading..." : "Upload Photo"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <label
              htmlFor="photo-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Camera className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or GIF (max. 5MB)</p>
              </div>
              <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
