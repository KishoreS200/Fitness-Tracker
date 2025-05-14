import mongoose, { Document, Model } from "mongoose";

interface IAICoachMessage extends Document {
  userId: mongoose.Types.ObjectId;
  message: string;
  response: string;
  timestamp: Date;
}

const aiCoachMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const AICoachMessage: Model<IAICoachMessage> =
  mongoose.models.AICoachMessage ||
  mongoose.model<IAICoachMessage>("AICoachMessage", aiCoachMessageSchema);

export default AICoachMessage; 