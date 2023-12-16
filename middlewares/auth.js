const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');

const AuthorizationError = require('../errors/authorization-error');

module.exports = (req, res, next) => {
  let payload;
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new AuthorizationError('Неверный логин и пароль');
    }
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    let e = error;
    if (error.name === 'JsonWebTokenError') {
      e = new AuthorizationError('Неверный JWT');
    }
    return next(e);
  }
  req.user = payload;

  return next();
};
