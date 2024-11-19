const mongoose = require("mongoose");

const recentlyViewedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const RecentlyViewed = mongoose.model("RecentlyViewed", recentlyViewedSchema);

module.exports = RecentlyViewed;
