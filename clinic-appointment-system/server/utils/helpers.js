const jwt = require('jsonwebtoken');

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value || '');

const isValidTime = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value || '');

const isValidDateString = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) {
    return false;
  }
  return !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime());
};

const toDateOnly = (value) => new Date(`${value}T00:00:00.000Z`);

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = {
  HttpError,
  asyncHandler,
  signToken,
  isEmail,
  isValidTime,
  isValidDateString,
  toDateOnly,
  escapeRegex,
};
