const mongoose = require("mongoose")

const authEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["login", "logout"], required: true },
  timestamp: { type: Date, default: Date.now },
  ip: String,
  userAgent: String,
})

module.exports = mongoose.model("AuthEvent", authEventSchema) 