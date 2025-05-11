import mongoose from "mongoose";
import { Post } from "../../models/post-model.js";
import User from "../../models/user-model.js";
import { throwError } from "../../utils/throw-error.js";
import { deleteUrl } from "./../../utils/DeleteUrls.js";
import { PostHistory } from "../../models/post-version-history.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import bcrypt from "bcrypt";
import { updateUserAnalytics } from "../../utils/user-post-update-analytics.js";
import { updateModeratorAnalytics } from "../../utils/moderator-analytics.js";
import { updateAdminAnalytics } from "../../utils/admin-analytics.js";
import AdminAnalytics from "../../models/admin-analytics.js";

const allowedStatuses = ["draft", "approved", "pending", "rejected", "removed"];

const isNonEmptyString = (val) =>
  typeof val === "string" && val.trim().length > 0;

export const getAllAdminPosts = async (req, res, next) => {
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
      selectedFilterType = "All Posts",
      finalSearchUsername,
      isSearchModeratorName = "false",
    } = req.query;

    const page = parseInt(contentCurrentPageNumber);
    const limit = parseInt(contentRowsPerPage);
    const skip = page * limit;

    const query = {
      status: { $ne: "deleted" },
    };

    switch (selectedFilterType) {
      case "Creator Posts":
        query.createdBy = "creator";
        query.status = { $nin: ["deleted", "draft"] };
        break;

      case "Admin Posts":
        query.$or = [
          { moderatedBy: { $elemMatch: { role: "admin" } } },
          { createdBy: "admin" },
        ];
        query.status = { $nin: ["deleted"] };
        break;
      case "Moderator Posts":
        if (isSearchModeratorName !== "true") {
          query.moderatedBy = {
            $elemMatch: {
              role: "moderator",
            },
          };
        }
        break;
      default:
        query.$or = [
          { createdBy: "admin", status: { $ne: "deleted" } },
          { createdBy: "creator", status: { $nin: ["deleted", "draft"] } },
        ];
    }

    if (
      finalSearchUsername &&
      finalSearchUsername.length > 0 &&
      isSearchModeratorName === "true"
    ) {
      const matchingModerators = await User.find({
        name: { $regex: finalSearchUsername, $options: "i" },
        role: "moderator",
      }).select("_id");

      const moderatorIds = matchingModerators.map((mod) => mod._id);

      if (moderatorIds.length > 0) {
        query.$and = query.$and || [];
        query.$and.push({
          moderatedBy: {
            $elemMatch: {
              user: { $in: moderatorIds },
              role: "moderator",
            },
          },
        });
      } else {
        query.$and = [{ _id: null }];
      }
    } else if (finalSearchUsername && finalSearchUsername.length > 0) {
      const matchingUsers = await User.find({
        name: { $regex: finalSearchUsername, $options: "i" },
      }).select("_id role");

      const userIds = [];
      for (const user of matchingUsers) {
        if (
          (selectedFilterType === "Admin Posts" ||
            selectedFilterType === "Admin List") &&
          user.role === "admin"
        ) {
          userIds.push(user._id);
        } else if (
          (selectedFilterType === "Creator Posts" ||
            selectedFilterType === "Creator List") &&
          user.role === "creator"
        ) {
          userIds.push(user._id);
        } else if (selectedFilterType === "All Posts") {
          userIds.push(user._id);
        }
      }

      if (userIds.length > 0) {
        query.$and = query.$and || [];
        query.$and.push({ userId: { $in: userIds } });
      } else {
        query.$and = [{ _id: null }];
      }
    }

    if (contentStatusFilter && contentStatusFilter.toLowerCase() !== "all") {
      query.status = contentStatusFilter.toLowerCase();
    }

    if (finalStartDate && finalEndDate) {
      const startDate = new Date(`${finalStartDate}T00:00:00+05:30`);
      const endDate = new Date(`${finalEndDate}T23:59:59+05:30`);

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

    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    const totalCount = await Post.countDocuments(query);
    let posts = await Post.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("userId", "name role")
      .populate("moderatedBy.user", "name role")
      .lean();
    if (finalSearchterm) {
      const searchTerm = finalSearchterm.trim().toLowerCase();
      posts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm)
      );
    }

    const statusSummary = {
      totalCount,
    };

    res.status(200).json({
      totalPages: Math.ceil(totalCount / limit),
      statusSummary,
      posts,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { manageuser, finalSearchUsername } = req.query;

    const query = {};

    query.role = manageuser;

    if (finalSearchUsername && finalSearchUsername.trim().length > 0) {
      query.name = { $regex: finalSearchUsername, $options: "i" };
    }

    const getUsers = await User.find(query);

    const totalCount = await User.countDocuments(query);

    const statusSummary = {
      totalCount,
    };

    res.status(200).json({ getUsers, statusSummary });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAdminProfileData = async (req, res, next) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId, { password: 0 });

    if (!user) {
      return throwError(404, "User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const changePostStatusByAdmin = async (req, res, next) => {
  try {
    const { postId, status, source, reason, version, isChecked } = req.body;

    if (!postId || !status || !source) {
      throwError(400, "Post ID, Status, and Source are required.");
    }

    if (source === "posthistory") {
      throwError(400, "Cannot change the status of older versions of posts.");
    }

    const post = await Post.findById(postId).populate("userId", "name role");
    if (!post) {
      throwError(404, "Post not found.");
    }

    if (post.status === "deleted") {
      throwError(400, "Post is already deleted by user.");
    }
    if (post.moderatedBy.length > 0) {
      if (!isChecked) {
        const error = new Error("Post is already moderated by another user.");
        error.statusCode = 400;
        error.customCode = "POST_ALREADY_MODERATED";
        throw error;
      }
    }

    if (status.toLowerCase() === "pending") {
      throwError(400, "Status cannot be set to pending again.");
    }

    if (post.status === "draft") {
      throwError(400, "Currently, post status is draft; cannot change status.");
    }

    if (post.version > version) {
      throwError(
        400,
        "Cannot change status: newer version of this post available."
      );
    }

    if (post.role === "creator") {
      await updateUserAnalytics(post.userId, "update", post.status, status);
    }

    await updateAdminAnalytics(post.status, status, "previousToNew");

    const adminanalyticsData = await AdminAnalytics.findOne();

    const statusSummary = {
      totalPosts: adminanalyticsData.totalPosts,
      creator: adminanalyticsData.creator,
      moderator: adminanalyticsData.moderator,
      deleted: adminanalyticsData.deleted,
      approved: adminanalyticsData.approved,
      pending: adminanalyticsData.pending,
      rejected: adminanalyticsData.rejected,
    };

    post.status = status;

    const existingModerationIndex = post.moderatedBy.findIndex(
      (mod) => mod.user.toString() === req.id.toString() && mod.role === "admin"
    );

    const moderationEntry = {
      user: req.id,
      updatedAt: new Date(),
      action: status,
      role: "admin",
      reason: reason || null,
    };

    if (existingModerationIndex !== -1) {
      post.moderatedBy[existingModerationIndex] = moderationEntry;
    } else {
      post.moderatedBy.push(moderationEntry);
    }

    post.reason = reason && reason.trim().length > 0 ? reason : null;

    await post.save();

    await post.populate("moderatedBy.user", "name email role");

    res.status(200).json({
      message: "Post status updated successfully.",
      post,
      dataCount: statusSummary,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const changeUserActive = async (req, res, next) => {
  try {
    const { userId: id } = req.body;

    if (!id) {
      throwError(400, "User ID is required.");
    }

    if (id.toString() === req.id.toString()) {
      throwError(400, "you cannot inactive yourself");
    }

    const user = await User.findById(id);
    if (!user) {
      throwError(404, "User not found.");
    }

    user.isActive = typeof user.isActive === "boolean" ? !user.isActive : true;

    await user.save();

    res.status(200).json({
      message: `User has been ${
        user.isActive ? "activated" : "deactivated"
      } successfully.`,
      isActive: user.isActive,
      user,
      role: user?.role,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateAdminProfile = async (req, res, next) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      throwError(404, "User not found");
    }

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
          user.avatar = uploadedImageUrls[0];
        }
      } else {
        console.log("result.error?.message");
        if (result.error?.message?.startsWith("File size too large")) {
          return throwError(400, "File size too large");
        }
        throwError(400, result.error?.message || "Image upload failed");
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
      payload: {
        id: user._id,
        email: user.email,
        username: user.name,
        role: user.role,
        isActive: user.isActive,
      },
      imageUploadStatus:
        uploadedImageUrls.length > 0 ? "success" : "failed or not uploaded",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getSinglePostByAdmin = async (req, res, next) => {
  const { id } = req.params;

  const { version } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return throwError(400, "Invalid Post ID");
  }

  try {
    const post = await Post.findById(id);

    if (post.status === "deleted" || post.status === "rejected") {
      return throwError(
        404,
        "cannot edit the post that either already deleted or rejected"
      );
    }

    if (version < post.version) {
      return throwError(
        404,
        "Newer version of this post avaialble, cannot edit this "
      );
    }

    if (!post) {
      return throwError(404, "Post not found");
    }

    if (post.status === "pending") {
      throwError(
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
    console.log(error);
    next(error);
  }
};

export const getAdminStats = async (req, res, next) => {
  try {
    let analytics = await AdminAnalytics.findOne();

    if (!analytics) {
      analytics = new AdminAnalytics({
        totalPosts: 0,
        creator: 0,
        moderator: 0,
        deleted: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
      });
      await analytics.save();
    }

    const statusSummary = {
      totalPosts: analytics.totalPosts,
      creator: analytics.creator,
      moderator: analytics.moderator,
      deleted: analytics.deleted,
      approved: analytics.approved,
      pending: analytics.pending,
      rejected: analytics.rejected,
    };

    // Last 5 days admin stats
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 4);

    const adminStatusStats = await Post.aggregate([
      {
        $match: {
          updatedAt: { $gte: fiveDaysAgo },
        },
      },
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          status: 1,
        },
      },
      {
        $group: {
          _id: { date: "$date", status: "$status" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    const statuses = ["approved", "rejected", "pending"];
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

    adminStatusStats.forEach(({ _id, count }) => {
      const { date, status } = _id;
      if (lastFiveDaysStats[date]) {
        lastFiveDaysStats[date][status] = count;
      }
    });

    console.log(lastFiveDaysStats);

    res.status(200).json({
      dataCount: statusSummary,
      lastFiveDaysStats,
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllVersionsByAdmin = async (req, res, next) => {
  const { id, version, source } = req.query;

  console.log("id", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return throwError(400, "Invalid Post ID");
  }

  try {
    let finalPost = null;

    if (source === "post") {
      const post = await Post.findById(id)
        .populate("userId", "name role")
        .populate("moderatedBy.user", "name role")
        .lean();

      if (post && post.version == version) {
        finalPost = post;
      }
    } else {
      const postHistory = await PostHistory.findOne({
        postId: id,
        version: parseInt(version),
      })
        .populate("userId", "name role")
        .populate("moderatedBy.user", "name role")
        .lean();

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
    console.log(error);
    next(error);
  }
};

export const createPostByAdmin = async (req, res, next) => {
  const {
    title,
    content,
    tags: Parsedtags,
    status,
    urls: urlsarray,
    thumbnailType,
    thumbnailUrl,
  } = req.body;

  const urls = JSON.parse(urlsarray || "[]");

  const tags = JSON.parse(Parsedtags || "[]");

  try {
    if (!isNonEmptyString(title)) {
      throwError(400, "Title is required and must be a non-empty string");
    }

    if (!isNonEmptyString(content)) {
      throwError(400, "Content is required and must be a non-empty string");
    }

    if (!Array.isArray(urls)) {
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
      createdBy: req.role,
      userId: req.id,
      source: "post",
      createdAt: new Date(),
      updatedAt: new Date(),
      thumbnailType: thumbnailType,
    });

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

    const savedPost = await newPost.save();

    const deletionResults = await deleteUrl(urls);

    if (status === "pending") {
      await updateAdminAnalytics(null, null, "pending");
      await updateAdminAnalytics(null, null, "addposts");
    }

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      deletionResults,
      data: savedPost,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateSinglePostByAdmin = async (req, res, next) => {
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

    const deletionResults = updatedUrls ? await deleteUrl(updatedUrls) : [];

    const oldStatus = post.status;
    const newStatus = status;

    if (oldStatus === "approved" && newStatus === "pending") {
      await updateAdminAnalytics(oldStatus, newStatus, "decreaseApprovedCount");
      await updateAdminAnalytics(oldStatus, newStatus, "pending");
    }

    if (oldStatus === "approved" && newStatus === "draft") {
      await updateAdminAnalytics(oldStatus, newStatus, "decreaseApprovedCount");
      await updateAdminAnalytics(oldStatus, newStatus, "decreaseTotalPosts");
    }

    if (oldStatus === "draft" && newStatus === "pending") {
      await updateAdminAnalytics(oldStatus, newStatus, "addposts");
      await updateAdminAnalytics(oldStatus, newStatus, "pending");
    }

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

    const updated = await Post.findByIdAndUpdate(id, updatedPost, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      deletionResults,
      post: updated,
      oldStatus,
      newStatus,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteSinglePostByAdmin = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const { version } = req.query;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return throwError(400, "Invalid Post ID format");
    }

    const post = await Post.findById(postId);

    const oldStatus = post.status;

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

    await updateAdminAnalytics(post.status, "deleted", "previousToNew");

    post.status = "deleted";

    await post.save();

    res
      .status(200)
      .json({ message: "Post status changed to deleted", post, oldStatus });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
