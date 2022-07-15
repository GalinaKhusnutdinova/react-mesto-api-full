import React from "react";
import closeIcon from "../images/Close-Icon.svg";

function PopupWithForm(props) {
  return (
    <div className={`popup ${props.isOpen && "popup_opened"}`}>
      <div className="popup__container">
        <button
          onClick={props.onClose}
          type="button"
          className={`popup__close-button popup__close-button_type_${props.name}`}
        >
          <img
            className="popup__close popup__button-image"
            src={closeIcon}
            alt="закрыть"
          />
        </button>
        <h3 className={`popup__title popup__title_${props.name}`}>
          {props.title}
        </h3>
        <form
          method="get"
          name={props.name}
          className={`popup__form popup__form_type_${props.name}`}
          onSubmit={props.onSubmit}
        >
          {props.children}
          <button
            type="submit"
            className={`popup__save-button popup__save-button_${props.name}`}
          >
            {props.buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
