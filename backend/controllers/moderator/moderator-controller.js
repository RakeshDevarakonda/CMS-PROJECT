import { Post } from "../../models/post-model.js";
import { updateUserAnalytics } from "../../utils/user-post-update-analytics.js";
import { throwError } from "./../../utils/throw-error.js";
import { PostHistory } from "./../../models/post-version-history.js";
import User from "../../models/user-model.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { deleteUrl } from "../../utils/DeleteUrls.js";
import { updateModeratorAnalytics } from "../../utils/moderator-analytics.js";
import ModeratortAnalytics from "../../models/moderator-analytics.js";
import { updateAdminAnalytics } from "../../utils/admin-analytics.js";

export const getModeratorStatsController = async (req, res, next) => {
  try {
    const userId = req.id;

    let analytics = await ModeratortAnalytics.findOne({ userId });
    let pendingPosts = await Post.countDocuments({ status: "pending" });

    if (!analytics) {
      analytics = new ModeratortAnalytics({
        userId,
        totalPosts: 0,
        rejectedCount: 0,
        adminrechangedCount: 0,
        approvedCount: 0,
      });
      await analytics.save();
    }

    const statusSummary = {
      total: analytics.totalPosts,
      rejected: analytics.rejectedCount,
      adminrechanged: analytics.adminrechangedCount,
      approved: analytics.approvedCount,
      pending: pendingPosts,
    };

    // Last 5 days stats for moderator
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 4);

    const moderatorStatusStats = await Post.aggregate([
      {
        $match: {
          "moderatedBy.user": req.id,
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

    const statuses = ["approved", "rejected"];
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

    moderatorStatusStats.forEach(({ _id, count }) => {
      const { date, status } = _id;
      if (lastFiveDaysStats[date]) {
        lastFiveDaysStats[date][status] = count;
      }
    });

    res.status(200).json({
      dataCount: statusSummary,
      lastFiveDaysStats,
    });
  } catch (error) {
    console.log(error);
    console.error("Error fetching creator stats:", error);
    next(error);
  }
};

export const getallmoderatorposts = async (req, res, next) => {
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
    const statusFilter = contentStatusFilter?.toLowerCase();

    let postQuery = { status: { $nin: ["draft", "deleted"] } };
    let postHistoryQuery = {
      status: { $nin: ["draft", "pending", "deleted"] },
    };

    if (statusFilter === "pending") {
      postQuery.status = statusFilter;
    }

    if (["approved", "rejected"].includes(statusFilter)) {
      postQuery.status = statusFilter;
      postQuery.moderatedBy = { $elemMatch: { user: req.id } };

      postHistoryQuery.status = statusFilter;
      postHistoryQuery.moderatedBy = { $elemMatch: { user: req.id } };
    }

    if (finalStartDate && finalEndDate) {
      const startDate = new Date(finalStartDate + "T00:00:00+05:30");
      const endDate = new Date(finalEndDate + "T23:59:59+05:30");

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throwError(400, "Invalid date format. Use YYYY-MM-DD.");
      }

      if (startDate > endDate) {
        throwError(400, "Start date cannot be later than end date.");
      }

      postQuery.updatedAt = { $gte: startDate, $lte: endDate };
      postHistoryQuery.updatedAt = { $gte: startDate, $lte: endDate };
    }

    const postsFromMain = await Post.find(postQuery)
      .sort({ version: -1 })
      .populate("userId", "name role")
      .populate("moderatedBy.user", "name role");

    const postsFromHistory = await PostHistory.find(postHistoryQuery)
      .sort({ version: -1 })
      .populate("userId", "name role")
      .populate("moderatedBy.user", "name role");

    let posts = [...postsFromMain, ...postsFromHistory];

    if (finalSearchterm) {
      const searchTerm = finalSearchterm.trim().toLowerCase();
      posts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm)
      );
    }

    posts = posts.sort((a, b) => {
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    const paginatedPosts = posts.slice(skip, skip + limit);

    const totalCount = posts.length;

    const statusSummary = {
      totalCount,
    };

    res.status(200).json({
      totalPages: Math.ceil(posts.length / limit),
      posts: paginatedPosts,
      statusSummary,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const changePostStatus = async (req, res, next) => {
  try {
    const { postId, status, source, reason, version } = req.body;

    if (!postId || !status || !source) {
      throwError(400, "Post ID, Status, and Source are required.");
    }

    if (source === "posthistory") {
      throwError(400, "Cannot change the status of older versions of posts.");
    }

    const post = await Post.findById(postId);
    if (!post) {
      throwError(404, "Post not found.");
    }

    if (post.status === "deleted") {
      throwError(400, "Post is already deleted by user.");
    }

    if (post.moderatedBy.some((mod) => mod.role === "admin")) {
      throwError(
        400,
        "This post has already been moderated by an admin and cannot be updated further."
      );
    }

    if (
      post.moderatedBy.some(
        (mod) => mod.user.toString() !== req.id.toString()
      ) &&
      post.status !== "pending"
    ) {
      throwError(
        400,
        "Another moderator has already changed the status. You cannot modify it."
      );
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

    await updateUserAnalytics(post.userId, "update", post.status, status);

    if (
      post.moderatedBy.some((mod) => mod.user.toString() === req.id.toString())
    ) {
      await updateModeratorAnalytics(
        req.id,
        post.status,
        status,
        "update",
        true
      );
    } else {
      await updateModeratorAnalytics(
        req.id,
        post.status,
        status,
        "update",
        false
      );
    }

    await updateAdminAnalytics(post.status, status);

    const existingModIndex = post.moderatedBy.findIndex(
      (mod) =>
        mod.user.toString() === req.id.toString() && mod.role === "moderator"
    );

    if (existingModIndex !== -1) {
      post.moderatedBy[existingModIndex].updatedAt = new Date();
      post.moderatedBy[existingModIndex].action = status;
      post.moderatedBy[existingModIndex].role = "moderator";
      post.moderatedBy[existingModIndex].reason = reason || null;
    } else {
      post.moderatedBy.push({
        user: req.id,
        updatedAt: new Date(),
        action: status,
        role: "moderator",
        reason: reason || null,
      });
    }

    post.status = status;
    post.reason = reason && reason.trim().length > 0 ? reason : null;

    await post.save();

    await post.populate("moderatedBy.user", "name email role");

    res.status(200).json({
      message: "Post status updated successfully.",
      post,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getModeratorProfileDataController = async (req, res, next) => {
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

export const updateModeratorProfileDataController = async (req, res, next) => {
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
    console.log(error);
    next(error);
  }
};
