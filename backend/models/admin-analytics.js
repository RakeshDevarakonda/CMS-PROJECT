import mongoose from "mongoose";

const adminAnalyticsSchema = new mongoose.Schema({
  totalPosts: { type: Number, required: true },
  creator: { type: Number, required: true },
  moderator: { type: Number, required: true },
  deleted: { type: Number, required: true },
  approved: { type: Number, required: true },
  pending: { type: Number, required: true },
  rejected: { type: Number, required: true },
});

const AdminAnalytics = mongoose.model("AdminAnalytics", adminAnalyticsSchema);

export default AdminAnalytics;
