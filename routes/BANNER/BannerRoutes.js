const express = require('express');
const router = express.Router();
const {
  createBanner,
  getAllBanner,
} = require('../../controllers/BANNERS/BannerController');
const {
  authenticateAdmin,
} = require('../../middlewares/Admin/AuthenticateAdmin');
const upload = require('../../middlewares/MULTER/Image');

//router.post("/new", authenticateAdmin, upload.single("image"), createBanner);
router.get('/all', getAllBanner);

module.exports = router;
