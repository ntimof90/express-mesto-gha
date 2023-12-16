const router = require('express').Router();

const validator = require('../middlewares/validator');

const {
  findUsers,
  findUserById,
  findUserProfile,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', findUsers);

router.get('/me', findUserProfile);

router.get('/:userId', validator.findUserById, findUserById);

router.patch('/me', validator.updateUserProfile, updateUserProfile);

router.patch('/me/avatar', validator.updateUserAvatar, updateUserAvatar);

module.exports = router;
