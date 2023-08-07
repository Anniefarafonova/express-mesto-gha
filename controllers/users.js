const User = require('../model/user');
const {
  badRequestError,
  notFoundError,
  internalServerError,
} = require('../errors/error');

// функция создание юзера
module.exports.postUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

// функция возвр всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(() => {
      res.status(badRequestError).send({ message: 'Переданы некорректные данные' });
      res.status(internalServerError).send({ message: 'Произошла ошибка' });
    });
};
// функция возвр. пользователя по _id
module.exports.getUsersId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(notFoundError).send({ message: ' Пользователь по указанному _id не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

// функция обновления профиля
module.exports.patchUsers = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(notFoundError).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

// функция обновления аватарки
module.exports.patchUsersAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(notFoundError).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};
