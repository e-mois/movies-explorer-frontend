import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";
import avatar from "../../images/avatar.png"
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import isEmail from "validator/lib/isEmail";

function Profile(props) {

  const { register, formState: { errors, isValid }, handleSubmit } = useForm({mode: 'onChange'});
  const currentUser = useContext(CurrentUserContext);
 
  function onSubmit(data) {
    if (data.name !== currentUser.name || data.email !== currentUser.email) {
      props.onChangeUser({
        name: data.name,
        email: data.email,
      })
    } else {
      return !isValid;
    }
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
        <p className={`profile__message ${props.message && 'profile__message_active'}`}>{props.textMessage}</p>
        <form className="profile__content" onSubmit={handleSubmit(onSubmit)}>
          <div className="profile__main">
            <h2 className="profile__title">Привет, {currentUser.name}</h2>
            <div className="profile__info">
              <div className="profile__row">
                <label className="profile__key">Имя</label>
                <input 
                  name='name'
                  className="profile__value" 
                  {...register('name', {
                    value: currentUser.name,
                    minLength: 2,
                    maxLength: 30,
                    pattern: /[а-яa-z]/i,
                  })}
                />
                <span className={`auth__input-error auth__input-error_visible`}>
                  {errors.name?.type === 'minLength' && 'Имя должно быть не менее 2-х символов'}
                  {errors.name?.type === 'maxLength' && 'Имя должно быть не более 30 символов'}
                  {errors.name?.type === 'pattern' && 'Поле содержит недопустимые символы'}
                </span>
              </div>
              <div className="profile__row">
                <label className="profile__key">E-Mail</label>
                <input 
                  name='email'  
                  className="profile__value" 
                  {...register('email', {
                    value: currentUser.email,
                    validate: (input) => isEmail(input),
                  })}
                />
                <span className={`auth__input-error auth__input-error_visible`}>
                  {errors.email?.type === 'validate' && 'Введите Email'}
                </span>
              </div>
            </div>
          </div>
          <div className="profile__buttons">
            <button className={`profile__button ${!isValid ? 'profile__button_disabled' : ''}`} type="submit" disabled={!isValid}>Редактировать</button>
            <button className="profile__button profile__button_type_red" type="button" onClick={props.logout}>Выйти из аккаунта</button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Profile;