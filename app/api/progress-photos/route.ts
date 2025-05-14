import { verifyToken } from "@/lib/auth"
import { connectToMongoDB } from "@/lib/mongodb"
import { progressPhotoService } from "@/services/progress-photo-service"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Connect to MongoDB
    await connectToMongoDB()

    const photos = await progressPhotoService.findByUserId(payload.userId)
    return NextResponse.json(photos)
  } catch (error) {
    
    console.error("Error fetching progress photos:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Connect to MongoDB
    await connectToMongoDB()

    const data = await request.json()
    const photo = await progressPhotoService.createPhoto(payload.userId, data)
    return NextResponse.json(photo)
  } catch (error) {
    console.error("Error creating progress photo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 