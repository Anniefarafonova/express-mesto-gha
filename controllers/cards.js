const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
const Card = require('../model/card');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// функция создание карточки
module.exports.postCards = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((сard) => res.send(сard))
    //   Card.findById(сard._id)
    //     .populate('owner')
    //     .then((data) => res.status(201).send(data));
    // })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

// функция возвр всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((сard) => res.send(сard))
    .catch((err) => {
      next(err);
    });
};

// функция удаления карточк
module.exports.deleteCardsID = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      console.log('card');
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Карточка другого пользователя.');
        // next(new ForbiddenError('Карточка другого пользователя.'));
      }
      Card.findByIdAndRemove(card)
        .orFail()
        .then(() => {
          res.send({ message: 'Карточка удалена.' });
          console.log('cardd');
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError('Пользователь по указанному _id не найден.'));
            console.log('NotFoundError');
            console.log(err);
          } else if (err instanceof mongoose.Error.CastError) {
            next(new BadRequestError('Переданы некорректные данные.'));
            console.log('BadRequestError');
            console.log(err);
          } else {
            next(err);
          }
        });
    });
};

// функция лайк
module.exports.putCardsIdLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    // .populate(['owner', 'likes'])
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};
// функция удаления лайк
module.exports.deleteCardsIDLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};
