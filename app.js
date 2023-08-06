const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRout = require('./routes/users');
const cardsRout = require('./routes/cards');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
// Создаем приложение
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64cea562a4f590af559492ee',
  };

  next();
});

app.use('/', usersRout);
app.use('/', cardsRout);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Произошла ошибка' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`порт приложение слушает ${PORT}`);
});
