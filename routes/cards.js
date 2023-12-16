const router = require('express').Router();
const validator = require('../middlewares/validator');
const {
  createCard,
  findCards,
  findCardByIdAndDelete,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.post('/', validator.createCard, createCard);

router.get('/', findCards);

router.delete('/:cardId', validator.findCardByIdAndDelete, findCardByIdAndDelete);

router.put('/:cardId/likes', validator.likeDislikeCard, likeCard);

router.delete('/:cardId/likes', validator.likeDislikeCard, dislikeCard);

module.exports = router;
