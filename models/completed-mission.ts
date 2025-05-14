import mongoose, { Schema, type Document } from "mongoose"

export interface ICompletedMission extends Document {
  userId: mongoose.Types.ObjectId
  missionId: mongoose.Types.ObjectId
  title: string
  description: string
  difficulty: string
  xp: number
  category: string
  completedAt: Date
  createdAt: Date
  updatedAt: Date
}

const CompletedMissionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    missionId: { type: Schema.Types.ObjectId, ref: "Mission", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, required: true },
    xp: { type: Number, required: true },
    category: { type: String, required: true },
    completedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.CompletedMission || mongoose.model<ICompletedMission>("CompletedMission", CompletedMissionSchema) 