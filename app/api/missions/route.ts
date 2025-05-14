import { connectToMongoDB } from "@/lib/mongodb"
import { missionService } from "@/services/mission-service"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get("isActive")
    const userId = searchParams.get("userId")

    // Build query
    const query: any = {}
    if (isActive !== null) {
      query.isActive = isActive === "true"
    }

    // Validate userId before adding it to the query
    if (userId) {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        query.userId = userId
      } else {
        console.warn("Invalid userId format:", userId)
      }
    }

    await connectToMongoDB()
    const missions = await missionService.find(query)
    return NextResponse.json(missions)
  } catch (error) {
    console.error("Error fetching missions:", error)
    return NextResponse.json({ error: "Failed to fetch missions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await connectToMongoDB()
    const mission = await missionService.create(data)
    return NextResponse.json(mission, { status: 201 })
  } catch (error) {
    console.error("Error creating mission:", error)
    return NextResponse.json({ error: "Failed to create mission" }, { status: 500 })
  }
}
