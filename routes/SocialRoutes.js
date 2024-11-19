// routes/socialLinksRoutes.js
const express = require('express');
const router = express.Router();
const socialLinksController = require('../controllers/SocialsLinks');
const { authenticateAdmin } = require('../middlewares/Admin/AuthenticateAdmin');

// Only admins can create or delete social links
router.post(
  '/social-links',
  authenticateAdmin,
  socialLinksController.createSocialLink
);
router.delete(
  '/social-links/:id',
  authenticateAdmin,
  socialLinksController.deleteSocialLink
);

// Users and admins can view and update social links
router.get(
  '/social-links',
  authenticateAdmin,
  socialLinksController.getSocialLinks
);
router.get(
  '/social-links/:id',
  authenticateAdmin,
  socialLinksController.getSocialLinkById
);
router.put(
  '/social-links/:id',
  authenticateAdmin,
  socialLinksController.updateSocialLink
);

module.exports = router;
