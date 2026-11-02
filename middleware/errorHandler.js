function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  console.error(error);

  const requestedStatus = Number(error.statusCode || error.status);
  const statusCode = Number.isInteger(requestedStatus) && requestedStatus >= 400 && requestedStatus < 600
    ? requestedStatus
    : 500;

  res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
}

export default errorHandler;
