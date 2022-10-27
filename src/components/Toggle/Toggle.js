function Toggle(props) {
  return (
    <>
      <div className="toggle">
        <input id="toggle" onChange={props.toggleShortMovie} className={`toggle__checkbox toggle-round`} type="checkbox" checked={props.shortMovie}/>
        <label htmlFor="toggle" className='toggle__label'></label>
        <label className="toggle__params">Короткометражки</label>
      </div>
    </>
  );
}

export default Toggle;