import express from "express";
import {
  createPostController,
  deletePost,
  getAllPostsController,
  getCreatorStatsController,
  getPostByVersions,
  getProfileDataController,
  getSinglePostController,
  updatePostController,
  updateProfileDataController,
} from "../../controllers/creator/creator-controller.js";
import { verifyjwtToken } from "../../middlewares/verifyjwtToken.js";
import { checkRole } from "../../middlewares/checkRole.js";
import { upload } from "../../middlewares/multer.js";
import { isActive } from "../../middlewares/isActive.js";

const createrRouter = express.Router();

createrRouter.get(
  "/getsinglepost/:id/editpost",
  verifyjwtToken,
  checkRole("creator"),
  getSinglePostController
);
createrRouter.get(
  "/getallposts",
  verifyjwtToken,
  checkRole("creator"),
  getAllPostsController
);

createrRouter.get(
  "/getcreatorstats",
  verifyjwtToken,
  checkRole("creator"),
  getCreatorStatsController
);

createrRouter.get(
  "/getallversions",
  verifyjwtToken,
  checkRole("creator"),
  getPostByVersions
);

createrRouter.get(
  "/getprofiledata",
  verifyjwtToken,
  checkRole("creator"),
  getProfileDataController
);

createrRouter.post(
  "/createpost",
  verifyjwtToken,
  isActive,
  upload.array("thumbnailFile"),
  checkRole("creator"),
  createPostController
);

createrRouter.put(
  "/updatecreatorprofile",
  upload.array("file"),
  verifyjwtToken,
  checkRole("creator"),
  updateProfileDataController
);

createrRouter.put(
  "/updatesinglepost",
  verifyjwtToken,
  upload.array("thumbnailFile"),

  isActive,
  checkRole("creator"),
  updatePostController
);

createrRouter.delete(
  "/deletesinglepost/:id",
  verifyjwtToken,
  isActive,
  checkRole("creator"),
  deletePost
);

export default createrRouter;
