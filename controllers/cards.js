const Card = require('../model/card');

// функция создание карточки
module.exports.postCards = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((сard) => {
      Card.findById(сard._id)
        .populate('owner')
        .then((data) => res.status(201).send(data));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

// функция возвр всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((сard) => res.send(сard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ' Переданы некорректные данные.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

// функция удаления карточк
module.exports.deleteCardsID = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      // eslint-disable-next-line no-console
      console.log(card);
      if (!card) {
        // eslint-disable-next-line no-console
        console.log(card);
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send({ message: 'Карточка удалена.' });
    })
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные' }));
};

// функция лайк
module.exports.putCardsIdLike = (req, res) => {
  // eslint-disable-next-line max-len
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true, runValidators: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send(card);
    })
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' }));
};
// функция удаления лайк
module.exports.deleteCardsIDLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send(card);
    })
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' }));
};
