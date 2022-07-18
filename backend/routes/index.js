const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexUrl } = require('../utils/utils');
const usersPouter = require('./users');
const cardPouter = require('./card');
const { isAuthorized } = require('../middlewares/isAuthorized');
const NotFound = require('../errors/NotFound'); // 404
const { createUser, login } = require('../controllers/users');

// все обработчики роутов
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(regexUrl)),
  }),
}), createUser);

router.use(isAuthorized);
router.use('/users', usersPouter);
router.use('/cards', cardPouter);

router.use((req, res, next) => next(new NotFound('Некорректный путь')));

module.exports = router;
