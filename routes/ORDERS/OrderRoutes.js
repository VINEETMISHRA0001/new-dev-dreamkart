const express = require('express'); // Your authentication middleware
const {
  placeOrder,
  getAllOrders,
  getOrderStatus,
  updateOrderStatus,
  getAllOrdersAdmin,
  exportInExcell,
  getRecentOrders,
  markOrdersAsViewed,
  getOrdersByUserId,
  generateDailyReport,
} = require('../../controllers/ORDERS/OrderController');
const authenticateUser = require('../../middlewares/AuthMiddleware');
const {
  authenticateAdmin,
} = require('../../middlewares/Admin/AuthenticateAdmin');
const Order = require('../../models/ORDERS/OrderSchema');

const router = express.Router();

// Define the POST route to place an order
router.get('/generate-daily-report', generateDailyReport);
router.get('/all', getAllOrders);
router.get('/all/admin', authenticateAdmin, getAllOrdersAdmin);
router.get('/all/excell', exportInExcell);
router.get('/:orderId/status', authenticateUser, getOrderStatus);
// 1. Daily Revenue Endpoint
router.get('/revenue-daily', async (req, res) => {
  const { start_date, end_date } = req.query;

  const startDate = start_date
    ? new Date(start_date)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = end_date ? new Date(end_date) : new Date();

  try {
    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: dailyRevenue.map((d) => ({ date: d._id, revenue: d.revenue })),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching daily revenue',
      error: err,
    });
  }
});

// 2. Weekly Revenue Endpoint
router.get('/revenue-weekly', async (req, res) => {
  const { weeks = 4 } = req.query;
  const startDate = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);

  try {
    const weeklyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $isoWeek: '$createdAt' },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: weeklyRevenue.map((w) => ({
        week: `2024-W${w._id}`,
        revenue: w.revenue,
      })),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching weekly revenue',
      error: err,
    });
  }
});

// 3. Order Status Breakdown
router.get('/status-breakdown', async (req, res) => {
  try {
    const statusBreakdown = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const data = statusBreakdown.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching status breakdown',
      error: err,
    });
  }
});

// 4. Top Products Endpoint
router.get('/top-products', async (req, res) => {
  const { metric = 'revenue' } = req.query;

  try {
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId.name',
          revenue: {
            $sum: { $multiply: ['$items.quantity', '$items.productId.price'] },
          },
          quantity: { $sum: '$items.quantity' },
        },
      },
      { $sort: { [metric]: -1 } },
      { $limit: 5 },
    ]);

    res.json({ success: true, data: topProducts });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top products',
      error: err,
    });
  }
});

router.post('/place-order', authenticateUser, placeOrder);
router.patch('/:orderId/update-order', authenticateAdmin, updateOrderStatus);
// Get recent orders for notifications
router.get('/recent', getRecentOrders);
router.get('/:userId', getOrdersByUserId);
// Route to generate and download the daily report in Excel

// Mark orders as viewed
router.post('/mark-viewed', markOrdersAsViewed);

module.exports = router;
