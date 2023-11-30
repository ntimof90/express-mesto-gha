const router = require('express').Router();

const {
  createUser,
  findUsers,
  findUserById,
  updateUserProfile,
  updateUserAvatar,
  errorHandler,
} = require('../controllers/users');

router.post('/users', createUser);

router.get('/users', findUsers);

router.get('/users/:userId', findUserById);

router.patch('/users/me', updateUserProfile);

router.patch('/users/me/avatar', updateUserAvatar);

router.get('*', errorHandler);
router.post('*', errorHandler);
router.put('*', errorHandler);
router.patch('*', errorHandler);
router.delete('*', errorHandler);

module.exports = router;
