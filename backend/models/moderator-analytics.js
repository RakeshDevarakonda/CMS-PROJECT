import mongoose from "mongoose";

const moderatorAnalyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalPosts: { type: Number, default: 0 },
    approvedCount: { type: Number, default: 0 },
    rejectedCount: { type: Number, default: 0 },
    adminrechangedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);


moderatorAnalyticsSchema.index({ userId: 1 });


const ModeratortAnalytics = mongoose.model(
  "ModeratortAnalytics",
  moderatorAnalyticsSchema
);

export default ModeratortAnalytics;
