const router = require('express').Router();
const {
  postCards,
  getCards,
  deleteCardsID,
  putCardsIdLike,
  deleteCardsIDLike,
} = require('../controllers/cards');

router.post('/cards', postCards); // создаёт карточку
router.get('/cards', getCards); // возвращает все карточки
router.delete('/cards/:cardId', deleteCardsID); // удаляет карточку по идентификатору
router.put('/cards/:cardId/likes', putCardsIdLike); // поставить лайк карточке
router.delete('/cards/:cardId/likes', deleteCardsIDLike); // убрать лайк с карточки

module.exports = router;
