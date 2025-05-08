import express from "express";
import { verifyjwtToken } from "../../middlewares/verifyjwtToken.js";
import { checkRole } from "../../middlewares/checkRole.js";
import {
  changePostStatus,
  getallmoderatorposts,
  getModeratorProfileDataController,
  getModeratorStatsController,
  updateModeratorProfileDataController,
} from "./../../controllers/moderator/moderator-controller.js";
import { upload } from "../../middlewares/multer.js";
import { isActive } from "../../middlewares/isActive.js";

const moderatoreRouter = express.Router();

moderatoreRouter.get(
  "/getallmoderatorposts",
  verifyjwtToken,
  checkRole("moderator"),
  getallmoderatorposts
);

moderatoreRouter.get(
  "/getmoderatorstats",
  verifyjwtToken,
  checkRole("moderator"),
  getModeratorStatsController
);

moderatoreRouter.get(
  "/getmoderatorprofiledata",
  verifyjwtToken,
  checkRole("moderator"),
  getModeratorProfileDataController
);

moderatoreRouter.put(
  "/changepoststatus",
  verifyjwtToken,
  isActive,
  checkRole("moderator"),
  changePostStatus
);

moderatoreRouter.put(
  "/updatemoderatorprofile",
  upload.array("file"),
  verifyjwtToken,
  checkRole("moderator"),
  updateModeratorProfileDataController
);

export default moderatoreRouter;
