const Card = require('../models/card');
// error
const ValidationError = require('../errors/ValidationError'); // 400
const Forbidden = require('../errors/Forbidden'); // 403
const NotFound = require('../errors/NotFound'); // 404
const InternalServerError = require('../errors/InternalServerError'); // 500

// GET-запрос возвращает все карточки из базы данных.
module.exports.findCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => next(new InternalServerError('Ошибка по умолчанию.')))
    .catch(next);
};

// POST-запрос создает новую карточку по переданным параметрам.
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({
      name: card.name,
      link: card.link,
      owner: card.owner,
      likes: card.likes,
      _id: card._id,
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.errors) {
        // получили все ключи
        const errorKeys = Object.keys(err.errors);
        // взяли ошибку по первому ключу, и дальше уже в ней смотреть.
        const error = err.errors[errorKeys[0]];
        if (err.name === 'ValidationError' || err.name === 'CastError') {
          next(new ValidationError(`Переданы некорректные данные при создание карточки. ${error}`));
          return;
        }
      }
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные при создании пользователя.'));
        return;
      }

      next(err);
    })
    .catch(next);
};

// DELETE-запрос удаляет карточку по _id.
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => next(new NotFound('Передан несуществующий _id карточки.')))
    .then((card) => {
      const owner = card.owner.toString();
      const userId = req.user._id.toString();

      if (userId !== owner) {
        return next(new Forbidden('Вы не можете удалять чужие каточки'));
      }
      return Card.findByIdAndRemove(card);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные при создании пользователя.'));
        return;
      }
      next(err);
    })
    .catch(next);
};

// PUT-запрос добавляет лайк карточке.
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => next(new NotFound('Передан несуществующий _id карточки.')))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные для постановки лайка.'));
        return;
      }
      next(err);
    })
    .catch(next);
};

// DELETE-запрос удаляет лайк с карточки.
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => next(new NotFound('Передан несуществующий _id карточки.')))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные для снятии лайка.'));
        return;
      }
      next(err);
    })
    .catch(next);
};
