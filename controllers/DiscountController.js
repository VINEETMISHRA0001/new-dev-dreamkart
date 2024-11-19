const Coupon = require('../models/DiscountModel');
const Product = require('../models/PRODUCTS/ProductsSchema');

// Create a new coupon
exports.createCoupon = async (req, res) => {
  const { code, discount, productId, expirationDate } = req.body;

  try {
    const coupon = new Coupon({
      code,
      discount,
      productId,
      expirationDate,
    });

    await coupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Apply a coupon to a product
exports.applyCoupon = async (req, res) => {
  const { code, productId } = req.body;

  try {
    const coupon = await Coupon.findOne({ code, productId, isActive: true });

    if (!coupon) {
      return res
        .status(404)
        .json({ message: 'Coupon not found or invalid for this product' });
    }

    if (coupon.isExpired()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const discountedPrice =
      product.price - (product.price * coupon.discount) / 100;

    res.json({
      message: 'Coupon applied successfully',
      originalPrice: product.price,
      discountedPrice,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
