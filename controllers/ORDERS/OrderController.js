const Order = require("../../models/ORDERS/OrderSchema"); // Adjust the path as necessary
const Cart = require("../../models/CART/CartModel"); // Adjust the path as necessary
const Product = require("../../models/PRODUCTS/ProductsSchema"); // Adjust the path as necessary
const CatchAsyncError = require("./../../utils/CatchAsyncErrorjs"); // Your error handling middleware

exports.placeOrder = CatchAsyncError(async (req, res, next) => {
  const { shippingAddress, items } = req.body; // Extract data from the request body
  const userId = req.user.id; // Get user ID from the request

  // Validate input
  if (!shippingAddress || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Shipping address and order items are required",
    });
  }

  // Calculate total amount and validate each product
  let totalAmount = 0;
  for (let item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: `Product with ID ${item.productId} not found`,
      });
    }
    totalAmount += product.price * item.quantity; // Assuming 'price' field exists in the Product model
  }

  // Create a new order
  const newOrder = new Order({
    userId,
    items,
    totalAmount,
    shippingAddress,
  });

  // Save the order to the database
  await newOrder.save();

  // Optionally, you may want to clear the cart after placing the order
  await Cart.deleteOne({ userId }); // Remove cart items (optional)

  // Return the order details
  res.status(201).json({
    status: "success",
    message: "Order placed successfully",
    order: newOrder,
  });
});

// GET ALL ORDERS

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("userId");
    res.status(200).json({
      status: "success",
      data: {
        orders,
      },
    });
  } catch (error) {
    next(error); // Use your global error handler
  }
};

// ORDER STATUS
exports.getOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params; // Get order ID from request parameters
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        orderId: order._id,
        status: order.status,
      },
    });
  } catch (error) {
    next(error); // Use your global error handler
  }
};

// UPDATE ORDER STATUS -------ADMIN
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params; // Get order ID from request parameters
    const { status } = req.body; // Get new status from request body

    // Validate status (optional: you can set valid statuses)
    const validStatuses = ["Pending", "Shipped", "Delivered", "Canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid status provided",
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        orderId: order._id,
        status: order.status,
      },
    });
  } catch (error) {
    next(error); // Use your global error handler
  }
};

// controllers/orderController.js
exports.getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("userId");

    // Transform the orders into a flattened structure
    const flattenedOrders = orders.map((order) => {
      return order.items.map((item) => ({
        orderId: order._id,
        userId: order.userId._id,
        email: order.userId.email,
        shippingAddress: order.shippingAddress,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        productId: item.productId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      }));
    });

    // Flatten the array of arrays into a single array
    const flatOrders = flattenedOrders.flat();

    res.status(200).json({
      status: "success",
      data: {
        orders: flatOrders,
      },
    });
  } catch (error) {
    next(error); // Use your global error handler
  }
};
