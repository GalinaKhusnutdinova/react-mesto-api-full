class Api {
  constructor(settings) {
    this._settings = settings;
  }
  //qq
  getProfile() {
    return fetch(this._settings.baseUrl + "/users/me", {
      headers: this._headersJwt(),
      credentials: 'include',  
    }).then(this._checkResponse);
  }
  //qq
  getInitialCards() {
    return fetch(this._settings.baseUrl + "/cards", {
      headers: this._headersJwt(),
    }).then(this._checkResponse);
  }
  //qq
  editProfile(data) {
    return fetch(this._settings.baseUrl + "/users/me", {
      method: "PATCH",
      headers: this._headersJwt(), 
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then(this._checkResponse);
  }

  addNewCard(item) {
    return fetch(this._settings.baseUrl + "/cards", {
      method: "POST",
      headers: this._headersJwt(),
      body: JSON.stringify({
        name: item.name,
        link: item.link,
      }),
    }).then(this._checkResponse);
  }
  //qq
  deleteCard(id) {
    return fetch(this._settings.baseUrl + "/cards/" + id, {
      method: "DELETE",
      headers: this._headersJwt(),
    }).then(this._checkResponse);
  }
  //qq
  deleteLike(id) {
    return fetch(this._settings.baseUrl + "/cards/" + id + "/likes", {
      method: "DELETE",
      headers: this._headersJwt(),
    }).then(this._checkResponse);
  }
  //qq
  addLike(id) {
    return fetch(this._settings.baseUrl + "/cards/" + id + "/likes", {
      method: "PUT",
      headers: this._headersJwt(),
    }).then(this._checkResponse);
  }
  //qq
  editAvatarProfile(data) {
    return fetch(this._settings.baseUrl + "/users/me/avatar", {
      method: "PATCH",
      headers: this._headersJwt(), 
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then(this._checkResponse);
  }

  _headersJwt() {
    return {authorization: 'Bearer ' + localStorage.getItem('token'), ...this._settings.headers};
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }
}

const baseUrl = `${window.location.protocol}${process.env.REACT_APP_API_URL || '//localhost:3001'}`


export const api = new Api({
  baseUrl: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
