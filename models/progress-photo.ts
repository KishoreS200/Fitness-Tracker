import mongoose, { Schema, type Document } from "mongoose"

export interface IProgressPhoto extends Document {
  userId: mongoose.Types.ObjectId
  date: Date
  type: "front" | "side" | "back" | "other"
  url: string
  createdAt: Date
  updatedAt: Date
}

const ProgressPhotoSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    type: {
      type: String,
      enum: ["front", "side", "back", "other"],
      default: "front",
    },
    url: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.ProgressPhoto || mongoose.model<IProgressPhoto>("ProgressPhoto", ProgressPhotoSchema) 