import { generateVerificationToken, hashPassword } from "@/lib/auth"
import { sendVerificationEmail } from "@/lib/email"
import { connectToMongoDB } from "@/lib/mongodb"
import User from "@/models/user"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    await connectToMongoDB()

    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate verification token
    const verificationToken = generateVerificationToken()
    const verificationExpires = new Date()
    verificationExpires.setHours(verificationExpires.getHours() + 24) // 24 hour expiration

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationExpires,
      level: 1,
      status: "bronze",
      badge: "beginner",
      xp: {
        current: 0,
        max: 1000,
      },
      stats: {
        streak: 0,
        missions: 0,
        badges: 0,
      },
    })

    await user.save()

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    // Return success without sensitive data
    return NextResponse.json(
      {
        message: "Registration successful. Please check your email to verify your account.",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
