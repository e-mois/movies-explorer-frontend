function Toggle(props) {
  return (
    <>
      <div className="toggle">
        <input id="toggle" onClick={props.toggleShortMovie} className={`toggle__checkbox toggle-round ${props.shortMovie && 'toggle-round_checked'}`} type="checkbox" />
        <label htmlFor="toggle" className="toggle__label "></label>
        <label className="toggle__params">Короткометражки</label>
      </div>
    </>
  );
}

export default Toggle;