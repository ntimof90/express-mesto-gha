const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');

const ForbiddenError = require('../errors/forbidden-error');

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    return res.send({ data: card });
  } catch (error) {
    return next(error);
  }
};

const findCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send({ data: cards });
  } catch (error) {
    return next(error);
  }
};

const findCardByIdAndDelete = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError('Карточка с указанным id не найдена');
    }
    if (card.owner.toString() === req.user._id) {
      await card.deleteOne();
    } else {
      throw new ForbiddenError('У вас нет прав на удаление чужой карточки');
    }
    return res.send({ data: card });
  } catch (error) {
    return next(error);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Передан несуществующий id карточки');
    }
    return res.send({ data: card });
  } catch (error) {
    return next(error);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Передан несуществующий id карточки');
    }
    return res.send({ data: card });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createCard,
  findCards,
  findCardByIdAndDelete,
  likeCard,
  dislikeCard,
};
