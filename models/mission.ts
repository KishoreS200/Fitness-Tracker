import mongoose, { Schema, type Document } from "mongoose"

export interface IMission extends Document {
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard" | "epic"
  xp: number
  duration: number // in days
  category: string
  isActive: boolean
  progress: number
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const MissionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "epic"],
      default: "medium",
    },
    xp: { type: Number, required: true },
    duration: { type: Number, required: true }, // in days
    category: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Mission || mongoose.model<IMission>("Mission", MissionSchema)
