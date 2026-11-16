const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong.';

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Session expired or invalid. Please log in again.';
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format.';
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  } else if (err.code === 11000) {
    status = 409;
    message = 'An account with this email already exists.';
  }

  if (status === 500) {
    console.error(err);
  }
  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
