const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');

const User = require('../models/user');

const ValidationError = require('../errors/validation-error');

const AuthorizationError = require('../errors/authorization-error');

const DbConflictError = require('../errors/db-conflict-error');

const NotFoundError = require('../errors/not-found-error');

const MONGODB_DUPLICATE_ERROR_CODE = 11000;

const createUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
      about,
      avatar,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    user.password = undefined;
    return res.send({ data: user });
  } catch (error) {
    let e = error;
    if (error.code === MONGODB_DUPLICATE_ERROR_CODE) {
      e = new DbConflictError('Почта уже занята');
    } else if (error.name === 'ValidationError') {
      e = new ValidationError('Переданы некорректные данные при создании пользователя');
    }
    return next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthorizationError('Неверный логин и пароль');
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new AuthorizationError('Неверный логин и пароль');
    }
    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' },
    );
    return res.send({ token });
  } catch (error) {
    return next(error);
  }
};

const findUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send({ data: users });
  } catch (error) {
    return next(error);
  }
};

const findById = async (id, res, next) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному id не найден');
    }
    return res.send({ data: user });
  } catch (error) {
    return next(error);
  }
};

const findUserById = (req, res, next) => {
  const { userId } = req.params;
  return findById(userId, res, next);
};

const findUserProfile = (req, res, next) => {
  return findById(req.user._id, res, next);
};

// const findUserById = async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     const user = await User.findById(userId);
//     if (!user) {
//       throw new NotFoundError('Пользователь по указанному id не найден');
//     }
//     return res.send({ data: user });
//   } catch (error) {
//     return next(error);
//   }
// };

// const findUserProfile = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       throw new NotFoundError('Пользователь по указанному id не найден');
//     }
//     return res.send({ data: user });
//   } catch (error) {
//     return next(error);
//   }
// };

const updateUserProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь по указанному id не найден');
    }
    return res.send({ data: user });
  } catch (error) {
    return next(error);
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь по указанному id не найден');
    }
    return res.send({ data: user });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser,
  login,
  findUsers,
  findUserById,
  findUserProfile,
  updateUserProfile,
  updateUserAvatar,
};
