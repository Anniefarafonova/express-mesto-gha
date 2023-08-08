const Card = require('../model/card');
const {
  badRequestError,
  notFoundError,
  internalServerError,
} = require('../errors/error');

// функция создание карточки
module.exports.postCards = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((сard) => res.send(сard))
    //   Card.findById(сard._id)
    //     .populate('owner')
    //     .then((data) => res.status(201).send(data));
    // })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

// функция возвр всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((сard) => res.send(сard))
    .catch(() => {
      res.status(badRequestError).send({ message: ' Переданы некорректные данные.' });
      res.status(internalServerError).send({ message: 'Произошла ошибка' });
    });
};

// функция удаления карточк
module.exports.deleteCardsID = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send({ message: 'Карточка удалена.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

// функция лайк
module.exports.putCardsIdLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    // .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(notFoundError).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};
// функция удаления лайк
module.exports.deleteCardsIDLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(notFoundError).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};
