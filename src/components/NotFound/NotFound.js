import { useHistory } from "react-router-dom";

function NotFound() {

  const history = useHistory();
  function redirectToPrev() {
    history.goBack();
  }

  return (
    <section className="not-found">
      <h1 className="not-found__title">404</h1>
      <p className="not-found__subtitle">Страница не найдена</p>
      <button onClick={redirectToPrev} className="not-found__link" type="button">Назад</button>
    </section>
  );
}

export default NotFound