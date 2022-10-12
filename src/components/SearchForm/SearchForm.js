import Toggle from "../Toggle/Toggle";

function SearchForm() {
  return (
    <section className="search-form">
      <div className='search-form__content'>
        <div className="search-form__block">
          <div className="search-form__logo"></div>
          <input className="search-form__input" value="Фильм" />
          <button className="search-form__button"></button>
        </div>
        <div className="search-form__toggle">
          <Toggle />
        </div>
      </div>
    </section>
  )
}

export default SearchForm;