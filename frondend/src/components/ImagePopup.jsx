import React from "react";
import closeIcon from "../images/Close-Icon.svg";

export default function ImagePopup({ onClose, card }) {
  return (
    // popup просмотра фото
    <div
      className={`popup popup_type_loock-photo ${card.link && "popup_opened"}`}
    >
      <figure className="popup__figure">
        <button
          onClick={onClose}
          type="button"
          className="popup__close popup__close-button"
        >
          <img
            className="popup__close popup__button-image popup__button-image_loock-photo"
            src={closeIcon}
            alt="закрыть"
          />
        </button>
        <img className="popup__image" src={card.link} alt={card.name} />
        <figcaption className="popup__figcaption">{card.name}</figcaption>
      </figure>
    </div>
  );
}
