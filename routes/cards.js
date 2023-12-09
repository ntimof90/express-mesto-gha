const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  createCard,
  findCards,
  findCardByIdAndDelete,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const auth = require('../middlewares/auth');

router.post('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().required().regex(/^(http:\/\/|https:\/\/)(w{3}\.)?[a-zA-Z0-9-.]{2,}\.[a-zA-Z]{2,}\/?[a-zA-Z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*/i),
  }),
}), createCard);

router.get('/cards', auth, findCards);

router.delete('/cards/:cardId', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), findCardByIdAndDelete);

router.put('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports = router;
