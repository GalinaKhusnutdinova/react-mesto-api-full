const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const usersPouter = require('./routes/users');
const cardPouter = require('./routes/card');
const { regexUrl } = require('./utils/utils');
const { createUser, login } = require('./controllers/users');
const { isAuthorized } = require('./middlewares/isAuthorized');
const NotFound = require('./errors/NotFound'); // 404
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'https://khusnutdinova.student.nomoredomains.xyz',
    'https://api.khusnutdinova.student.nomoredomains.xyz',
    'http://khusnutdinova.student.nomoredomains.xyz',
    'http://api.khusnutdinova.student.nomoredomains.xyz',
    'https://GalinaKhusnutdinova.github.io',
  ],
  credentials: true, // эта опция позволяет устанавливать куки
};

app.use('*', cors(options)); // Подключаем первой миддлварой

// Слушаем 3000 порт
const { PORT = 3001 } = process.env;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger); // подключаем логгер запросов

// Краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// за ним идут все обработчики роутов
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(regexUrl)),
  }),
}), createUser);

app.use(isAuthorized);
app.use('/users', usersPouter);
app.use('/cards', cardPouter);

app.use(errorLogger); // подключаем логгер ошибок
app.use((req, res, next) => next(new NotFound('Некорректный путь')));
app.use(errors()); // обработчик ошибок celebrate
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  res.status(500).send({ message: 'Что-то пошло не так' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
module.exports = app;
