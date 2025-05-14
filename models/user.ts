import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  level: number
  status: string
  badge: string
  authProvider?: "email" | "apple"
  xp: {
    current: number
    max: number
  }
  stats: {
    streak: number
    missions: number
    badges: number
  }
  profile?: {
    age?: number
    gender?: string
    height?: number
    weight?: number
    activityLevel?: string
    fitnessGoal?: string
    dietPreference?: string
  }
  settings?: {
    notifications?: {
      workoutReminders?: boolean
      missionUpdates?: boolean
      achievements?: boolean
      nutritionReminders?: boolean
      appUpdates?: boolean
    }
    workoutTimes?: {
      morning?: string
      evening?: string
    }
    theme?: string
    language?: string
    measurementSystem?: string
    privacy?: {
      profileVisibility?: string
      shareWorkouts?: boolean
      shareMissions?: boolean
      shareAchievements?: boolean
    }
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    authProvider: { type: String, enum: ["email", "apple"], default: "email" },
    level: { type: Number, default: 1 },
    status: { type: String, default: "bronze" },
    badge: { type: String, default: "beginner" },
    xp: {
      current: { type: Number, default: 0 },
      max: { type: Number, default: 1000 },
    },
    stats: {
      streak: { type: Number, default: 0 },
      missions: { type: Number, default: 0 },
      badges: { type: Number, default: 0 },
    },
    profile: {
      age: { type: Number },
      gender: { type: String },
      height: { type: Number },
      weight: { type: Number },
      activityLevel: { type: String },
      fitnessGoal: { type: String },
      dietPreference: { type: String },
    },
    settings: {
      notifications: {
        workoutReminders: { type: Boolean, default: true },
        missionUpdates: { type: Boolean, default: true },
        achievements: { type: Boolean, default: true },
        nutritionReminders: { type: Boolean, default: false },
        appUpdates: { type: Boolean, default: true },
      },
      workoutTimes: {
        morning: { type: String, default: "07:00" },
        evening: { type: String, default: "18:00" },
      },
      theme: { type: String, default: "light" },
      language: { type: String, default: "english" },
      measurementSystem: { type: String, default: "metric" },
      privacy: {
        profileVisibility: { type: String, default: "public" },
        shareWorkouts: { type: Boolean, default: true },
        shareMissions: { type: Boolean, default: true },
        shareAchievements: { type: Boolean, default: true },
      },
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
