const Cart = require("../../models/CART/CartModel");
const Product = require("./../../models/PRODUCTS/ProductsSchema");
const CatchAsyncError = require("./../../utils/CatchAsyncErrorjs");

// get all cart items

exports.getAllCartItems = CatchAsyncError(async (req, res, next) => {
  const userId = req.user.id; // Get user ID from the request

  // Find the user's cart and populate the product details
  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId", // Assuming productId is a reference in the Cart model
    select: "name price image", // Select the fields you want to return
  });

  if (!cart) {
    return res.status(404).json({
      status: "error",
      message: "Cart not found",
    });
  }

  // Prepare cart items to include product details

  res.status(200).json({
    status: "success",
    message: "Cart items retrieved successfully",
    cartItems: cart.items, // Return cart items with product details
  });
});

exports.addToCart = CatchAsyncError(async (req, res, next) => {
  const { productId, quantity, selectedSize, selectedColor } = req.body;
  const userId = req.user.id; // Assuming you get user ID from the request

  // Validate input
  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({
      status: "error",
      message: "Invalid product or quantity",
    });
  }

  // Fetch the product from the database
  const product = await Product.findById(productId);

  // Check if product exists
  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  // Prepare product details to be saved in the cart
  const productDetails = {
    name: product.name,
    category: product.category,
    price: product.price, // Ensure price is included
    image: product.image, // Ensure image is included
    variations: {
      productId: productId,
      size: selectedSize || null,
      color: selectedColor || null,
      quantity,
    },
  };

  // Find the user's cart
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    // If cart doesn't exist, create a new one
    cart = new Cart({ userId, items: [] });
  }

  // Check if the product already exists in the cart
  const existingCartItemIndex = cart.items.findIndex((item) => {
    const variations = item.variations || {};
    return item.productId === productId;
  });

  if (existingCartItemIndex >= 0) {
    // Item already exists in cart
    return res.status(409).json({
      status: "error",
      message: "This item already exists in the cart",
    });
  } else {
    // Add new item to the cart
    cart.items.push({
      userId,
      productId,
      productDetails, // Include all product details including price and image
    });
  }

  // Save the cart
  await cart.save();
  console.log(cart.items); // Debug: Log cart items after saving

  res.status(200).json({
    status: "success",
    message: "Product added to cart",
    cart: cart.items, // Cart items now include price and image
  });
});

// DELETE PRODUCT FROM CART
exports.deleteProductFromCart = CatchAsyncError(async (req, res, next) => {
  const { cartItemId } = req.params; // Get the cart item ID from the URL parameters
  const userId = req.user.id; // Get user ID from the request

  // Validate input
  if (!cartItemId) {
    return res.status(400).json({
      status: "error",
      message: "Cart item ID is required",
    });
  }

  // Find the user's cart
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(404).json({
      status: "error",
      message: "Cart not found",
    });
  }

  // Find the index of the product to be removed by cart item ID
  const productIndex = cart.items.findIndex(
    (item) => item._id.toString() === cartItemId
  );

  if (productIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: "Product not found in cart",
    });
  }

  // Remove the product from the cart
  cart.items.splice(productIndex, 1);

  // Save the updated cart
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product removed from cart",
    cart: cart.items, // Optionally return the updated cart items
  });
});

/// cart total

exports.calculateCartTotal = CatchAsyncError(async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized, user ID is missing",
    });
  }

  const userId = req.user.id; // Get user ID from the request

  // Find the user's cart
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(404).json({
      status: "error",
      message: "Cart not found",
    });
  }

  let totalPrice = 0; // Initialize total price

  // Iterate through cart items to calculate total price
  for (const item of cart.items) {
    // Fetch the product details
    const product = await Product.findById(item.productId).select("price");

    if (product && item.variations) {
      const price = Number(product.price); // Ensure price is a number
      const quantity = Number(item.quantity); // Ensure quantity is a number

      // Check if both values are valid numbers
      if (!isNaN(price) && !isNaN(quantity)) {
        totalPrice += price * quantity; // Perform multiplication
      } else {
        console.log("Invalid price or quantity:", price, quantity);
      }
    }
  }

  res.status(200).json({
    status: "success",
    message: "Total price calculated successfully",
    totalPrice: totalPrice.toFixed(2), // Format to 2 decimal places
  });
});
