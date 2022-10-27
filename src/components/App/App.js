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
import { get } from 'react-hook-form';

function App(props) {

  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [shortMovie, setShortMovie] = useState(false);
  const [shortSaveMovie, setShortSaveMovie] = useState(false);
  const [searchedSaveWord, setSearchedSaveWord] = useState('');
  const [searchMovies, setSearchMovies] = useState([]);
  const [countCards, setCountCards] = useState(0);
  const [buttonElse, setButtonElse] = useState(false);
  const [preloader, setPreloader] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [countOnPage, setCountOnPage] = useState(0);
  const [countAdd, setCountAdd] = useState(0);
  const [navVisible, setNavVisible] = useState(false);
  const [savedMovie, setSavedMovie] = useState([]);
  const [searchedSaveMovies, setSearchedSaveMovies] = useState([]);
  const [searchWord, setSearchWord] = useState(false);
  const [searchedMoviesList, setSearchedMoviesList] = useState([]);
  const [searchedShortMoviesList, setSearchedShortMoviesList] = useState([]);
  const [message, setMessage] = useState(false);
  const [textMessage, setTextMessage] = useState('');

  
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
      loadMovieCards();
    }, 500)
  })

  function checkedButtonElse() {
    if (countCards > 3 && countOnPage < countCards) {
      setButtonElse(true);
    } else {
      setButtonElse(false);
    }
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
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }

  
  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      if (localStorage.getItem('shortMovies')) {
        setShortMovie(JSON.parse(localStorage.getItem('shortMovies')));
      }
    }
  }, [loggedIn])
  
  

  useEffect(() => {
    if (localStorage.getItem('searchWord')) {
      handleSearchMovies(localStorage.getItem('searchWord'));
    }
  }, [shortMovie])

  function toggleShortMovie() {
    setShortMovie(!shortMovie);
  }

  function handleSearchMovies(movieName) {
    setSearchedMoviesList([]);
    setSearchedShortMoviesList([]);
    setPreloader(true);
    moviesApi.getMovies()
    .then(allMovies => {
      if (allMovies) {
        if (shortMovie === true) {
          const res = allMovies.filter((movie) => {
            return movie.nameRU.toLowerCase().indexOf(movieName.toLowerCase()) !== -1 && movie.duration < 40;
          });
          setSearchedShortMoviesList(res);
          localStorage.setItem('searchedMoviesList', JSON.stringify(res));
          localStorage.setItem('searchWord', movieName);
          localStorage.setItem('shortMovies', shortMovie)
        } else {
          const res = allMovies.filter((movie) => {
            return movie.nameRU.toLowerCase().indexOf(movieName.toLowerCase()) !== -1;
          });
          setSearchedMoviesList(res);
          localStorage.setItem('searchedMoviesList', JSON.stringify(res));
          localStorage.setItem('searchWord', movieName);
          localStorage.setItem('shortMovies', shortMovie)
        }
      } else {
        setSearchMovies([]);
      }
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      setPreloader(false);
    })
  }

  useEffect(() => {
    if (loggedIn) {
      getSavedMovie();
    }
  }, [loggedIn])

  function getSavedMovie() {
    api.getMovies()
    .then((data) => {
      setSavedMovie(data);
    })
    .catch((err) => {
      console.log(err)
    });
  }

  useEffect(() => {
    if (loggedIn) {
      loadMovies();
    }    
  }, [loggedIn, searchedMoviesList, searchedShortMoviesList])

  useEffect(() => {
    if (loggedIn) {
      setCountCards(searchMovies.length);
    }
  }, [searchMovies])

  useEffect(() => {
    if (loggedIn) {
      checkedButtonElse();
    }
  }, [countCards])
  
  function loadMovies() {
    const searched = JSON.parse(localStorage.getItem('searchedMoviesList'));
    const searchWord = localStorage.getItem('searchWord');
    setSearchWord(searchWord);
    if (searched && searched !== []) {
      setSearchMovies(searched);
      
    }
  }

  function handleLoginUser(data) {
    api.authorize(data)
    .then((res) => {
      setLoggedIn(true);
      props.history.push('/movies');
    })
    .catch((err) => {
      console.log(err);
      setMessage(true);
      setTextMessage("Неправильный логин или пароль");
    })
    .finally(() => {
      setTimeout(() => {
        setMessage(false);
        setTextMessage('')
      }, 3000)
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
      setMessage(true);
      setTextMessage((err === 409) ? "Пользователь с таким email уже существует" : "Попробуйте еще раз");
    })
    .finally(() => {
      setTimeout(() => {
        setMessage(false);
        setTextMessage('')
      }, 3000)
    })
  }

  function handleChangeUser(data) {
    api.editProfile(data)
    .then((res) => {
      setCurrentUser(res);
      setMessage(true);
      setTextMessage('Данные успешно обновлены!');
    })
    .catch((err) => {
      console.log(err)
      setMessage(true);
      setTextMessage('Данные не обновлены! Попробуйте еще раз.')
    })
    .finally(() => {
      setTimeout(() => {
        setMessage(false);
        setTextMessage('')
      }, 3000)
    })
  }

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
    api.toggleSave(movie, isSaved, mov)
    .then(() => {
      api.getMovies()
      .then((data) => {
        setSavedMovie(data);
      })
      .catch((err) => {
        console.log(err);
      })
    })
    .catch((err) => {
      console.log(err.name);
    });
  }

  function toggleSaveShortMovie() {
    setShortSaveMovie(!shortSaveMovie);
  }

  useEffect(() => {
    handleSearchSavedMovies(searchedSaveWord);
  }, [shortSaveMovie])

  useEffect(() => {
    setSavedMovie(searchedSaveMovies);
  }, [searchedSaveMovies, shortSaveMovie])

  function handleSearchSavedMovies(movieName) {
    setSearchedSaveWord(movieName);
    setSearchedSaveMovies([]);
    setPreloader(true);
    api.getMovies()
    .then((data) => {
      if (shortSaveMovie) {
        const res = data.filter((movie) => {
          return movie.nameRU.toLowerCase().indexOf(movieName.toLowerCase()) !== -1 && movie.duration < 40;
        });
        setSearchedSaveMovies(res);
      } else {
        const res = data.filter((movie) => {
          return movie.nameRU.toLowerCase().indexOf(movieName.toLowerCase()) !== -1;
        });
        setSearchedSaveMovies(res);
      }
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      setPreloader(false);
    })
  }

  function logout() {
    api.logout()
    .then(() => {
      localStorage.removeItem('shortMovies');
      localStorage.removeItem('searchedMoviesList');
      localStorage.removeItem('searchWord');
      setSearchMovies([]);
      setCountCards(0);
      setShortMovie(false);
      setSavedMovie([]);
      setSearchedShortMoviesList([]);
      setSearchedMoviesList([]);
      setLoggedIn(false);
    })
    .catch((err) => {
      console.log(err.name);
    });
  }

  return (
    <CurrentUserContext.Provider value={currentUser} >
      <div className="page">
        <Switch>
          <Main
            exact
            path="/"
            loggedIn={loggedIn}
            handleNavbar={handleNavbar}
            closeNavbar={closeNavbar}
            navVisible={navVisible}
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
            onSaveMovie={handleMovieSave}
            savedMovie={savedMovie}
          />
          <ProtectedRoute 
            loggedIn={loggedIn}
            component={SavedMovies}
            path="/saved-movies"
            toggleShortMovie={toggleSaveShortMovie}
            savedMovie={savedMovie}
            cards={ savedMovie || [] }
            navVisible={navVisible}
            buttonElse={buttonElse}
            preloader={preloader}
            addCard={addCard}
            shortMovie={shortSaveMovie}
            handleNavbar={handleNavbar}
            onSaveMovie={handleMovieSave}
            searchMovies={handleSearchSavedMovies}
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
            textMessage={textMessage}
            message={message}
          />
          <Route path="/signin">
            <Login 
              onLoginUser={handleLoginUser} 
              textMessage={textMessage}
              message={message}
            />
          </Route>
          <Route path="/signup">
            <Register 
              onRegisterUser={handleRegisterUser}
              textMessage={textMessage}
              message={message}
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
