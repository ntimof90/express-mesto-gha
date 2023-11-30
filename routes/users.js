const router = require('express').Router();

const {
  createUser,
  findUsers,
  findUserById,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.post('/users', createUser);

router.get('/users', findUsers);

router.get('/users/:userId', findUserById);

router.patch('/users/me', updateUserProfile);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
