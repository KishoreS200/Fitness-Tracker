const mongoose = require("mongoose")

const aiCoachMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  response: String,
  timestamp: { type: Date, default: Date.now },
})

module.exports = mongoose.model("AICoachMessage", aiCoachMessageSchema) 