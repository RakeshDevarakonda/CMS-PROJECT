import mongoose from "mongoose";

const userAnalyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalPosts: { type: Number, default: 0 },
    approvedCount: { type: Number, default: 0 },
    draftCount: { type: Number, default: 0 },
    pendingCount: { type: Number, default: 0 },
    rejectedCount: { type: Number, default: 0 },
    deletedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);


userAnalyticsSchema.index({ userId: 1 });



export const UserAnalytics = mongoose.model(
  "UserAnalytics",
  userAnalyticsSchema
);
