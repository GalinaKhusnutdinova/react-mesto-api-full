import React from "react";
import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);

  function handleClick() {
    onCardClick(card);
  }
  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner._id === currentUser._id;

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = `popup__delete-button ${
    !isOwn ? "popup__delete-button_hidden" : ""
  }`;

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some((i) => i._id === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `elements__group ${
    isLiked ? "elements__group_active" : ""
  }`;

  return (
    <div className="elements__element">
      <button
        onClick={handleDeleteClick}
        type="button"
        className={cardDeleteButtonClassName}
        aria-label="удалить"
      ></button>
      <img
        className="elements__image"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />
      <div className="elements__content">
        <h2 className="elements__title">{card.name}</h2>
        <div className="elements__like-content">
          <button
            type="button"
            className={cardLikeButtonClassName}
            aria-label="поставить лайк"
            onClick={handleLikeClick}
          ></button>
          <span className="elements__like-number">{card.likes.length}</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
