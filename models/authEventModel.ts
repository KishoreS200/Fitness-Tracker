import mongoose, { Document, Model } from "mongoose";

interface IAuthEvent extends Document {
  userId: mongoose.Types.ObjectId;
  eventType: "login" | "logout" | "register" | "password_reset";
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const authEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventType: {
      type: String,
      enum: ["login", "logout", "register", "password_reset"],
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
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

const AuthEvent: Model<IAuthEvent> =
  mongoose.models.AuthEvent || mongoose.model<IAuthEvent>("AuthEvent", authEventSchema);

export default AuthEvent; 