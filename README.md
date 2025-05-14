# Fitness Tracker - MongoDB Integration Guide

This guide provides a comprehensive overview of how to set up and use MongoDB with the Fitness Tracker application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [MongoDB Connection](#mongodb-connection)
4. [Data Models](#data-models)
5. [Database Services](#database-services)
6. [API Integration](#api-integration)
7. [Seeding the Database](#seeding-the-database)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following:

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Basic knowledge of TypeScript and Next.js

## Environment Setup

1. Create a `.env.local` file in the root of your project with the following variables:

\`\`\`env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=http://localhost:3000/api
\`\`\`

Replace the `MONGODB_URI` with your actual MongoDB connection string.

## MongoDB Connection

The application uses a connection utility in `lib/mongodb.ts` that:

- Caches the MongoDB connection to prevent multiple connections
- Handles connection errors gracefully
- Provides utility functions for connecting and disconnecting

### Usage

\`\`\`typescript
import { connectToMongoDB } from "@/lib/mongodb"

async function fetchData() {
  await connectToMongoDB()
  // Your database operations here
}
\`\`\`

## Data Models

The application uses Mongoose models to define the data structure:

- `User`: Stores user information, XP, and stats
- `Mission`: Stores mission details and progress
- `Workout`: Stores workout details and exercises

### Example Model

\`\`\`typescript
import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  // Other fields...
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Other fields...
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
\`\`\`

## Database Services

The application uses service classes to handle database operations:

- `DatabaseService`: A generic service for CRUD operations
- `UserService`: User-specific operations
- `MissionService`: Mission-specific operations
- `WorkoutService`: Workout-specific operations

### Example Service Usage

\`\`\`typescript
import { userService } from "@/services/user-service"

// Find a user by email
const user = await userService.findByEmail("user@example.com")

// Update a user's XP
await userService.updateXP(userId, 100)
\`\`\`

## API Integration

The API routes use the database services to handle requests:

- `GET /api/user`: Get user information
- `POST /api/user`: Create a new user
- `PATCH /api/user`: Update user information
- `GET /api/missions`: Get missions
- `POST /api/missions`: Create a new mission
- `PATCH /api/missions/:id`: Update a mission
- `DELETE /api/missions/:id`: Delete a mission
- `GET /api/workouts`: Get workouts
- `POST /api/workouts`: Create a new workout

### Example API Route

\`\`\`typescript
import { NextResponse } from "next/server"
import { userService } from "@/services/user-service"

export async function GET(request: Request) {
  try {
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
\`\`\`

## Seeding the Database

The application includes a seed script to populate the database with initial data:

\`\`\`bash
# Run the seed script
npx ts-node scripts/seed-db.ts
\`\`\`

The seed script:

1. Connects to MongoDB
2. Clears existing data
3. Creates a demo user
4. Creates sample missions
5. Creates sample workouts

## Troubleshooting

### Connection Issues

If you're having trouble connecting to MongoDB:

1. Check your `MONGODB_URI` environment variable
2. Ensure your IP address is whitelisted in MongoDB Atlas
3. Check your network connection

### Data Not Showing Up

If data isn't showing up in your application:

1. Check the API responses in your browser's developer tools
2. Verify that the data exists in the database
3. Check for errors in the console

### Performance Issues

If you're experiencing performance issues:

1. Add indexes to frequently queried fields
2. Use projection to limit the fields returned
3. Implement pagination for large collections
