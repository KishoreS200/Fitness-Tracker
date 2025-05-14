const mongoose = require("mongoose")

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  rest: {
    type: Number,
    default: 60,
  },
})

const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
    duration: {
      type: Number,
      required: true,
    },
    categories: [
      {
        type: String,
      },
    ],
    exercises: [exerciseSchema],
  },
  {
    timestamps: true,
  },
)

const Workout = mongoose.model("Workout", workoutSchema)

module.exports = Workout
