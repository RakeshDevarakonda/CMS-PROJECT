import { UserAnalytics } from "../models/creator-posts-analytics.js";
import { throwError } from "./throw-error.js";

export const updateUserAnalytics = async (
  userId,
  actionType,
  oldPostStatus,
  newPostStatus
) => {
  try {
    let userAnalytics = await UserAnalytics.findOne({ userId });

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

    switch (actionType) {
      case "create":
        userAnalytics.totalPosts += 1;
        if (newPostStatus === "draft") {
          userAnalytics.draftCount += 1;
        } else if (newPostStatus === "pending") {
          userAnalytics.pendingCount += 1;
        }
        break;

      case "prevToNewStatus":
        userAnalytics[oldPostStatus] -= 1;
        userAnalytics[newPostStatus] += 1;

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
