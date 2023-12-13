const jwt = require('jsonwebtoken');

const AuthorizationError = require('../errors/authorization-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  let payload;
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new AuthorizationError('Неверный логин и пароль');
    }
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
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
