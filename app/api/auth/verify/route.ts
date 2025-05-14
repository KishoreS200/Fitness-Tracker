import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/user"

export async function GET(request: Request) {
  try {
    await dbConnect()

    // Get token from URL
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    // Find user with this token
    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    // Mark user as verified and remove token
    user.isVerified = true
    user.verificationToken = undefined
    user.verificationExpires = undefined
    await user.save()

    // Redirect to login page with success message
    return NextResponse.redirect(new URL("/login?verified=true", request.url))
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.json({ error: "Failed to verify email" }, { status: 500 })
  }
}
