const express = require("express");
const CatchAsyncErrorjs = require("../../utils/CatchAsyncErrorjs");
const RecentlyViewed = require("../../models/RECENTLY VIEWED/RecentlyViewed");

exports.AddToRecentlyViewed = CatchAsyncErrorjs(async (req, res, next) => {
  const { userId, productId } = req.body;

  let recentlyViewed = await RecentlyViewed.findOne({ userId });

  if (!recentlyViewed) {
    recentlyViewed = new RecentlyViewed({ userId, products: [] });
  }

  // Add the productId if it's not already in the list (up to 10 recent views)
  if (!recentlyViewed.products.includes(productId)) {
    recentlyViewed.products.unshift(productId);
    if (recentlyViewed.products.length > 10) {
      recentlyViewed.products.pop(); // Keep only the last 10 viewed
    }
  }

  await recentlyViewed.save();

  res.status(200).json({
    status: "success",
    data: recentlyViewed,
  });
});

/////////////////////////////////////////////////////////////////////////////

exports.getRecentlyViewed = CatchAsyncErrorjs(async (req, res, next) => {
  const { userId } = req.params;

  const recentlyViewed = await RecentlyViewed.findOne({ userId })
    .populate("products") // Populate the product details
    .exec();

  if (!recentlyViewed) {
    return res.status(404).json({
      status: "error",
      message: "No recently viewed products found.",
    });
  }

  res.status(200).json({
    status: "success",
    data: recentlyViewed.products,
  });
});
