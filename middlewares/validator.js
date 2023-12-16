const { celebrate, Joi } = require('celebrate');

const createUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().regex(/^(http:\/\/|https:\/\/)(w{3}\.)?[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,}\/?[a-zA-Z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*/i),
  }),
});

const login = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const findUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const updateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const updateUserAvatar = celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().required().regex(/^(http:\/\/|https:\/\/)(w{3}\.)?[a-zA-Z0-9-.]{2,}\.[a-zA-Z]{2,}\/?[a-zA-Z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*/i),
  }),
});

const createCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().required().regex(/^(http:\/\/|https:\/\/)(w{3}\.)?[a-zA-Z0-9-.]{2,}\.[a-zA-Z]{2,}\/?[a-zA-Z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*/i),
  }),
});

const findCardByIdAndDelete = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const likeDislikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  createUser,
  login,
  findUserById,
  updateUserProfile,
  updateUserAvatar,
  createCard,
  findCardByIdAndDelete,
  likeDislikeCard,
};
