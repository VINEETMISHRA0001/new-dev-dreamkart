const Order = require('../../models/ORDERS/OrderSchema'); // Adjust the path as necessary
const Cart = require('../../models/CART/CartModel'); // Adjust the path as necessary
const Product = require('../../models/PRODUCTS/Products'); // Adjust the path as necessary
const CatchAsyncError = require('./../../utils/CatchAsyncErrorjs'); // Your error handling middleware
const xlsx = require('xlsx');

// exports.placeOrder = CatchAsyncError(async (req, res, next) => {
//   const { shippingAddress, items } = req.body; // Extract data from the request body
//   const userId = req.user.id; // Get user ID from the request

//   // Validate input
//   if (!shippingAddress || !Array.isArray(items) || items.length === 0) {
//     return res.status(400).json({
//       status: 'error',
//       message: 'Shipping address and order items are required',
//     });
//   }

//   // Calculate total amount and validate each product
//   let totalAmount = 0;
//   for (let item of items) {
//     const product = await Product.findById(item.productId);
//     if (!product) {
//       return res.status(404).json({
//         status: 'error',
//         message: `Product with ID ${item.productId} not found`,
//       });
//     }
//     totalAmount += product.price * item.quantity; // Assuming 'price' field exists in the Product model
//   }

//   // Create a new order
//   const newOrder = new Order({
//     userId,
//     items,
//     totalAmount,
//     shippingAddress,
//   });

//   // Save the order to the database
//   await newOrder.save();

//   // Optionally, you may want to clear the cart after placing the order
//   await Cart.deleteOne({ userId }); // Remove cart items (optional)

//   // Return the order details
//   res.status(201).json({
//     status: 'success',
//     message: 'Order placed successfully',
//     order: newOrder,
//   });
// });

// GET ALL ORDERS

// exports.placeOrder = async (req, res, next) => {
//   try {
//     const { firstName, lastName, shippingAddress, postalCode, phone, items } =
//       req.body;
//     const userId = req.user.id;

//     if (
//       !firstName ||
//       !lastName ||
//       !shippingAddress ||
//       !postalCode ||
//       !phone ||
//       !Array.isArray(items) ||
//       items.length === 0
//     ) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'All required fields must be provided',
//       });
//     }

//     let totalAmount = 0;
//     const orderItems = [];

//     for (let item of items) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res
//           .status(404)
//           .json({ status: 'error', message: `Product not found` });
//       }

//       orderItems.push({
//         productId: product._id,
//         quantity: item.quantity,
//         selectedSize: item.selectedSize || null,
//         selectedColor: item.selectedColor || null,
//       });

//       totalAmount += product.price * item.quantity;
//     }

//     // Create order with default status 'Pending' before confirmation
//     let newOrder = await Order.create({
//       userId,
//       firstName,
//       lastName,
//       shippingAddress,
//       postalCode,
//       phone,
//       items: orderItems,
//       totalAmount,
//       status: 'Pending',
//       shippingStatus: 'Confirmed', // Set to Confirmed after order creation
//     });

//     // Update status to 'Confirmed' since order is successfully created
//     newOrder.status = 'Confirmed';
//     await newOrder.save();

//     // Clear cart after placing order
//     await Cart.deleteOne({ userId });

//     res.status(201).json({
//       status: 'success',
//       message: 'Order placed successfully with Confirmed status',
//       order: newOrder,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//   }
// };

const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  // key_id: process.env.RAZORPAY_KEY_ID,
  // key_secret: process.env.RAZORPAY_KEY_SECRET,
  key_id: 'rzp_test_61XMtP9nI2fR87',
  key_secret: 'PZ7e1kGPx8nRZuF8WaiA5Voc',
});

async function createRazorpayOrder(amount, orderId) {
  const options = {
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: `order_rcptid_${orderId}`,
    payment_capture: 1,
  };

  try {
    const response = await razorpayInstance.orders.create(options);
    return response;
  } catch (error) {
    console.error('Razorpay Order Creation Failed:', error);
    throw new Error('Failed to create Razorpay order');
  }
}

// exports.placeOrder = async (req, res, next) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       shippingAddress,
//       postalCode,
//       phone,
//       items,
//       paymentMethod,
//     } = req.body;
//     const userId = req.user.id;

//     if (
//       !firstName ||
//       !lastName ||
//       !shippingAddress ||
//       !postalCode ||
//       !phone ||
//       !Array.isArray(items) ||
//       items.length === 0
//     ) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'All required fields must be provided',
//       });
//     }

//     let totalAmount = 0;
//     const orderItems = [];

//     for (let item of items) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res
//           .status(404)
//           .json({ status: 'error', message: `Product not found` });
//       }

//       orderItems.push({
//         productId: product._id,
//         quantity: item.quantity,
//         selectedSize: item.selectedSize || null,
//         selectedColor: item.selectedColor || null,
//       });

//       totalAmount += product.price * item.quantity;
//     }

//     // Create order with 'Pending' status
//     let newOrder = await Order.create({
//       userId,
//       firstName,
//       lastName,
//       shippingAddress,
//       postalCode,
//       phone,
//       items: orderItems,
//       totalAmount,
//       status: 'Pending',
//       shippingStatus: 'Confirmed',
//     });

//     if (paymentMethod === 'cod') {
//       // COD: Mark order as unpaid, no payment record needed
//       newOrder.status = 'Confirmed';
//       await newOrder.save();
//       return res.status(201).json({
//         status: 'success',
//         message: 'Order placed successfully with COD',
//         order: newOrder,
//       });
//     } else {
//       // Online Payment: Generate Razorpay order ID
//       const razorpayOrder = await createRazorpayOrder(
//         totalAmount,
//         newOrder._id
//       ); // Razorpay API Call

//       return res.status(201).json({
//         status: 'success',
//         message: 'Proceed to online payment',
//         order: newOrder,
//         razorpayOrder, // Send order ID for Razorpay payment processing
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//   }
// };

exports.placeOrder = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      shippingAddress,
      postalCode,
      phone,
      items,
      paymentMethod,
    } = req.body;
    const userId = req.user.id;

    if (
      !firstName ||
      !lastName ||
      !shippingAddress ||
      !postalCode ||
      !phone ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'All required fields must be provided',
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ status: 'error', message: `Product not found` });
      }

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        selectedSize: item.selectedSize || null,
        selectedColor: item.selectedColor || null,
      });

      totalAmount += product.price * item.quantity;
    }

    // Create order with 'Pending' status
    let newOrder = await Order.create({
      userId,
      firstName,
      lastName,
      shippingAddress,
      postalCode,
      phone,
      items: orderItems,
      totalAmount,
      status: 'Pending',
      shippingStatus: 'Confirmed',
    });

    if (paymentMethod === 'cod') {
      // COD: Mark order as unpaid, no payment record needed
      newOrder.status = 'Confirmed';
      await newOrder.save();

      // Clear the user's cart after order placement
      await Cart.deleteOne({ userId });

      return res.status(201).json({
        status: 'success',
        message: 'Order placed successfully with COD',
        order: newOrder,
      });
    } else {
      // Online Payment: Generate Razorpay order ID
      const razorpayOrder = await createRazorpayOrder(
        totalAmount,
        newOrder._id
      ); // Razorpay API Call

      // Clear the user's cart after order placement
      await Cart.deleteOne({ userId });

      return res.status(201).json({
        status: 'success',
        message: 'Proceed to online payment',
        order: newOrder,
        razorpayOrder, // Send order ID for Razorpay payment processing
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

exports.getAllOrders = CatchAsyncError(async (req, res, next) => {
  try {
    // 1️⃣ **Fetch all orders & populate user details**
    const orders = await Order.find().populate('userId', 'name email'); // Only fetch necessary user fields

    // 2️⃣ **Check if orders exist**
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No orders found' });
    }

    // 3️⃣ **Send response**
    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    next(error); // Pass error to global handler
  }
});

// ORDER STATUS
exports.getOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params; // Get order ID from request parameters
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        orderId: order._id,
        status: order.status,
      },
    });
  } catch (error) {
    next(error); // Use your global error handler
  }
};

// Order By Status
exports.getOrdersByStatus = CatchAsyncError(async (req, res, next) => {
  try {
    // Extract shipping status from query parameters
    const { shippingStatus } = req.query;

    // Build query dynamically
    const filter = shippingStatus ? { shippingStatus } : {};

    // Fetch orders based on the filter & populate user details
    const orders = await Order.find(filter).populate('userId', 'name email');

    // If no orders found, return 404
    if (!orders.length) {
      return res
        .status(200)
        .json({ success: true, message: 'No orders found for this status' });
    }

    // Send response with filtered orders
    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    next(error);
  }
});

// UPDATE ORDER STATUS -------ADMIN
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params; // Get order ID from request parameters
    const { status, shippingStatus } = req.body; // Get new status and shippingStatus from request body

    // Define valid statuses
    const validOrderStatuses = [
      'Pending',
      'Confirmed',
      'Unpaid',
      'Paid',
      'Canceled',
      'Hold',
    ];
    const validShippingStatuses = [
      'Confirmed',
      'Shipped',
      'In Transit',
      'Delivered',
    ];

    if (status && !validOrderStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid order status provided',
      });
    }

    if (shippingStatus && !validShippingStatuses.includes(shippingStatus)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid shipping status provided',
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (shippingStatus) updateData.shippingStatus = shippingStatus;

    // Find and update the order
    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true, runValidators: true } // Return updated order and validate fields
    );

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Order status updated successfully',
      data: {
        orderId: order._id,
        status: order.status,
        shippingStatus: order.shippingStatus,
      },
    });
  } catch (error) {
    next(error); // Use your global error handler
  }
};

// controllers/orderController.js
exports.getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('userId');

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
      status: 'success',
      data: {
        orders: flatOrders,
      },
    });
  } catch (error) {
    next(error); // Use your global error handler
  }
};

// export to excell

exports.exportInExcell = async (req, res) => {
  try {
    // Fetch orders from MongoDB
    const orders = await Order.find();

    // Transform data into a format suitable for Excel
    const orderData = orders.map((order) => ({
      OrderID: order._id.toString(),
      UserID: order.userId.toString(),
      TotalAmount: order.totalAmount,
      ShippingAddress: order.shippingAddress,
      Status: order.status,
      CreatedAt: order.createdAt,
    }));

    // Create a new workbook and worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(orderData);

    // Append worksheet to workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Orders');

    // Write the workbook to a buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set headers and send the file
    res.setHeader('Content-Disposition', 'attachment; filename=Orders.xlsx');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.send(buffer);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getRecentOrders = async (req, res, next) => {
  try {
    // Fetch orders created in the last 24 hours or any specific time range
    const recentOrders = await Order.find({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    })
      .populate('userId', 'email') // Fetch user email for the notifications
      .sort({ createdAt: -1 }); // Sort by most recent

    res.status(200).json({
      status: 'success',
      data: {
        recentOrders,
      },
    });
  } catch (error) {
    next(error); // Use global error handler
  }
};

exports.markOrdersAsViewed = async (req, res, next) => {
  try {
    const updatedOrders = await Order.updateMany(
      { 'items.viewed': false }, // Only mark unseen orders
      { $set: { 'items.$[].viewed': true } } // Update all items to viewed
    );

    res.status(200).json({
      status: 'success',
      message: 'Orders marked as viewed',
      data: updatedOrders,
    });
  } catch (error) {
    next(error); // Handle errors
  }
};

// Fetch orders by user ID
// exports.getOrdersByUserId = async (req, res, next) => {
//   try {
//     const userId = req.params.userId; // Get user ID from request parameters

//     // Fetch orders and populate product and user details
//     const orders = await Order.find({ userId })
//       .populate('userId') // Populate user details
//       .populate({
//         path: 'items.productId', // Populate product details
//         select: 'name price images variations manufacturerDetails', // Select fields to include
//       });

//     // if (!orders || orders.length === 0) {
//     //   return res.status().json({
//     //     status: 'error',
//     //     message: 'No orders found for this user',
//     //   });
//     // }

//     res.status(200).json({
//       status: 'success',
//       data: {
//         orders,
//       },
//     });
//   } catch (error) {
//     next(error); // Handle errors using global error handler
//   }
// };

// console.log('sssss', req.user);

exports.getOrdersByUserId = async (req, res, next) => {
  try {
    const userId = req.user.id; // Extract user ID from authenticated request

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized access',
      });
    }

    // Fetch orders for the logged-in user
    const orders = await Order.find({ userId }).populate({
      path: 'items.productId',
      select: 'name price images variations manufacturerDetails',
    });

    res.status(200).json({
      status: 'success',
      data: {
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.generateDailyReport = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const orders = await Order.find({ createdAt: { $gte: startOfDay } })
      .populate('userId', 'email shippingAddress') // Populate user details (email, shipping address)
      .populate('items.productId', 'name price'); // Populate product details (name, price)

    if (!orders.length) {
      return res.status(404).json({
        status: 'error',
        message: 'No orders found for today',
      });
    }

    // Summary data
    const totalOrders = orders.length;
    const totalRevenue = orders
      .reduce((sum, order) => sum + order.totalAmount, 0)
      .toFixed(2);
    const averageOrderValue = (totalRevenue / totalOrders).toFixed(2);

    // Order Status Breakdown
    const orderStatusBreakdown = orders.reduce((statusCount, order) => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
      return statusCount;
    }, {});

    // Product Sales Breakdown
    const productSales = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const { name, price } = item.productId;
        if (productSales[name]) {
          productSales[name].quantity += item.quantity;
          productSales[name].revenue += price * item.quantity;
        } else {
          productSales[name] = {
            quantity: item.quantity,
            revenue: price * item.quantity,
          };
        }
      });
    });

    // Top Products (by revenue)
    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Top 5 products

    // Order details
    const orderDetails = orders
      .map((order) =>
        order.items.map((item) => ({
          OrderID: order._id.toString(),
          UserEmail: order.userId.email,
          ShippingAddress: order.userId.shippingAddress,
          TotalAmount: order.totalAmount,
          Status: order.status,
          CreatedAt: order.createdAt,
          ProductName: item.productId.name,
          Quantity: item.quantity,
          SelectedSize: item.selectedSize,
          SelectedColor: item.selectedColor,
        }))
      )
      .flat();

    // Workbook and Sheets
    const workbook = xlsx.utils.book_new();

    // Summary Sheet
    const summarySheet = xlsx.utils.json_to_sheet([
      {
        TotalOrders: totalOrders,
        TotalRevenue: totalRevenue,
        AverageOrderValue: averageOrderValue,
      },
    ]);
    xlsx.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Order Details Sheet
    const orderDetailsSheet = xlsx.utils.json_to_sheet(orderDetails);
    xlsx.utils.book_append_sheet(workbook, orderDetailsSheet, 'Order Details');

    // Top Products Sheet
    const topProductsSheet = xlsx.utils.json_to_sheet(topProducts);
    xlsx.utils.book_append_sheet(workbook, topProductsSheet, 'Top Products');

    // Order Status Breakdown Sheet
    const orderStatusSheet = xlsx.utils.json_to_sheet(
      Object.entries(orderStatusBreakdown).map(([status, count]) => ({
        Status: status,
        Count: count,
      }))
    );
    xlsx.utils.book_append_sheet(
      workbook,
      orderStatusSheet,
      'Order Status Breakdown'
    );

    // Write Excel to buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Send the Excel file as a response
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=DailyReport.xlsx'
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};
