const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  findUsers,
  findUserById,
  findUserProfile,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

router.get('/users', auth, findUsers);

router.get('/users/me', auth, findUserProfile);

router.get('/users/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), findUserById);

router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserProfile);

router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().required().regex(/^(http:\/\/|https:\/\/)(w{3}\.)?[a-zA-Z0-9-.]{2,}\.[a-zA-Z]{2,}\/?[a-zA-Z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*/i),
  }),
}), updateUserAvatar);

module.exports = router;
