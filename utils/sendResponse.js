module.exports = function sendResponse(res, statusCode, statusMessage, body) {
  
    res.status(statusCode).json({
      message: statusMessage,
      ...body
    });

};
