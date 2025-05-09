import mongoose from "mongoose";

const postHistorySchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  version: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  thumbnailImage: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    enum: ["draft", "approved", "pending", "rejected", "deleted"],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  reason: { type: String, default: null },
  moderatedBy: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, default: Date.now },
      reason: { type: String, default: null },
      action: { type: String, enum: ["approved", "rejected"], required: true },
      role: { type: String, enum: ["moderator", "admin"], required: true },
      UpdatedAt: {
        type: Date,
      },
    },
  ],

  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

postHistorySchema.index({
  postId: 1,
  version: -1,
  updatedAt: -1,
  moderatedBy: -1,
  userId: 1,
  createdBy: 1,
});

export const PostHistory = mongoose.model("PostHistory", postHistorySchema);
