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

    switch (actionType) {
      case "create":
        userAnalytics.totalPosts += 1;
        if (newPostStatus === "draft") {
          userAnalytics.draftCount += 1;
        } else if (newPostStatus === "pending") {
          userAnalytics.pendingCount += 1;
        }
        break;

      case "update":
        if (oldPostStatus !== newPostStatus) {
          if (oldPostStatus === "approved") {
            userAnalytics.approvedCount -= 1;
          } else if (oldPostStatus === "draft") {
            userAnalytics.draftCount -= 1;
          } else if (oldPostStatus === "pending") {
            userAnalytics.pendingCount -= 1;
          } else if (oldPostStatus === "rejected") {
            userAnalytics.rejectedCount -= 1;
          }

          if (newPostStatus === "approved") {
            userAnalytics.approvedCount += 1;
          } else if (newPostStatus === "draft") {
            userAnalytics.draftCount += 1;
          } else if (newPostStatus === "pending") {
            userAnalytics.pendingCount += 1;
          } else if (newPostStatus === "rejected") {
            userAnalytics.rejectedCount += 1;
          }
        }
        break;

      case "delete":
        if (oldPostStatus === "approved") {
          userAnalytics.approvedCount -= 1;
        } else if (oldPostStatus === "draft") {
          userAnalytics.draftCount -= 1;
        } else if (oldPostStatus === "pending") {
          userAnalytics.pendingCount -= 1;
        } else if (oldPostStatus === "rejected") {
          userAnalytics.rejectedCount -= 1;
        }

        userAnalytics.deletedCount += 1;
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
