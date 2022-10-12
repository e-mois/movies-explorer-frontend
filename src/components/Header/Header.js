import logo from '../../images/logo.png'

function Header(props) {
  return (
    <header className={`header ${!props.loggedIn && 'header_theme_dark'}`}>
      <div className="header__content">
        <img src={logo} alt="Лого" className="header__logo" />
        { props.children }
      </div>
    </header>
  );
}

export default Header;