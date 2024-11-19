const express = require("express");
const router = express.Router();
const {
  createProfile,
  updateProfile,
  getProfileDetails,
} = require("./../controllers/ProfileController");
const authenticateUser = require("../middlewares/AuthMiddleware");

router.get("/profile", authenticateUser, getProfileDetails);
router.post("/profile", authenticateUser, createProfile);
router.patch("/profile/update", authenticateUser, updateProfile);

module.exports = router;
