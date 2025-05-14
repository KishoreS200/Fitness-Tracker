import mongoose, { Document, Schema } from "mongoose"

export interface IWorkout extends Document {
  title: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: number // in minutes
  categories: string[]
  exercises: {
    name: string
    sets: number
    reps: number
    rest: number // in seconds
  }[]
  completedBy?: {
    userId: mongoose.Types.ObjectId
    completedAt: Date
    xpGained: number
    exercisesCompleted: {
      name: string
      setsCompleted: number
      repsCompleted: number
    }[]
  }[]
  createdAt: Date
  updatedAt: Date
}

const WorkoutSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
    duration: { type: Number, required: true }, // in minutes
    categories: [{ type: String }],
    exercises: [
      {
        name: { type: String, required: true },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        rest: { type: Number, default: 60 }, // in seconds
      },
    ],
    completedBy: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      completedAt: { type: Date, default: Date.now },
      xpGained: { type: Number, required: true },
      exercisesCompleted: [{
        name: { type: String, required: true },
        setsCompleted: { type: Number, required: true },
        repsCompleted: { type: Number, required: true }
      }]
    }]
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Workout || mongoose.model<IWorkout>("Workout", WorkoutSchema)
