import MoviesCard from "../MoviesCard/MoviesCard";

function MoviesCardList(props) {

  // const moviesArray = props.saved ? movies.filter(movie => movie.active === true) : movies; 

  return (
    <section className="movies" aria-label="Галерея">
      <div className="movies__content">
        <ul className="movies__list">
          {props.moviesList.map((movie) => (
            <MoviesCard 
              key={movie.id} 
              elem={movie}
              onSave={props.onSave}
              savedMovie={props.savedMovie}
              path={props.path}
            />
          ))}
        </ul>
        <button className={`movies__button ${props.buttonElse && (props.path === '/movies') && 'movies__button_active'}`} onClick={props.addCard} type="button">Ещё</button>
      </div>
    </section>
  );
}

export default MoviesCardList;