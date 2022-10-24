import './App.css';
import { Route, Switch, withRouter } from 'react-router-dom';
import Main from '../Main/Main';
import Movies from '../Movies/Movies';
import SavedMovies from '../SavedMovies/SavedMovies';
import Profile from '../Profile/Profile';
import Login from '../Login/Login';
import Register from '../Register/Register';
import NotFound from '../NotFound/NotFound';
import { useEffect, useState } from 'react';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import moviesApi from '../../utils/MoviesApi';
import api from '../../utils/Api';

function App(props) {

  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [shortMovie, setShortMovie] = useState(false);
  const [searchMovies, setSearchMovies] = useState([]);
  const [countCards, setCountCards] = useState(0);
  const [buttonElse, setButtonElse] = useState(false);
  const [preloader, setPreloader] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [countOnPage, setCountOnPage] = useState(0);
  const [countAdd, setCountAdd] = useState(0);
  const [navVisible, setNavVisible] = useState(false);
  const [savedMovie, setSavedMovie] = useState([]);

  function loadMovieCards() {
    if (width > 1280) {
      setCountOnPage(12);
      setCountAdd(4);
    } else if (width > 767) {
      setCountOnPage(8);
      setCountAdd(2);
    } else if (width < 768) {
      setCountOnPage(5);
      setCountAdd(5);
    }
  }

  useEffect(() => {
    loadMovieCards();
  }, [width])

  window.onresize = (() => {
    setTimeout(() => {
      setWidth(window.innerWidth);
      console.log(width);
      loadMovieCards();
    }, 500)
  })

  useEffect(() => {
    if (loggedIn) {
      const searched = JSON.parse(localStorage.getItem('searchedMoviesList'));
      //const shortMov = localStorage.getItem('shortMovie');
      if (searched && searched !== []) {
        //setShortMovie(false);
        checkedButtonElse();
      } else {
        moviesApi.getMovies()
        .then(res => {
          localStorage.setItem('moviesList', JSON.stringify(res));
        })
        .catch((err) => {
          console.log(err)
        });
      }
    }
  }, [loggedIn, searchMovies, savedMovie])

  useEffect(() => {
    if (loggedIn) {
      api.getMovies()
      .then((data) => {
        let userSavedMovies = data.filter(i => i.owner === currentUser._id);
        setSavedMovie(userSavedMovies);
      })
      .catch((err) => {
        console.log(err)
      });
    }
  }, [loggedIn])

  function handleLoginUser(data) {
    api.authorize(data)
    .then((res) => {
      setLoggedIn(true);
      props.history.push('/movies');
    })
    .catch((err) => {
      console.log(err);
    })
  }
  
  function handleRegisterUser(data) {
    api.register(data)
    .then((res) => {
      handleLoginUser({email: data.email, password: data.password});
      return res;
    })
    .catch((err) => {
      console.log(err);
    })
  }

  function handleChangeUser(data) {
    api.editProfile(data)
    .then((res) => {
      setCurrentUser(res);
    })
    .catch((err) => {
      console.log(err.name)
    })
  }

  function activatePreloader() {
    setPreloader(true);
  }

  function handleSearchMovies(movieName) {
    setTimeout(() => {
      const allMovies = JSON.parse(localStorage.getItem('moviesList'));
      const searchedMovies = [];
      allMovies.map(function (movie) {
        if (movie.nameRU.indexOf(movieName) !== -1 && shortMovie && movie.duration < 40) {
          searchedMovies.push(movie)
        } else if (movie.nameRU.indexOf(movieName) !== -1 && !shortMovie) {
          searchedMovies.push(movie)
        }
        return searchedMovies;
      });
      setSearchMovies(searchedMovies);
      setCountCards(searchedMovies.length);
      localStorage.setItem('shortMovie', shortMovie);
      localStorage.setItem('searchedMoviesList', JSON.stringify(searchedMovies));
      setPreloader(false);
    }, 3000)
    
  }


  function toggleShortMovie() {
    setShortMovie(!shortMovie);
  }

  useEffect(() => {
    if (loggedIn) {
      api.getUser()
      .then((data) => {
        if (data) {
          setCurrentUser(data);
          setLoggedIn(true)
        }
      })
      .catch((err) => {
        console.log(err.name);
      })
    }
  }, [loggedIn]);

  function checkToken() {
    api.getUser()
    .then((data) => {
      if (data) {
        setLoggedIn(true);
        setCurrentUser(data);
        props.history.push('/movies')
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }

  function checkedButtonElse() {
    if (countCards > 3 && countOnPage < countCards) {
      setButtonElse(true);
    } else {
      setButtonElse(false);
    }
  }

  useEffect(() => {
    checkToken();
  }, []);

  function addCard() {
    if (searchMovies.length - countOnPage > countAdd) {
      setCountOnPage(countOnPage + countAdd);
    } else {
      setCountOnPage(searchMovies.length);
      setButtonElse(false);
    }
    
  }

  function handleNavbar() {
    setNavVisible(true);
  }

  function closeNavbar() {
    setNavVisible(false);
  }

  function handleMovieSave(movie) {
    const isSaved = savedMovie.some(i => (i.movieId === movie.movieId)) || movie.owner ;
    const mov = savedMovie.find((i) => i.movieId === movie.movieId) || movie;
    console.log(mov);
    api.toggleSave(movie, isSaved, mov)
    .then(() => {
      api.getMovies()
      .then((data) => {
        let userSavedMovies = data.filter(i => i.owner === currentUser._id);
        setSavedMovie(userSavedMovies);
      })
      .catch((err) => {
        console.log(err);
      })
    })
    .catch((err) => {
      console.log(err.name);
    });
  }

  function logout() {
    setLoggedIn(false);
    setShortMovie(false);
    localStorage.removeItem('shortMovie');
    localStorage.removeItem('moviesList');
    localStorage.removeItem('searchedMoviesList');
  }

  return (
    <CurrentUserContext.Provider value={currentUser} >
      <div className="page">
        <Switch>
          <Main
            exact
            path="/"
          />
          <ProtectedRoute 
            loggedIn={loggedIn}
            component={Movies}
            path="/movies"
            cards={ searchMovies.slice(0, countOnPage) }
            searchMovies={handleSearchMovies}
            buttonElse={buttonElse}
            toggleShortMovie={toggleShortMovie}
            preloader={preloader}
            addCard={addCard}
            shortMovie={shortMovie}
            handleNavbar={handleNavbar}
            closeNavbar={closeNavbar}
            navVisible={navVisible}
            movies={searchMovies}
            onSaveMovie={handleMovieSave}
            savedMovie={savedMovie}
            activatePreloader={activatePreloader}
          />
          <ProtectedRoute 
            loggedIn={loggedIn}
            component={SavedMovies}
            path="/saved-movies"
            toggleShortMovie={toggleShortMovie}
            savedMovie={savedMovie}
            navVisible={navVisible}
            buttonElse={buttonElse}
            preloader={preloader}
            addCard={addCard}
            shortMovie={shortMovie}
            handleNavbar={handleNavbar}
            onSaveMovie={handleMovieSave}
            activatePreloader={activatePreloader}
            searchMovies={handleSearchMovies}
          />
          <ProtectedRoute
            loggedIn={loggedIn} 
            component={Profile}
            path="/profile"
            onChangeUser={handleChangeUser}
            logout={logout}
            handleNavbar={handleNavbar}
            closeNavbar={closeNavbar}
            navVisible={navVisible}
          />
          <Route path="/signin">
            <Login 
              onLoginUser={handleLoginUser} 
            />
          </Route>
          <Route path="/signup">
            <Register 
              onRegisterUser={handleRegisterUser}
            />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
