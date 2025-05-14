"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Calendar, Camera, ImageIcon, Upload, X } from "lucide-react"
import { useRef, useState } from "react"

interface PhotoUploadDialogProps {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onPhotoUploadAction: (photoData: {
    url: string
    date: string
    type: string
    id: string
  }) => void
}

export function PhotoUploadDialog({ open, onOpenChangeAction, onPhotoUploadAction }: PhotoUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [photoDate, setPhotoDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [photoType, setPhotoType] = useState<string>("front")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // In a real app, this would upload to a server
      // For now, we'll simulate an upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a unique ID for the photo
      const photoId = Date.now().toString()

      // Pass the photo data to the parent component
      onPhotoUploadAction({
        url: previewUrl as string,
        date: photoDate,
        type: photoType,
        id: photoId,
      })

      // Reset the form
      setSelectedFile(null)
      setPreviewUrl(null)
      setPhotoDate(new Date().toISOString().split("T")[0])
      setPhotoType("front")

      // Close the dialog
      onOpenChangeAction(false)

      toast({
        title: "Photo uploaded successfully",
        description: "Your progress photo has been added to your gallery",
      })
    } catch (error) {
      console.error("Error uploading photo:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    onOpenChangeAction(false)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Progress Photo</DialogTitle>
          <DialogDescription>Add a new photo to track your fitness progress over time</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {previewUrl ? (
            <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-lg border border-gray-200">
              <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={() => {
                  setSelectedFile(null)
                  setPreviewUrl(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
                suppressHydrationWarning
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              onClick={triggerFileInput}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Camera className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or GIF (max. 5MB)</p>
              </div>
              <input
                ref={fileInputRef}
                id="photo-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="photo-type" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Photo Type
              </Label>
              <Select value={photoType} onValueChange={setPhotoType}>
                <SelectTrigger id="photo-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="front">Front View</SelectItem>
                  <SelectItem value="side">Side View</SelectItem>
                  <SelectItem value="back">Back View</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} suppressHydrationWarning>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="flex items-center gap-2" suppressHydrationWarning>
            {isUploading ? (
              <>
                <span className="animate-spin">⏳</span>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Photo
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
