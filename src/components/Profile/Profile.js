import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";
import avatar from "../../images/avatar.png"
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import isEmail from "validator/lib/isEmail";

function Profile(props) {

  const currentUser = useContext(CurrentUserContext);

  const { register, handleSubmit, formState: { errors } } = useForm();

  function onSubmit(data) {
    props.onChangeUser({
      name: data.name,
      email: data.email
    })
  }

  return (
    <div className="profile">
      <Header
        loggedIn={props.loggedIn}
      >
        <div className={`header__nav ${props.navVisible && 'header__nav_visible'}`}>
          <div className="header__nav-container">
            <Navigation closeNavbar={props.closeNavbar}/>
            <button className="header__close" type="button" onClick={props.closeNavbar}></button>
            <div className="account">
              <Link className="account__name" to="/profile" onClick={props.closeNavbar}>Аккаунт</Link>
              <img className="account__avatar" src={avatar} alt="Аватар" />
            </div>
          </div>
        </div>
        <a className="header__burger-link" href="#" onClick={props.handleNavbar}>
          <div className="header__burger">
            <span className="header__span"></span>
            <span className="header__span"></span>
            <span className="header__span"></span>
          </div>
        </a>
      </Header>
      <main className="main">
        <form className="profile__content" onSubmit={handleSubmit(onSubmit)}>
          <div className="profile__main">
            <h2 className="profile__title">Привет, {currentUser.name}</h2>
            <div className="profile__info">
              <div className="profile__row">
                <label className="profile__key">Имя</label>
                <input 
                  name='name'
                  className="profile__value" 
                  placeholder={currentUser.name}
                  {...register('name', {
                    required: true,
                    minLength: 2,
                    maxLength: 30,
                    pattern: /[а-яa-z]/i,
                  })} 
                  aria-invalid={errors.name ? "true" : "false"}
                />
                <span className={`auth__input-error auth__input-error_visible`}>
                  {errors.name?.type === 'required' && 'Пожалуйста, заполните поле'}
                  {errors.name?.type === 'minLength' && 'Имя должно быть не менее 2-х символов'}
                  {errors.name?.type === 'maxLength' && 'Имя должно быть не более 30 символов'}
                  {errors.name?.type === 'pattern' && 'Поле содержит недопустимые символы'}
                </span>
              </div>
              <div className="profile__row">
                <label className="profile__key">E-Mail</label>
                <input 
                  name='email' 
                  {...register('email', {
                    required: true,
                    validate: (input) => isEmail(input),
                  })} 
                  className="profile__value" 
                  placeholder={currentUser.email} 
                  aria-invalid={errors.email ? "true" : "false"} 
                />
                <span className={`auth__input-error auth__input-error_visible`}>
                  {errors.email?.type === 'required' && 'Пожалуйста, заполните поле'}
                  {errors.email?.type === 'validate' && 'Введите Email'}
                </span>
              </div>
            </div>
          </div>
          <div className="profile__buttons">
            <button className="profile__button" type="submit">Редактировать</button>
            <button className="profile__button profile__button_type_red" type="button" onClick={props.logout}>Выйти из аккаунта</button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Profile;