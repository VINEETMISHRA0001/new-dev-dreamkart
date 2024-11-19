const express = require("express");
const {
  registerAdmin,
  verifyAdmin,
  loginAdmin,
  registerSubAdmin,
  getDets,
} = require("./../../controllers/ADMIN/AdminController");
const {
  authenticateAdmin,
} = require("./../../middlewares/Admin/AuthenticateAdmin");

const router = express.Router();

// Register Admin (only one admin can be registered)
router.post("/register", registerAdmin);

// Verify Admin with unique key after registration
router.post("/verify", verifyAdmin);

// Login Admin
router.post("/login", loginAdmin);

router.get("/admin-dets", authenticateAdmin, getDets);

module.exports = router;
