class Api {
  constructor(settings) {
    this._settings = settings;
    console.log(settings)
  }
  //qq
  getProfile() {
    return fetch(this._settings.baseUrl + "/users/me", {
      headers: this._settings.headers,
      credentials: 'include',  
    }).then(this._checkResponse);
  }
  //qq
  getInitialCards() {
    return fetch(this._settings.baseUrl + "/cards", {
      headers: this._settings.headers,
    }).then(this._checkResponse);
  }
  //qq
  editProfile(data) {
    return fetch(this._settings.baseUrl + "/users/me", {
      method: "PATCH",
      headers: this._settings.headers, 
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then(this._checkResponse);
  }

  addNewCard(item) {
    return fetch(this._settings.baseUrl + "/cards", {
      method: "POST",
      headers: this._settings.headers,
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
      headers: this._settings.headers,
    }).then(this._checkResponse);
  }
  //qq
  deleteLike(id) {
    return fetch(this._settings.baseUrl + "/cards/" + id + "/likes", {
      method: "DELETE",
      headers: this._settings.headers,
    }).then(this._checkResponse);
  }
  //qq
  addLike(id) {
    return fetch(this._settings.baseUrl + "/cards/" + id + "/likes", {
      method: "PUT",
      headers: this._settings.headers,
    }).then(this._checkResponse);
  }
  //qq
  editAvatarProfile(data) {
    return fetch(this._settings.baseUrl + "/users/me/avatar", {
      method: "PATCH",
      headers: this._settings.headers, 
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then(this._checkResponse);
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }
}
// const baseUrl = `${'http://api.khusnutdinova.student.nomoredomains.xyz' || 'http://localhost:3001'}` 
const baseUrl = `${window.location.protocol}${process.env.REACT_APP_API_URL || '//localhost:3001'}`


export const api = new Api({
  baseUrl: baseUrl,
  headers: {
    authorization: 'Bearer ' + localStorage.getItem('jwt'),
    "Content-Type": "application/json",
  },
});
