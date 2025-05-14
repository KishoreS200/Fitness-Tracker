import { userService } from "@/services/user-service"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    const user = await userService.findByEmail(email)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Check if user already exists
    const existingUser = await userService.findByEmail(data.email)

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const user = await userService.create(data)
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json()

    if (!data.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await userService.findByEmail(data.email)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Ensure user is a valid IUser with _id
    if (!(user instanceof mongoose.Document) || !user._id) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 })
    }

    const updatedUser = await userService.updateById(user._id.toString(), data)
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
