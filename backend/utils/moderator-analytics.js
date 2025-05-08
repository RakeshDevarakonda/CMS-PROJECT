import ModeratortAnalytics from "../models/moderator-analytics.js";
import { throwError } from "./throw-error.js";

export const updateModeratorAnalytics = async (
  userId,
  prevStatus,
  newStatus,
  actionType,
  isAlreadyUpdated
) => {
  try {
    let analytics = await ModeratortAnalytics.findOne({ userId });

    if (!analytics) {
      analytics = new ModeratortAnalytics({
        userId,
        totalPosts: 0,
        rejectedCount: 0,
        adminrechangedCount: 0,
        approvedCount: 0,
      });
    }

    switch (actionType) {
      case "update":
        if (isAlreadyUpdated) {
          if (newStatus === "approved") {
            analytics.approvedCount += 1;
            analytics.rejectedCount -= 1;

          } else if (newStatus === "rejected") {
            analytics.rejectedCount += 1;
            analytics.approvedCount -= 1;

          }
        } else {
          if (newStatus === "approved") {
            analytics.approvedCount += 1;
          } else if (newStatus === "rejected") {
            analytics.rejectedCount += 1;
          }
          analytics.totalPosts += 1;
        }

        break;

      case "adminreupdate":
        if (prevStatus === "approved" && newStatus === "rejected") {
          analytics.approvedCount -= 1;
          analytics.rejectedCount += 1;
          analytics.adminrechangedCount += 1;
        } else if (prevStatus === "rejected" && newStatus === "approved") {
          analytics.rejectedCount -= 1;
          analytics.approvedCount += 1;
          analytics.adminrechangedCount += 1;
        }
        break;

      default:
        throwError(400, "Invalid action type");
    }

    await analytics.save();
  } catch (error) {
    throwError(500, "Error updating moderator analytics: " + error.message);
  }
};
