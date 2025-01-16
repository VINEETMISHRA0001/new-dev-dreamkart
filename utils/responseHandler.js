const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({ success: true, message, data });
};

const handleError = (res, error) => {
  res.status(500).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
};

module.exports = { handleResponse, handleError };
