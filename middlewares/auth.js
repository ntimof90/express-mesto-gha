const jwt = require('jsonwebtoken');

const AuthorizationError = require('../errors/authorization-error');

const key = '59b424d00ae462ad5762ace0fe99584c56695ef156beaddd0bdb9ba4b7e480de';

module.exports = (req, res, next) => {
  let payload;
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new AuthorizationError('Неверный логин и пароль');
    }
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, key);
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
