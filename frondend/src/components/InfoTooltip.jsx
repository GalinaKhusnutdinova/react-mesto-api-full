import React from "react";
import closeIcon from "../images/Close-Icon.svg";
import "./styles/InfoTooltip.css";

export default function InfoTooltip({ onClose, data, isOpen }) {
  return (
    <div className={`popup ${isOpen && "popup_opened"}`}>
      <div className="popup__container popup__container_info">
        <button onClick={onClose} type="button" className="popup__close-button">
          <img
            className="popup__close popup__button-image"
            src={closeIcon}
            alt="закрыть"
          />
        </button>

        <img className="info__img" src={data.url} alt={data.title}></img>
        <p className="info__title">{data.title}</p>
      </div>
    </div>
  );
}
