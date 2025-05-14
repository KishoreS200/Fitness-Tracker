const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    authProvider: {
      type: String,
      enum: ["email", "apple"],
      default: "email",
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    level: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      default: "bronze",
    },
    badge: {
      type: String,
      default: "beginner",
    },
    xp: {
      current: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 1000,
      },
    },
    stats: {
      streak: {
        type: Number,
        default: 0,
      },
      missions: {
        type: Number,
        default: 0,
      },
      badges: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
)

const User = mongoose.model("User", userSchema)

module.exports = User
