import { verifyToken } from "@/lib/auth"
import { progressPhotoService } from "@/services/progress-photo-service"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const photo = await progressPhotoService.deletePhoto(params.id)
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Photo deleted successfully" })
  } catch (error) {
    console.error("Error deleting progress photo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 