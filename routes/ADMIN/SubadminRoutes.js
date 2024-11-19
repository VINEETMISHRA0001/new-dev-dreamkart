const express = require("express");
const {
  registerSubAdmin,
  loginSubAdmin,
} = require("./../../controllers/ADMIN/SubadminController");
const {
  authenticateAdmin,
} = require("./../../middlewares/Admin/AuthenticateAdmin");

const router = express.Router();

// Register Subadmin (only accessible by the admin)
router.post("/register", authenticateAdmin, registerSubAdmin);
router.post("/login", loginSubAdmin);

module.exports = router;
