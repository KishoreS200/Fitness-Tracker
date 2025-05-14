import { generateToken, verifyPassword } from "@/lib/auth"
import { connectToMongoDB } from "@/lib/mongodb"
import { AuthEvent, User } from "@/models"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    await connectToMongoDB()

    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check if email is verified
    if (!user.isVerified) {
      return NextResponse.json({ error: "Please verify your email before logging in" }, { status: 403 })
    }

    // Generate JWT token
    const token = generateToken({ userId: user._id, email: user.email })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    // Set userEmail cookie for middleware
    cookieStore.set("userEmail", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    // Set userId cookie for middleware
    cookieStore.set("userId", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    // Store login event in AuthEvent collection
    try {
      await AuthEvent.create({
        userId: user._id,
        type: "login",
        ip: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      })
    } catch (eventError) {
      console.error("Failed to log auth event:", eventError)
    }

    // Return user data without sensitive fields
    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        status: user.status,
        badge: user.badge,
        xp: user.xp,
        stats: user.stats,
        profile: user.profile,
        photos: user.photos,
      },
      token,
    })
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 })
  }
}
