import { useContext } from "react";
import Card from "./Card.jsx";
// import Header from "./Header.jsx";
import vectorEdit from "../images/Vector-edit.svg";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Main({
  cards,
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardClick,
  onCardLike,
  onCardDelete,
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <>
      <main className="content">
        <section className="profile">
          <div className="profile__block-avatar">
            <img
              className="profile__avatar"
              src={currentUser.avatar}
              alt="Аватарка"
            />
            <button
              onClick={onEditAvatar}
              type="button"
              className="profile__photo"
            ></button>
          </div>
          <div className="profile__info">
            <h1 className="profile__title">{currentUser.name}</h1>
            <button
              onClick={onEditProfile}
              type="button"
              className="profile__edit-button"
            >
              <img
                className="profile__img"
                src={vectorEdit}
                alt="Кнопка реактирования"
              />
            </button>
            <p className="profile__subtitle">{currentUser.about}</p>
          </div>
          <button
            aria-label="плюс"
            onClick={onAddPlace}
            type="button"
            className="profile__add-button"
          ></button>
        </section>
        <section className="elements">
          {cards.map((card) => (
            <Card
              card={card}
              key={card._id}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
              onCardClick={onCardClick}
            />
          ))}
        </section>
      </main>
    </>
  );
}

export default Main;
