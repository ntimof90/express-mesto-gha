const Card = require('../models/card');

const ERROR_VALIDATION = 400;

const ERROR_NOT_FOUND = 404;

const ERROR_DEFAULT = 500;

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    return res.send({ data: card });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(ERROR_VALIDATION).send({ message: [ERROR_VALIDATION, 'Переданы некорректные данные при создании карточки'].join(' - ') });
    }
    return res.status(ERROR_DEFAULT).send({ message: [ERROR_DEFAULT, 'На сервере произошла ошибка'].join(' - ') });
  }
};

const findCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.send({ data: cards });
  } catch (error) {
    return res.status(ERROR_DEFAULT).send({ message: [ERROR_DEFAULT, 'На сервере произошла ошибка'].join(' - ') });
  }
};

const findCardByIdAndDelete = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      throw new Error('NotFound');
    }
    return res.send({ data: card });
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(ERROR_NOT_FOUND).send({ message: [ERROR_NOT_FOUND, 'Карточка с указанным _id не найдена'].join(' - ') });
    }
    return res.status(ERROR_DEFAULT).send({ message: [ERROR_DEFAULT, 'На сервере произошла ошибка'].join(' - ') });
  }
};

const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new Error('NotFound');
    }
    return res.send({ data: card });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.stasus(ERROR_VALIDATION).send({ message: [ERROR_VALIDATION, 'Переданы некорректные данные для постановки лайка.'].join(' - ') });
    }
    if (error.message === 'NotFound') {
      return res.status(ERROR_NOT_FOUND).send({ message: [ERROR_NOT_FOUND, 'Передан несуществующий id карточки.'].join(' - ') });
    }
    return res.status(ERROR_DEFAULT).send({ message: [ERROR_DEFAULT, 'На сервере произошла ошибка'].join(' - ') });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new Error('NotFound');
    }
    return res.send({ data: card });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.stasus(ERROR_VALIDATION).send({ message: [ERROR_VALIDATION, 'Переданы некорректные данные для снятия лайка.'].join(' - ') });
    }
    if (error.message === 'NotFound') {
      return res.status(ERROR_NOT_FOUND).send({ message: [ERROR_NOT_FOUND, 'Передан несуществующий id карточки.'].join(' - ') });
    }
    return res.status(ERROR_DEFAULT).send({ message: [ERROR_DEFAULT, 'На сервере произошла ошибка'].join(' - ') });
  }
};

module.exports = {
  createCard,
  findCards,
  findCardByIdAndDelete,
  likeCard,
  dislikeCard,
};
