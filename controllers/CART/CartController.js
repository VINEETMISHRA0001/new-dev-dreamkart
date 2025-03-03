const Cart = require('../../models/CART/CartModel');
const Products = require('../../models/PRODUCTS/Products');

const CatchAsyncError = require('./../../utils/CatchAsyncErrorjs');

// get all cart items

// exports.getAllCartItems = CatchAsyncError(async (req, res, next) => {
//   const userId = req.user.id; // Get user ID from the request

//   // Find the user's cart and populate product details
//   const cart = await Cart.findOne({ userId }).populate({
//     path: 'items.productId',
//     select: 'name price images variations', // Include necessary product fields
//   });

//   if (!cart || cart.items.length === 0) {
//     return res.status(404).json({
//       status: 'error',
//       message: 'Your cart is empty',
//       cartItems: [],
//     });
//   }

//   // Prepare cart items with product details
//   const cartItems = cart.items.map((item) => {
//     const product = item.productId;

//     // Find the selected variation based on color
//     const selectedVariation = product.variations.find(
//       (variation) => variation.color === item.color
//     );

//     // Get the selected size details
//     const selectedSizeDetails = selectedVariation?.sizes.find(
//       (size) => size.size === item.size
//     );

//     return {
//       productId: product._id,
//       name: product.name,
//       price: selectedSizeDetails?.price || product.price, // Use selected size price if available
//       images: selectedVariation?.colorImages || product.images, // Use variation-specific images if available
//       selectedColor: selectedVariation?.color || item.color,
//       selectedSize: selectedSizeDetails?.size || item.size,
//       quantity: item.quantity, // Use directly from cart item
//     };
//   });

//   res.status(200).json({
//     status: 'success',
//     message: 'Cart items retrieved successfully',
//     cartItems,
//   });
// });

exports.getAllCartItems = CatchAsyncError(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate(
    'items.productId'
  );

  if (!cart || cart.items.length === 0) {
    return res
      .status(200)
      .json({ status: 'success', message: 'Cart is empty', cartItems: [] });
  }

  const formattedItems = cart.items.map((item) => ({
    _id: item._id, // 🟢 Include this _id for removing a specific item
    productId: item.productId._id,
    name: item.productId.name,
    price: item.productId.price,
    images: item.productId.images,
    selectedColor: item.color,
    selectedSize: item.size,
    quantity: item.quantity,
    totalPrice: item.productId.price * item.quantity,
  }));

  res.status(200).json({
    status: 'success',
    message: 'Cart items retrieved successfully',
    cartId: cart._id,
    cartItems: formattedItems, // ✅ Now each item has `_id`
    totalCartValue: formattedItems.reduce(
      (total, item) => total + item.totalPrice,
      0
    ),
  });
});

exports.addToCart = CatchAsyncError(async (req, res, next) => {
  try {
    console.log('🔹 Request Body:', req.body);
    const { productId, quantity, selectedSize, selectedColor } = req.body;
    const userId = req.user?.id;

    if (!productId || !quantity || quantity < 1) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Invalid product or quantity' });
    }

    const product = await Products.findById(productId);
    console.log('🔹 Fetched Product:', product);

    if (!product) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Product not found' });
    }

    const selectedVariation = product.variations.find(
      (v) => v.color === selectedColor
    );
    console.log('🔹 Selected Variation:', selectedVariation);

    if (!selectedVariation) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Selected color is not available' });
    }

    const selectedSizeDetails = selectedVariation.sizes.find(
      (size) => size.size === selectedSize
    );
    console.log('🔹 Selected Size Details:', selectedSizeDetails);

    if (!selectedSizeDetails) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Selected size is not available' });
    }

    let cart = await Cart.findOne({ userId });
    console.log('🔹 User Cart:', cart);

    if (!cart) cart = new Cart({ userId, items: [] });

    const existingCartItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.color === selectedColor &&
        item.size === selectedSize
    );

    if (existingCartItem) {
      return res.status(409).json({
        status: 'error',
        message: 'This item already exists in the cart',
      });
    }

    cart.items.push({
      userId,
      productId,
      color: selectedColor,
      size: selectedSize,
      quantity,
    });

    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Product added to cart',
      cart: cart.items,
    });
  } catch (error) {
    console.error('❌ Internal Server Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

// DELETE PRODUCT FROM CART
// exports.deleteProductFromCart = CatchAsyncError(async (req, res, next) => {
//   const { cartItemId } = req.params; // Get the cart item ID from the URL parameters
//   const userId = req.user.id; // Get user ID from the request

//   // Validate input
//   if (!cartItemId) {
//     return res.status(400).json({
//       status: 'error',
//       message: 'Cart item ID is required',
//     });
//   }

//   // Find the user's cart and update it by removing the specific item
//   const cart = await Cart.findOneAndUpdate(
//     { userId },
//     { $pull: { items: { _id: cartItemId } } }, // Removes the item with matching _id
//     { new: true } // Returns updated cart
//   );

//   if (!cart) {
//     return res.status(404).json({
//       status: 'error',
//       message: 'Cart not found or item does not exist',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     message: 'Product removed from cart',
//     cartItems: cart.items, // Optionally return the updated cart items
//   });
// });

exports.deleteProductFromCart = CatchAsyncError(async (req, res, next) => {
  const { cartId, itemId } = req.body; // Get cartId and itemId from request body

  if (!cartId || !itemId) {
    return res.status(400).json({
      status: 'error',
      message: 'Cart ID and Item ID are required',
    });
  }

  // Find the cart
  const cart = await Cart.findById(cartId);

  if (!cart) {
    return res.status(404).json({
      status: 'error',
      message: 'Cart not found',
    });
  }

  // Filter out the item that needs to be removed
  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

  // If no items left, delete the cart
  if (cart.items.length === 0) {
    await Cart.findByIdAndDelete(cartId);
    return res.status(200).json({
      status: 'success',
      message: 'Cart is now empty and deleted',
    });
  }

  // Save the updated cart
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Item removed from cart',
    cart,
  });
});

/// cart total

exports.calculateCartTotal = CatchAsyncError(async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized, user ID is missing',
    });
  }

  const userId = req.user.id; // Get user ID from the request

  // Find the user's cart and populate product details
  const cart = await Cart.findOne({ userId }).populate({
    path: 'items.productId',
    select: 'price',
  });

  if (!cart || cart.items.length === 0) {
    return res.status(404).json({
      status: 'error',
      message: 'Cart is empty',
      totalPrice: 0,
    });
  }

  // Calculate total price
  const totalPrice = cart.items.reduce((acc, item) => {
    const product = item.productId;
    const price = product?.price || 0; // Ensure price exists
    const quantity = item.variations?.quantity || 1; // Default to 1 if not specified
    return acc + price * quantity;
  }, 0);

  res.status(200).json({
    status: 'success',
    message: 'Total price calculated successfully',
    totalPrice: totalPrice.toFixed(2), // Format to 2 decimal places
  });
});
