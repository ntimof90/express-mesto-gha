const User = require('../models/user');

const ERROR_VALIDATION = 400;

const ERROR_NOT_FOUND = 404;

const ERROR_DEFAULT = 500;

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.send({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(ERROR_VALIDATION).send({ message: [ERROR_VALIDATION, 'Переданы некорректные данные при создании пользователя'].join(' - ') });
    }
    return res.status(ERROR_DEFAULT).send({ message: [ERROR_DEFAULT, 'На сервере произошла ошибка'].join(' - ') });
  }
};

const findUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send({ data: users });
  } catch (error) {
    return res.status(ERROR_DEFAULT).send({ message: [ERROR_DEFAULT, 'На сервере произошла ошибка'].join(' - ') });
  }
};

const findUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('NotFound');
    }
    return res.send({ data: user });
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(ERROR_NOT_FOUND).send({ message: [ERROR_NOT_FOUND, 'Пользователь по указанному id не найден'].join(' - ') });
    }
    if (error.name === 'CastError') {
      return res.status(ERROR_VALIDATION).send({ message: [ERROR_VALIDATION, 'Переданы некорректные данные id'].join(' - ') });
    }
    return res.status(ERROR_DEFAULT).send({ message: [ERROR_DEFAULT, 'На сервере произошла ошибка'].join(' - ') });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new Error('NotFound');
    }
    return res.send({ data: user });
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(ERROR_NOT_FOUND).send({ message: [ERROR_NOT_FOUND, 'Пользователь по указанному _id не найден'].join(' - ') });
    }
    if (error.name === 'ValidationError') {
      return res.status(ERROR_VALIDATION).send({ message: [ERROR_VALIDATION, 'Переданы некорректные данные при обновлении профиля'].join(' - ') });
    }
    return res.status(ERROR_DEFAULT).send({ message: [ERROR_DEFAULT, 'На сервере произошла ошибка'].join(' - ') });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new Error('NotFound');
    }
    return res.send({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.stasus(ERROR_VALIDATION).send({ message: [ERROR_VALIDATION, 'Переданы некорректные данные при обновлении профиля.'].join(' - ') });
    }
    if (error.message === 'NotFound') {
      return res.status(ERROR_NOT_FOUND).send({ message: [ERROR_NOT_FOUND, 'Пользователь по указанному _id не найден'].join(' - ') });
    }
    return res.status(ERROR_DEFAULT).send({ message: [ERROR_DEFAULT, 'На сервере произошла ошибка'].join(' - ') });
  }
};

module.exports = {
  createUser,
  findUsers,
  findUserById,
  updateUserProfile,
  updateUserAvatar,
};
