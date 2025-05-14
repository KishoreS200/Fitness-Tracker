import { NextResponse } from "next/server"
import { missionService } from "@/services/mission-service"
import { userService } from "@/services/user-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const mission = await missionService.findById(params.id)

    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 })
    }

    return NextResponse.json(mission)
  } catch (error) {
    console.error("Error fetching mission:", error)
    return NextResponse.json({ error: "Failed to fetch mission" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    // Get the current mission to check progress
    const currentMission = await missionService.findById(params.id)

    if (!currentMission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 })
    }

    // Update the mission
    const mission = await missionService.updateById(params.id, data)

    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 })
    }

    // If progress is 100% and it wasn't before, update user XP
    if (data.progress === 100 && currentMission.progress < 100 && mission.userId) {
      await userService.updateXP(mission.userId.toString(), mission.xp)
    }

    return NextResponse.json(mission)
  } catch (error) {
    console.error("Error updating mission:", error)
    return NextResponse.json({ error: "Failed to update mission" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const mission = await missionService.deleteById(params.id)

    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting mission:", error)
    return NextResponse.json({ error: "Failed to delete mission" }, { status: 500 })
  }
}
