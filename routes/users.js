const router = require('express').Router();

const { findUserByIdValidator, updateUserProfileValidator, updateUserAvatarValidator } = require('../middlewares/validator');

const {
  findUsers,
  findUserById,
  findUserProfile,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', findUsers);

router.get('/me', findUserProfile);

router.get('/:userId', findUserByIdValidator, findUserById);

router.patch('/me', updateUserProfileValidator, updateUserProfile);

router.patch('/me/avatar', updateUserAvatarValidator, updateUserAvatar);

module.exports = router;
