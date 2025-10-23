module.exports = function sendResponse(res, statusCode, statusMessage, data) {
  res.status(statusCode).json({
    status: statusCode,
    message: statusMessage,
    data
  });
};
