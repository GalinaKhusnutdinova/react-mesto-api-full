import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/Login.css";

export default function Register({ handleRegister }) {
  const [formParams, setFormParams] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let { email, password } = formParams;
    handleRegister({ email, password });
  };
  return (
    <>
      <div className="login">
        <div className="login__container">
          <h3 className="login__title">Регистрация</h3>
          <form
            method="get"
            name="login"
            className="login__form"
            onSubmit={handleSubmit}
          >
            <label className="login__label">
              <input
                className="login__item"
                name="email"
                type="text"
                id="email"
                placeholder="Email"
                required
                minLength="2"
                maxLength="40"
                value={formParams.email}
                onChange={handleChange}
              />
              <span className="login__message first-name-error"></span>
            </label>
            <label className="login__label">
              <input
                className="login__item "
                name="password"
                type="password"
                id="password"
                placeholder="Пароль"
                required
                minLength="2"
                maxLength="200"
                value={formParams.password}
                onChange={handleChange}
              />
              <span className="login__message prof-error"></span>
            </label>
            <button type="submit" className="login__save-button">
              Зарегистрироваться
            </button>
          </form>
          <Link to="login" className="login__link">
            Уже зарегистрированы? Войти
          </Link>
        </div>
      </div>
    </>
  );
}
