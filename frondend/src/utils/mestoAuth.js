// export const BASE_URL = `${'http://khusnutdinova.student.nomoredomains.xyz' || 'http://localhost:3001'}`;
export const BASE_URL = `${window.location.protocol}${process.env.REACT_APP_API_URL || '//localhost:3001'}`

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
};

export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
};

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return res.json().then((data) => {
    throw new Error(data.message);
  });
}
