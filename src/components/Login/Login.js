import { Link } from 'react-router-dom';
import logo from '../../images/logo.png'

function Login() {
  return (
    <section className="auth">
      <img className="auth__logo" src={logo} alt="Лого"/>
      <h2 className="auth__title">Рады видеть!</h2>
      <form className="auth__form" name="register">
        <label className='auth__label'>E-mail</label>
        <label className='auth__input-block'>
          <input 
            type="text" 
            id="input-email" 
            className="auth__input"
            required
            name="email"
          />
          <span className="input-email-error auth__input-error"></span>
        </label>
        <label className='auth__label'>Пароль</label>
        <label className='auth__input-block'>
          <input 
            type="text" 
            id="input-pass" 
            className="auth__input" 
            required
            name="pass"
          />
          <span className="input-pass-error auth__input-error"></span>
        </label>
        <button type="submit" className="auth__button">Войти</button>
      </form>
      <p className='auth__note'>Ещё не зарегистрированы? <Link to='/signup' className='auth__link'>Регистрация</Link></p>
    </section>
  )
}

export default Login;