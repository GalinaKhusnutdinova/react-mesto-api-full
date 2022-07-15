import { useRef, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const linkRef = useRef();

  useEffect(() => {
    linkRef.current.value = "";
  });

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({
      avatar: linkRef.current.value,
    });
  }

  return (
    <PopupWithForm
      onClose={props.onClose}
      isOpen={props.isOpen}
      name="avatar"
      title="Обновить аватар"
      buttonText="Сохранить"
      onSubmit={handleSubmit}
    >
      <label className="popup__label">
        <input
          className="popup__item popup__item_add"
          name="link"
          ref={linkRef}
          type="url"
          id="link-avatar"
          placeholder="Ссылка на картинку"
          required
        />
        <span className="popup__message link-avatar-error"></span>
      </label>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
