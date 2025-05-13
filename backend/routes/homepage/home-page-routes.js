import express from "express";
import mongoose from "mongoose";
import { Post } from "../../models/post-model.js";
import { throwError } from "../../utils/throw-error.js";
import Comment from "./../../models/comments-model.js";

const homePageRouter = express.Router();

homePageRouter.get("/getallarticles", async (req, res, next) => {
  try {
    const { currentPage, allarticles } = req.query;

    const limit = 3;
    const skip = limit * (currentPage - 1);

    const totalCount = await Post.countDocuments({
      status: { $nin: ["pending", "deleted", "rejected"] },
    });

    const totalPages = Math.ceil(totalCount / limit);

    let posts;
    console.log(allarticles);
    if (allarticles === "true") {
      console.log("true");
      posts = await Post.find({
        status: { $nin: ["pending", "deleted", "rejected"] },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name avatar");
    } else {
      console.log("false");

      posts = await Post.find({
        status: { $nin: ["pending", "deleted", "rejected"] },
      })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("userId", "name avatar");
    }

    console.log(posts.length);

    res.json({
      posts,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

homePageRouter.get("/getsinglepost/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throwError(400, "Invalid Id Format Please try again");
    }

    const post = await Post.findById({
      _id: req.params.id,
      status: { $nin: ["pending", "rejected", "draft", "deleted"] }, // Exclude posts with any of these statuses
    }).populate("userId", "name avatar"); // Populate userId with 'name' and 'avatar'

    post.viewsCount += 1;
    await post.save();

    const relatedArticles = await Post.find({
      _id: { $ne: req.params.id },
      status: { $nin: ["rejected", "draft", "pending", "deleted"] }, // Exclude posts with these statuses
    })
      .limit(3)
      .sort({ createdAt: -1 }) // Optional: Sort by createdAt (newest first)
      .populate("userId", "name avatar"); // Populate userId with 'name' and 'avatar'
    if (!post) return next(new Error("Post not found"));

    res.json({ post, relatedArticles });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

homePageRouter.post("/singlepost/:id/like", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throwError(400, "Invalid Id Format Please try again");
    }

    const post = await Post.findById(req.params.id);
    if (!post) return next(new Error("Post not found"));

    post.likes = (post.likes || 0) + 1;
    await post.save();

    res.json({ message: "Post liked", totalLikes: post.likes });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

homePageRouter.post("/singlepost/:id/dislike", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throwError(400, "Invalid Id Format Please try again");
    }

    const post = await Post.findById(req.params.id);
    if (!post) return next(new Error("Post not found"));

    post.dislikes = (post.dislikes || 0) + 1;
    await post.save();

    res.json({ message: "Post disliked", totalDislikes: post.dislikes });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

homePageRouter.post("/addcomment", async (req, res, next) => {
  try {
    const { text, postId } = req.body;

    if (!text || !postId) {
      throwError(400, "Text and postId are required.");
    }

    const post = await Post.findById(postId);
    if (!post) {
      throwError(404, "Post not found.");
    }

    const newComment = new Comment({
      text,
      PostId: postId,
      createdAt: new Date(),
    });

    await newComment.save();

    return res.status(200).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.log(error);
    console.error(error);

    next(error);
  }
});

homePageRouter.post("/addveiwcount", async (req, res, next) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      throw new Error("postId is required.");
    }

    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    return res.status(200).json({
      message: "View count updated successfully",
      post: {
        id: post._id,
        title: post.title,
        viewsCount: post.viewsCount,
      },
    });
  } catch (error) {
    console.log(error);
    console.error(error);

    next(error);
  }
});

homePageRouter.get("/getcomments", async (req, res, next) => {
  const { id } = req.query;

  console.log(req.query, "comments");

  try {
    const comments = await Comment.find({ postId: id }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
});

homePageRouter.post("/comment", async (req, res, next) => {
  console.log(req.body);

  const { text, postId } = req.body;

  try {
    const newComment = new Comment({
      text,
      postId,
    });

    await newComment.save();
    res.status(201).json({
      message: "Comment created successfully!",
      comment: newComment,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default homePageRouter;
