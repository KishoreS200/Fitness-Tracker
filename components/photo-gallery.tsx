"use client"

import { PhotoUploadDialog } from "@/components/photo-upload-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { format } from "date-fns"
import { Camera, ImageIcon, PlusCircle } from "lucide-react"
import { useState } from "react"

type Photo = {
  id: string
  url: string
  date: string
  type: string
}

export function PhotoGallery() {
  const { user, updateUser } = useAuth()
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  const handlePhotoUpload = async (file: File) => {
    if (!user) return

    try {
      // In a real app, this would upload to a server
      // For now, we'll create a local URL
      const photoUrl = URL.createObjectURL(file)
      const photoId = Date.now().toString()
      const photoDate = new Date().toISOString()
      const photoType = "front" // Default type

      // Add the new photo to the user's photos array
      const updatedPhotos = [
        ...(user.photos || []),
        {
          id: photoId,
          url: photoUrl,
          date: photoDate,
          type: photoType,
        },
      ]

      // Update the user's photos
      await updateUser({
        photos: updatedPhotos,
      })
    } catch (error) {
      console.error("Error uploading photo:", error)
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!user) return

    try {
      // Remove the photo from the user's photos array
      const updatedPhotos = (user.photos || []).filter((photo) => photo.id !== photoId)

      // Update the user's photos
      await updateUser({
        photos: updatedPhotos,
      })
    } catch (error) {
      console.error("Error deleting photo:", error)
    }
  }

  // Group photos by date
  const groupedPhotos = (user?.photos || []).reduce((groups, photo) => {
    const date = new Date(photo.date)
    const dateKey = format(date, "MMMM d, yyyy")
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(photo)
    return groups
  }, {} as Record<string, Photo[]>)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-500" />
              Progress Photos
            </CardTitle>
            <CardDescription>Track your fitness journey with photos</CardDescription>
          </div>
          <Button onClick={() => setIsUploadDialogOpen(true)} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Photo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {user?.photos && user.photos.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedPhotos).map(([date, photos]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-gray-500 mb-4">{date}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                        <img
                          src={photo.url}
                          alt={`Progress photo from ${format(new Date(photo.date), "MMMM d, yyyy")}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeletePhoto(photo.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No photos yet</h3>
            <p className="text-sm text-gray-500 mb-4">Start tracking your progress with photos</p>
            <Button onClick={() => setIsUploadDialogOpen(true)} className="flex items-center gap-2 mx-auto">
              <PlusCircle className="h-4 w-4" />
              Add Your First Photo
            </Button>
          </div>
        )}
      </CardContent>

      <PhotoUploadDialog
        open={isUploadDialogOpen}
        onOpenChangeAction={setIsUploadDialogOpen}
        onPhotoUploadAction={handlePhotoUpload}
      />
    </Card>
  )
}
