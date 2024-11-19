const Address = require("./../models/AdressSchema");
const AppError = require("./../utils/AppError");
const CatchAsyncError = require("./../utils/CatchAsyncErrorjs");

// Add Address
exports.addAddress = CatchAsyncError(async (req, res, next) => {
  const { addressLine1, addressLine2, city, state, country, postalCode } =
    req.body;

  // Ensure all required fields are provided
  if (!addressLine1 || !city || !state || !country || !postalCode) {
    return next(new AppError("All required fields must be provided.", 400));
  }

  const address = new Address({
    userId: req.user.id,
    addressLine1,
    addressLine2,
    city,
    state,
    country,
    postalCode,
  });

  await address.save();

  res.status(201).json({
    status: "success",
    message: "Address added successfully",
    address,
  });
});

// Edit Address
exports.editAddress = CatchAsyncError(async (req, res, next) => {
  const { addressId } = req.params;
  const { addressLine1, addressLine2, city, state, country, postalCode } =
    req.body;

  // Find the address by ID
  const address = await Address.findOne({
    _id: addressId,
    userId: req.user.id,
  });
  if (!address) {
    return next(new AppError("Address not found.", 404));
  }

  // Update address fields only if they are provided
  address.addressLine1 = addressLine1 || address.addressLine1;
  address.addressLine2 = addressLine2 || address.addressLine2;
  address.city = city || address.city;
  address.state = state || address.state;
  address.country = country || address.country;
  address.postalCode = postalCode || address.postalCode;

  await address.save();

  res.status(200).json({
    status: "success",
    message: "Address updated successfully",
    address,
  });
});

// View Addresses
exports.viewAddresses = CatchAsyncError(async (req, res, next) => {
  const addresses = await Address.find({ userId: req.user.id });

  res.status(200).json({
    status: "success",
    message: "Addresses retrieved successfully",
    addresses,
  });
});

// DELETE ADDRESS ROUTE
// Delete Address
exports.deleteAddress = CatchAsyncError(async (req, res, next) => {
  const { addressId } = req.params;

  // Find the address by ID and delete it
  const address = await Address.findOneAndDelete({
    _id: addressId,
    userId: req.user.id,
  });

  if (!address) {
    return next(new AppError("Address not found.", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Address deleted successfully",
  });
});
