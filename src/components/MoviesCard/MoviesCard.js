import { useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import baseLink from "../../utils/constants"

function MoviesCard(props) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = (props.path === '/movies') ? props.savedMovie.some(i => (i.owner === currentUser._id && i.movieId === props.elem.id)) : props.elem.owner === currentUser._id;
  const cardSaveButton = (
    `card__button ${(isOwn) && 'card__button_theme card__button_type_close'}`
  );

  
  
  const movieInfo = (props.path === '/movies') ? {
    country: props.elem.country,
    director: props.elem.director,
    duration: props.elem.duration,
    year: props.elem.year,
    description: props.elem.description,
    image: props.elem.image.url,
    trailerLink: props.elem.trailerLink,
    nameRU: props.elem.nameRU,
    nameEN: props.elem.nameEN,
    createdAt: props.elem.created_at,
    movieId: props.elem.id,
  } : {
      country: props.elem.country,
      director: props.elem.director,
      duration: props.elem.duration,
      year: props.elem.year,
      description: props.elem.description,
      image: props.elem.image,
      trailerLink: props.elem.trailerLink,
      nameRU: props.elem.nameRU,
      nameEN: props.elem.nameEN,
      createdAt: props.elem.created_at,
      movieId: props.elem.id,
      owner: props.elem.owner,
      _id: props.elem._id
  }

  function handleSaveMovie() {
    props.onSave(movieInfo); 
  }

  return (
    <li className="card">
      <a className="card__trailer" href={props.elem.trailerLink} target="_blank" rel="noreferrer" >
        <img src={`${baseLink}${(props.path === '/movies') ? props.elem.image.url : props.elem.image}`} alt="Обложка" className="card__image" />
      </a>
      <div className="card__info">
        <div className="card__info-container">
          <h2 className="card__title">{props.elem.nameRU}</h2>
          <p className="card__duration">{props.elem.duration}</p>
        </div>
        <button onClick={handleSaveMovie} className={cardSaveButton} aria-label=""></button>
      </div>
    </li>
  )
}

export default MoviesCard;