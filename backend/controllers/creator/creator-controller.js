import mongoose from "mongoose";

import bcrypt from "bcrypt";

import { Post } from "../../models/post-model.js";
import { throwError } from "../../utils/throw-error.js";
import { deleteUrl } from "../../utils/DeleteUrls.js";
import User from "../../models/user-model.js";
import { uploadToCloudinary } from "./../../utils/cloudinary.js";
import { PostHistory } from "../../models/post-version-history.js";
import { updateUserAnalytics } from "../../utils/user-post-update-analytics.js";
import { UserAnalytics } from "../../models/creator-posts-analytics.js";
import { updateAdminAnalytics } from "../../utils/admin-analytics.js";

const allowedStatuses = ["draft", "approved", "pending", "rejected", "removed"];
const isNonEmptyString = (val) =>
  typeof val === "string" && val.trim().length > 0;

export const createPostController = async (req, res, next) => {
  const {
    content,
    title,
    tags: Parsedtags,
    status,
    urls,
    thumbnailType,
    thumbnailUrl,
  } = req.body;

  try {
    // Validation
    if (!isNonEmptyString(title)) {
      throwError(400, "Title is required and must be a non-empty string");
    }

    if (!isNonEmptyString(content)) {
      throwError(400, "Content is required and must be a non-empty string");
    }

    const parsedUrls = JSON.parse(urls || "[]");
    const tags = JSON.parse(Parsedtags || "[]");

    if (!Array.isArray(parsedUrls)) {
      throwError(400, "'urls' must be an array");
    }

    if (tags && (!Array.isArray(tags) || !tags.every(isNonEmptyString))) {
      throwError(400, "'tags' must be an array of non-empty strings");
    }

    if (tags.length === 0) {
      throwError(400, "please add atleast one tag");
    }

    if (
      status &&
      (!isNonEmptyString(status) ||
        !allowedStatuses.includes(status.toLowerCase()))
    ) {
      throwError(
        400,
        `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`
      );
    }

 

    const newPost = new Post({
      content: content.trim(),
      title: title.trim(),
      tags,
      status,
      source: "post",
      createdBy: req.role,
      userId: req.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      thumbnailType: thumbnailType,
    });

    // Handle thumbnail
    if (thumbnailType === "url") {
      if (!isNonEmptyString(thumbnailUrl)) {
        throwError(400, "Thumbnail URL must be a non-empty string");
      }
      newPost.thumbnailImage = thumbnailUrl;
    } else if (thumbnailType === "upload") {
      const photos = req.files?.map((file) => file.path) || [];

      if (photos.length > 0) {
        const result = await uploadToCloudinary(photos);
        if (result.success && result.urls.length > 0) {
          newPost.thumbnailImage = result.urls[0];
        } else {
          throwError(500, "Image upload failed");
        }
      } else {
        throwError(400, "Thumbnail file is missing");
      }
    } else {
      throwError(400, "Invalid thumbnail type. Must be 'url' or 'upload'");
    }

    await updateUserAnalytics(req.id, "create", null, status);

    const savedPost = await newPost.save();
    const deletionResults = await deleteUrl(parsedUrls);

    if (status === "pending") {
      await updateAdminAnalytics(null, status);

      await updateAdminAnalytics(null, addposts);
    }

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      deletionResults,
      data: savedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPostsController = async (req, res, next) => {
  try {
    const {
      contentCurrentPageNumber,
      contentRowsPerPage,
      contentStatusFilter,
      finalStartDate,
      finalSearchterm,
      finalEndDate,
      sortBy = "updatedAt",
      sortOrder = "desc",
    } = req.query;

    const page = parseInt(contentCurrentPageNumber);
    const limit = parseInt(contentRowsPerPage);
    if (isNaN(page) || isNaN(limit)) {
      throwError(400, "Pagination parameters must be valid numbers");
    }

    const skip = page * limit;

    const query = {
      userId: new mongoose.Types.ObjectId(req.id),
      status: { $ne: "deleted" },
    };

    // Status Filter
    const normalizedStatus = contentStatusFilter?.toLowerCase();
    if (normalizedStatus && normalizedStatus !== "all") {
      if (!allowedStatuses.includes(normalizedStatus)) {
        throwError(
          400,
          `Invalid status filter. Allowed: ${allowedStatuses.join(
            ", "
          )} or 'all'`
        );
      }
      query.status = normalizedStatus;
    }

    // Date Filter
    if (finalStartDate && finalEndDate) {
      const startDate = new Date(finalStartDate + "T00:00:00+05:30");
      const endDate = new Date(finalEndDate + "T23:59:59+05:30");

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throwError(400, "Invalid date format. Use YYYY-MM-DD.");
      }
      if (startDate > endDate) {
        throwError(400, "Start date cannot be later than end date.");
      }

      query.updatedAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    let posts = await Post.find(query).sort({ version: -1 });

    const searchTerm = finalSearchterm?.trim().toLowerCase();
    if (searchTerm) {
      posts = posts.filter((post) =>
        post.title?.toLowerCase().includes(searchTerm)
      );
    }

    // Sort posts
    posts.sort((a, b) => {
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    // Pagination + latestModerationDate
    const paginatedPosts = posts.slice(skip, skip + limit).map((post) => {
      const moderatedBy = post.moderatedBy || [];
      const lastModeration = moderatedBy[moderatedBy.length - 1];
      return {
        ...post._doc,
        latestModerationDate: lastModeration?.updatedAt || null,
      };
    });

    const userAnalytics = await UserAnalytics.findOne({ userId: req.id });

    const statusSummary = {
      draft: userAnalytics?.draftCount || 0,
      approved: userAnalytics?.approvedCount || 0,
      pending: userAnalytics?.pendingCount || 0,
      rejected: userAnalytics?.rejectedCount || 0,
      deleted: userAnalytics?.deletedCount || 0,
      totalCount: posts.length,
    };

    res.status(200).json({
      totalPages: Math.ceil(posts.length / limit),
      statusSummary,
      posts: paginatedPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const getCreatorStatsController = async (req, res, next) => {
  try {
    const userId = req.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const posts = await Post.find({
      userId: new mongoose.Types.ObjectId(userId),
      status: { $ne: "deleted" },
    })
      .sort({ updatedAt: -1 })
      .limit(5);

    let userAnalytics = await UserAnalytics.findOne({ userId: req.id });

    if (!userAnalytics) {
      userAnalytics = new UserAnalytics({
        userId: req.id,
        totalPosts: 0,
        draftCount: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
        deletedCount: 0,
      });

      await userAnalytics.save();
    }

    const statusSummary = {
      draft: userAnalytics.draftCount,
      approved: userAnalytics.approvedCount,
      pending: userAnalytics.pendingCount,
      rejected: userAnalytics.rejectedCount,
      deleted: userAnalytics.deletedCount,
      totalCount: userAnalytics.totalPosts,
    };

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 4); // includes today

    const statuses = ["draft", "approved", "pending", "rejected", "deleted"];

    const dailyStatusStats = await Post.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          updatedAt: { $gte: fiveDaysAgo },
        },
      },
      {
        $project: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
          },
          status: 1,
        },
      },
      {
        $group: {
          _id: { date: "$date", status: "$status" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.date": 1 },
      },
    ]);

    // Initialize empty structure for last 5 days
    const lastFiveDaysStats = {};
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formatted = date.toISOString().split("T")[0];
      lastFiveDaysStats[formatted] = {};
      statuses.forEach((status) => {
        lastFiveDaysStats[formatted][status] = 0;
      });
    }

    // Fill actual data
    dailyStatusStats.forEach(({ _id, count }) => {
      const { date, status } = _id;
      if (lastFiveDaysStats[date]) {
        lastFiveDaysStats[date][status] = count;
      }
    });

 

    res.status(200).json({
      dataCount: statusSummary,
      latestPosts: posts,
      lastFiveDaysStats,
    });
  } catch (error) {
    console.error("Error fetching creator stats:", error);
    next(error);
  }
};

export const getProfileDataController = async (req, res, next) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId, { password: 0 });

    if (!user) {
      return throwError(404, "User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfileDataController = async (req, res, next) => {
  try {
    const userId = req.id; // Get the user ID from the authenticated request
    const user = await User.findById(userId); // Fetch user by ID from the database

    if (!user) {
      throwError(404, "User not found");
    }

    // Handle file upload
    const photos = req.files?.map((file) => file.path) || [];
    let uploadedImageUrls = [];

    if (photos.length > 0) {
      const result = await uploadToCloudinary(photos);
      if (result.success) {
        uploadedImageUrls = result.urls;
        if (uploadedImageUrls.length > 0) {
          if (user.avatar) {
            await deleteUrl([user.avatar]);
          }
          user.avatar = uploadedImageUrls[0]; // Update the avatar if the image upload was successful
        }
      } else {
        console.warn("Image upload failed, continuing to update other fields");
      }
    }

    const {
      name,
      email,
      mobileNumber,
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (name && name.trim().length < 3) {
      throwError(400, "Name must be at least 3 characters long.");
    }

    if (
      email &&
      !/^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      throwError(400, "Invalid email format.");
    }

    if (email) {
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser && existingEmailUser._id.toString() !== userId) {
        throwError(409, "Email is already taken by another user.");
      }
    }

    if (name) {
      const existingUsernameUser = await User.findOne({ name });
      if (
        existingUsernameUser &&
        existingUsernameUser._id.toString() !== userId
      ) {
        throwError(409, "Username is already taken by another user.");
      }
    }

    if (mobileNumber && mobileNumber.trim().length !== 10) {
      const numericOnly = mobileNumber.replace(/\D/g, "");
      if (numericOnly.length !== 10) {
        throwError(400, "Enter a valid 10-digit mobile number.");
      }
    }

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        throwError(400, "Current password is required to change the password.");
      }

      if (newPassword !== confirmPassword) {
        throwError(400, "New password and confirm password do not match.");
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        throwError(400, "Current password is incorrect.");
      }

      const isSameAsOld = await bcrypt.compare(newPassword, user.password);
      if (isSameAsOld) {
        throwError(
          400,
          "New password cannot be the same as the current password."
        );
      }
      if (!isCurrentPasswordValid) {
        throwError(400, "Current password is incorrect.");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobileNumber) user.mobileNumber = mobileNumber;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        avatar: user.avatar,
      },
      imageUploadStatus:
        uploadedImageUrls.length > 0 ? "success" : "failed or not uploaded",
    });
  } catch (error) {
 
    next(error);
  }
};

export const getSinglePostController = async (req, res, next) => {
  const { id } = req.params;

  const { version } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return throwError(400, "Invalid Post ID");
  }

  try {
    const post = await Post.findById(id);

    if (version < post.version) {
      return throwError(
        404,
        "Newer version of this post avaialble, cannot edit this badcow"
      );
    }

    if (!post) {
      return throwError(404, "Post not found");
    }

    if (post.status === "pending") {
      return throwError(
        404,
        "post is currently pending cannot edit it until its Approved"
      );
    }

    if (post.status === "deleted" || post.status === "rejected") {
      return throwError(
        404,
        "cannot edit the post that either already deleted or rejected"
      );
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const { version } = req.query;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return throwError(400, "Invalid Post ID format");
    }

    const post = await Post.findById(postId);

    if (version < post.version) {
      return throwError(
        404,
        "Newer version of this post avaialble, cannot delete old one"
      );
    }

    if (!post) {
      return throwError(404, "Post not found");
    }

    if (post.status == "deleted" || post.status == "rejected") {
      return throwError(
        404,
        "cannot delete the post that either already deleted or rejected"
      );
    }

    await updateAdminAnalytics(post.status, "deleted");

    await updateUserAnalytics(req.id, "delete", post.status, "deleted");

    // Update status to 'deleted'
    post.status = "deleted";
    await post.save();

    res.status(200).json({ message: "Post status changed to deleted" });
  } catch (error) {
    next(error);
  }
};

export const updatePostController = async (req, res, next) => {
  const {
    title,
    content,
    tags: Parsedtags,
    status,
    urls: parsedUrls,
    id,
    thumbnailType,
    thumbnailUrl,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throwError(400, "Invalid Id Format Please try again");
  }

  try {
    const post = await Post.findById(id);

    const urls = JSON.parse(parsedUrls || "[]");
    const tags = JSON.parse(Parsedtags || "[]");

    if (!post || post.status === "deleted") {
      throwError(404, "Post not found");
    }

    if (post.status === "pending") {
      throwError(
        404,
        "Post is currently pending and cannot be edited until it's approved"
      );
    }

    if (post.userId.toString() !== req.id) {
      throwError(403, "You are not authorized to edit this post");
    }

    // Validate inputs
    if (title && !isNonEmptyString(title)) {
      throwError(400, "Title must be a non-empty string");
    }
    if (content && !isNonEmptyString(content)) {
      throwError(400, "Content must be a non-empty string");
    }
    if (urls && !Array.isArray(urls)) {
      throwError(400, "'urls' must be an array");
    }
    if (tags && (!Array.isArray(tags) || !tags.every(isNonEmptyString))) {
      throwError(400, "'tags' must be an array of non-empty strings");
    }

    if (tags.length === 0) {
      throwError(400, "please add atleast one tag");
    }
    if (
      status &&
      (!isNonEmptyString(status) ||
        !allowedStatuses.includes(status.toLowerCase()))
    ) {
      throwError(
        400,
        `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`
      );
    }

    const updatedUrls = [...urls, post.thumbnailImage];

    // Optional: delete unused URLs
    const deletionResults = updatedUrls ? await deleteUrl(updatedUrls) : [];

    // Save current version to PostHistory
    const postHistory = new PostHistory({
      postId: post._id,
      title: post.title,
      content: post.content,
      status: post.status,
      tags: post.tags,
      version: parseInt(post.version),
      userId: post.userId,
      reason: post.reason,
      createdBy: req.role,
      source: "posthistory",
      thumbnailImage: post.thumbnailImage,
      moderatedBy:
        Array.isArray(post.moderatedBy) && post.moderatedBy.length > 0
          ? post.moderatedBy.map((m) => ({
              user: m.user,
              date: m.date,
              action: m.action,
              role: m.role,
              reason: m.reason || null,
            }))
          : [],
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });

    await postHistory.save();

    // Handle thumbnail logic
    let newThumbnail = post.thumbnailImage;

    if (thumbnailType === "url") {
      if (!isNonEmptyString(thumbnailUrl)) {
        throwError(400, "Thumbnail URL must be a non-empty string");
      }
      newThumbnail = thumbnailUrl;
    } else if (thumbnailType === "upload") {
      const files = req.files?.map((file) => file.path) || [];
      if (files.length > 0) {
        const uploadResult = await uploadToCloudinary(files);
        if (uploadResult.success && uploadResult.urls.length > 0) {
          newThumbnail = uploadResult.urls[0];
        } else {
          throwError(500, "Image upload failed");
        }
      } else {
        throwError(400, "Thumbnail file is missing for upload");
      }
    }

    // Construct updated post object
    const updatedPost = {
      title: title || post.title,
      content: content || post.content,
      status: status || post.status,
      tags: tags || post.tags,
      version: parseInt(post.version) + 1,
      updatedAt: Date.now(),
      moderatedBy: [],
      thumbnailImage: newThumbnail,
      thumbnailType: thumbnailType,
    };

    await updateAdminAnalytics(null, "pending");
    await updateAdminAnalytics(null, "addposts");

    await updateUserAnalytics(req.id, "update", post.status, status);

    const updated = await Post.findByIdAndUpdate(id, updatedPost, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      deletionResults,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostByVersions = async (req, res, next) => {
  const { id, version, source } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return throwError(400, "Invalid Post ID");
  }

  try {
    let finalPost = null;

    if (source === "post") {
      const post = await Post.findById(id);
      if (post && post.version == version) {
        finalPost = post;
      }
    } else {
      const postHistory = await PostHistory.findOne({
        postId: id,
        version: parseInt(version),
      });

      if (postHistory && postHistory.version == version) {
        finalPost = postHistory;
      }
    }

    if (!finalPost) {
      return throwError(404, "Post not found");
    }

    res.status(200).json({
      success: true,
      data: finalPost,
    });
  } catch (error) {
    next(error);
  }
};
