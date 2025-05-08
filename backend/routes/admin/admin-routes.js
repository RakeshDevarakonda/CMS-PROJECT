import express from "express";

import { verifyjwtToken } from "../../middlewares/verifyjwtToken.js";
import { checkRole } from "../../middlewares/checkRole.js";
import {
  getAllAdminPosts,
  getAdminProfileData,
  getSinglePostByAdmin,
  getAdminStats,
  getAllVersionsByAdmin,
  createPostByAdmin,
  changePostStatusByAdmin,
  updateAdminProfile,
  updateSinglePostByAdmin,
  deleteSinglePostByAdmin,
  getAllUsers,
  changeUserActive,
} from "../../controllers/admin/admin-controller.js";
import { upload } from "../../middlewares/multer.js";
import { isActive } from "../../middlewares/isActive.js";

const adminRouter = express.Router();

adminRouter.get(
  "/getallposts",
  verifyjwtToken,
  checkRole("admin"),
  getAllAdminPosts
);

adminRouter.get(
  "/getallusers",
  verifyjwtToken,
  checkRole("admin"),
  getAllUsers
);

adminRouter.get(
  "/getmoderatorprofiledata",
  verifyjwtToken,
  checkRole("admin"),
  getAdminProfileData
);

adminRouter.get(
  "/getsinglepost/:id/editpost",
  verifyjwtToken,
  checkRole("admin"),
  getSinglePostByAdmin
);

adminRouter.get("/stats", verifyjwtToken, checkRole("admin"), getAdminStats);

adminRouter.get(
  "/getadminversions",
  verifyjwtToken,
  checkRole("admin"),
  getAllVersionsByAdmin
);

adminRouter.post(
  "/createpost",
  verifyjwtToken,
  isActive,
  upload.array("thumbnailFile"),
  checkRole("admin"),
  createPostByAdmin
);

adminRouter.put(
  "/changepoststatus",
  verifyjwtToken,
  isActive,
  checkRole("admin"),
  changePostStatusByAdmin
);

adminRouter.put(
  "/updateusersaccount",
  verifyjwtToken,
  isActive,
  checkRole("admin"),
  changeUserActive
);

adminRouter.put(
  "/updateadminprofile",
  upload.array("file"),
  verifyjwtToken,
  checkRole("admin"),
  updateAdminProfile
);

adminRouter.put(
  "/updatesinglepost",
  upload.array("thumbnailFile"),

  verifyjwtToken,
  isActive,
  checkRole("admin"),
  updateSinglePostByAdmin
);

adminRouter.delete(
  "/deletesinglepost/:id",
  verifyjwtToken,
  isActive,
  checkRole("admin"),
  deleteSinglePostByAdmin
);

export default adminRouter;
