import AdminAnalytics from "../models/admin-analytics.js";
import { throwError } from "./throw-error.js";

export const updateAdminAnalytics = async (prev, actionType) => {
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

    switch (actionType) {
      case "creator":
        analytics.creator += 1;
        break;

      case "moderator":
        analytics.moderator += 1;
        break;

      case "addposts":
        analytics.totalPosts += 1;
        break;

      case "deleted":
        if (["approved", "pending"].includes(prev)) {
          if (analytics[prev] > 0) analytics[prev] -= 1;
          analytics.deleted += 1;
        }
        break;

      case "approved":
        if (["rejected", "pending"].includes(prev)) {
          if (analytics[prev] > 0) {
            analytics[prev] -= 1;
            analytics.approved += 1;
          }
        }
        break;

      case "pending":
        analytics.pending += 1;
        break;

      case "rejected":
        if (["pending", "approved"].includes(prev)) {
          if (analytics[prev] > 0) {
            analytics[prev] -= 1;
            analytics.rejected += 1;
          }
        }
        break;

      case "draft":
        break;

      default:
        throwError(400, "Invalid action type");
    }

    await analytics.save();
  } catch (error) {
    console.log(error);
    throwError(500, "Error updating admin analytics: " + error.message);
  }
};
