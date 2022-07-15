import { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Main from "./Main.jsx";
import PopupWithForm from "./PopupWithForm.jsx";
import EditProfilePopup from "./EditProfilePopup.jsx";
import EditAvatarPopup from "./EditAvatarPopup.jsx";
import AddPlacePopup from "./AddPlacePopup.jsx";
import ImagePopup from "./ImagePopup.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip.jsx";
import * as mestoAuth from "../utils/mestoAuth";
import success from "../images/success.svg";
import fail from "../images/fail.svg";
import { api } from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { Switch, Redirect, Route } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ name: "", link: "" });
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [tooltipStatus, setTooltipStatus] = useState({ url: "", title: "" });
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [userData, setUserData] = useState();
  const history = useHistory();
  

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getProfile(), api.getInitialCards()])
      .then(([useData, card]) => {
        setCurrentUser(useData);
        setCards(card);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
    }
  }, [loggedIn]);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  // открытие попапа о статусе регистрации
  function handleInfoTooltipClick() {
    setIsInfoTooltipPopupOpen(true);
  }
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
    setSelectedCard({ name: "", link: "" });
  }

  function handleUpdateUser(data) {
    api
      .editProfile(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  }

  function handleUpdateAvatar(avatar) {
    api
      .editAvatarProfile(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((user) => user._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    const request = isLiked ? api.deleteLike(card._id) : api.addLike(card._id);
    request
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((res) => {
        console.log(res);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id));
      })
      .catch((res) => {
        console.log(res);
      });
  }

  function handleAddPlaceSubmit(item) {
    api
      .addNewCard(item)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  }

  const handleRegister = ({ email, password }) => {
    return mestoAuth
      .register(email, password)
      .then((res) => {
        if (res) {
          handleInfoTooltipClick();
          history.push("/login");
          setTooltipStatus({
            url: success,
            title: "Вы успешно зарегистрировались!",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        handleInfoTooltipClick();
        setTooltipStatus({
          url: fail,
          title: "Что-то пошло не так! Попробуйте ещё раз.",
        });
      });
  };

  const handleLogin = ({ email, password }) => {
    return mestoAuth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);

          tokenCheck();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const tokenCheck = () => {
    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token");
      mestoAuth.getContent(token).then((res) => {
        if (res) {
          let userData = {
            email: res.data.email,
          };

          setLoggedIn(true);
          setUserData(userData);
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUserData(null);
    history.push("/login");
  };

  useEffect(() => {
    tokenCheck();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      history.push("/main");
    }
  }, [loggedIn, history]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Switch>
          <ProtectedRoute exact path="/" loggedIn={loggedIn}>
            <Header
              onClick={signOut}
              nameLink="Выйти"
              userData={userData}
              toLink="/login"
            />
            <Main
              onCardClick={handleCardClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
          </ProtectedRoute>
          <Route path="/login">
            <Header toLink="/register" nameLink="Регистрация" />
            <div className="loginContainer">
              <Login handleLogin={handleLogin} />
            </div>
          </Route>
          <Route path="/register">
            <Header toLink="login" nameLink="Войти" />
            <div className="registerContainer">
              <Register handleRegister={handleRegister} />
            </div>
          </Route>
          <Route  path="/">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/login" />}
          </Route>
        </Switch>

        <Route>{loggedIn && <Footer />}</Route>

        {/* popup авторизации*/}
        <InfoTooltip
          onClose={closeAllPopups}
          data={tooltipStatus}
          isOpen={isInfoTooltipPopupOpen}
        />

        {/* <!-- popup просмотра фото--> */}
        <ImagePopup onClose={closeAllPopups} card={selectedCard} />

        {/* popup редактирования профиля */}
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        {/* popup удаление карточки */}
        <PopupWithForm
          onClose={closeAllPopups}
          name="delete-photo"
          title="Вы уверены?"
          buttonText="Дa"
        ></PopupWithForm>

        {/* popup редактирования аватара */}
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        {/* popup форма добавления фото */}
        <AddPlacePopup
          onClose={closeAllPopups}
          isOpen={isAddPlacePopupOpen}
          onAddPlace={handleAddPlaceSubmit}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
