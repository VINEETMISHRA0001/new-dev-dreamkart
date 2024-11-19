const express = require("express"); // Your authentication middleware
const {
  placeOrder,
  getAllOrders,
  getOrderStatus,
  updateOrderStatus,
  getAllOrdersAdmin,
} = require("../../controllers/ORDERS/OrderController");
const authenticateUser = require("../../middlewares/AuthMiddleware");
const {
  authenticateAdmin,
} = require("../../middlewares/Admin/AuthenticateAdmin");

const router = express.Router();

// Define the POST route to place an order
router.get("/all", authenticateUser, getAllOrders);
router.get("/all/admin", authenticateAdmin, getAllOrdersAdmin);
router.get("/:orderId/status", authenticateUser, getOrderStatus);
router.post("/place-order", authenticateUser, placeOrder);
router.patch("/:orderId/update-order", authenticateAdmin, updateOrderStatus);

module.exports = router;
