const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const usersRout = require('./routes/users');
const cardsRout = require('./routes/cards');
const auth = require('./middlewares/auth');
const regex = require('./model/constRegular');

const { postUsers, login } = require('./controllers/users');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
// Создаем приложение
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), postUsers);

// авторизация
app.use(auth);
app.use('/', usersRout);
app.use('/', cardsRout);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Произошла ошибка' });
});

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`порт приложение слушает ${PORT}`);
});
