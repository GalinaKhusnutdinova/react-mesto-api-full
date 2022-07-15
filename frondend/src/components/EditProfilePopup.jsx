import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function EditProfilePopup(props) {
  // Подписка на контекст
  const currentUser = React.useContext(CurrentUserContext);

  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  const [name, setName] = useState(" ");
  const [description, setDescription] = useState(" ");

  function handleChangeName(e) {
    setName(e.target.value);
  }
  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      name,
      about: description,
    });
  }
  return (
    <PopupWithForm
      onClose={props.onClose}
      isOpen={props.isOpen}
      name="profil-edit"
      title="Редактировать профиль"
      buttonText="Сохранить"
      onSubmit={handleSubmit}
    >
      <label className="popup__label">
        <input
          className="popup__item popup__item_name"
          name="name"
          type="text"
          id="first-name"
          placeholder="Ваше имя"
          required
          minLength="2"
          maxLength="40"
          value={name || ""}
          onChange={handleChangeName}
        />
        <span className="popup__message first-name-error"></span>
      </label>
      <label className="popup__label">
        <input
          className="popup__item popup__item_about"
          name="about"
          type="text"
          id="prof"
          placeholder="Ваша деятельность"
          required
          minLength="2"
          maxLength="200"
          value={description || ""}
          onChange={handleChangeDescription}
        />
        <span className="popup__message prof-error"></span>
      </label>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
