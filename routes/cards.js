const router = require('express').Router();

const {
  createCard,
  findCards,
  findCardByIdAndDelete,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.post('/cards', createCard);

router.get('/cards', findCards);

router.delete('/cards/:cardId', findCardByIdAndDelete);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
