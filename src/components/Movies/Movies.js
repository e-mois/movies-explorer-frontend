import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";
import SearchForm from "../SearchForm/SearchForm";

import avatar from "../../images/avatar.png"
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import Preloader from "../Preloader/Preloader";

const loggedIn = true;
const savedFilm = false;

function Movies() {
  return (
    <div className="content">
      <Header
        loggedIn={loggedIn}
      >
        <div className="header__nav">
          <div className="header__nav-container">
            <Navigation />
            <button className="header__close"></button>
            <div className="account">
              <p className="account__name">Аккаунт</p>
              <img className="account__avatar" src={avatar} alt="Аватар" />
            </div>
          </div>
        </div>
        <div className="header__burger">
          <span className="header__span"></span>
          <span className="header__span"></span>
          <span className="header__span"></span>
        </div>
      </Header>
      <SearchForm />
      <Preloader />
      <MoviesCardList saved={savedFilm} />
      <Footer />
    </div>
  )
}

export default Movies;