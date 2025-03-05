const express = require('express');
const {
  subscribe,
  getAllSubscribers,
  unsubscribe,
} = require('../controllers/newsletter');
const authenticateUser = require('../middlewares/AuthMiddleware');
const { authenticateAdmin } = require('../middlewares/Admin/AuthenticateAdmin');

const router = express.Router();

router.post('/subscribe', authenticateUser, subscribe);
router.get('/subscribers', authenticateAdmin, getAllSubscribers);
// router.delete('/unsubscribe', authenticateAdmin, unsubscribe);
router.delete('/unsubscribe/:newsletterId', authenticateAdmin, unsubscribe);

module.exports = router;
