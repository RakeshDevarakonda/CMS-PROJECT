import { UserAnalytics } from "../models/creator-posts-analytics.js";
import { throwError } from "./throw-error.js";

export const updateUserAnalytics = async (
  userId,
  actionType,
  oldPost,
  newPost
) => {
  console.log(userId, actionType, oldPost, newPost);
  try {
    let userAnalytics = await UserAnalytics.findOne({ userId });

    console.log(actionType, oldPost, newPost);

    if (!userAnalytics) {
      userAnalytics = new UserAnalytics({
        userId: userId,
        totalPosts: 0,
        draftCount: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
        deletedCount: 0,
      });

      await userAnalytics.save();
    }

    const statusMap = {
      draft: "draftCount",
      pending: "pendingCount",
      approved: "approvedCount",
      rejected: "rejectedCount",
      deleted: "deletedCount",
    };

    const oldPostStatus = statusMap[oldPost];
    const newPostStatus = statusMap[newPost];

    console.log(newPostStatus);

    switch (actionType) {
      case "create":
        userAnalytics.totalPosts += 1;
        if (newPostStatus === "draftCount") {
          userAnalytics.draftCount += 1;
        } else if (newPostStatus === "pendingCount") {
          userAnalytics.pendingCount += 1;
        }
        break;

      case "prevToNewStatus":
        if (
          oldPostStatus &&
          userAnalytics[oldPostStatus] > 0 &&
          newPostStatus
        ) {
          userAnalytics[oldPostStatus] -= 1;
          userAnalytics[newPostStatus] += 1;
        }
        break;

      case "decreaseApprovedCount":
        if (userAnalytics.approvedCount > 0) {
          userAnalytics.approvedCount -= 1;
        }
        break;

      case "pending":
        if (userAnalytics.pendingCount > 0) {
          userAnalytics.pendingCount -= 1;
        }
        break;

      case "increasePending":
        userAnalytics.pendingCount += 1;
        break;

      case "increaseDraft":
        userAnalytics.draftCount += 1;
        break;

      case "decreaseDraft":
        userAnalytics.draftCount -= 1;
        break;

      case "decreaseTotalPosts":
        if (userAnalytics.totalPosts > 0) {
          userAnalytics.totalPosts -= 1;
        }
        break;

      case "addposts":
        userAnalytics.totalPosts += 1;
        break;

      default:
        throwError(505, "Invalid action type");
    }

    await userAnalytics.save();
  } catch (error) {
    console.log(error);
    throwError(505, "Error updating user analytics: " + error.message);
  }
};
