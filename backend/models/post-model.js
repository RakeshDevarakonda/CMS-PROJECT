import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
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

  thumbnailType: {
    type: String,
    required: true,
  },

  
  status: {
    type: String,
    enum: ["draft", "approved", "pending", "rejected", "deleted"],
    default: "draft",
  },
  moderatedBy: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      updatedAt: {
        type: Date,
      },
      reason: { type: String, default: null },
      action: {
        type: String,
        enum: ["approved", "rejected"],
        required: true,
      },
      role: { type: String, enum: ["moderator", "admin"], required: true },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  reason: { type: String, default: null },
  version: {
    type: Number,
    required: true,
    default: 1,
  },
  likes: {
    type: Number,
    default: 1,
  },
  dislikes: {
    type: Number,
    default: 1,
  },
  viewsCount: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

export const Post = mongoose.model("Post", postSchema);
