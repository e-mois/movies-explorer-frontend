import avatar from '../../images/aboutmelogo.jpg'
import Portfolio from '../Portfolio/Portfolio';

function AboutMe() {
  return (
    <section className="about-me">
      <div className='about-me__content'>
        <h2 className="about-me__title">Студент</h2>
        <div className="about-me__card">
          <div className="about-me__info">
            <div className='about-me__card-info'>
              <h2 className="about-me__card-title">Евгений</h2>
              <p className='about-me__card-subtitle'>Фронтенд-разработчик, 30 лет</p>
              <p className='about-me__card-text'>Бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла бла</p>
            </div>
            <a href='https://github.com/e-mois' className='about-me__link'>Github</a>
          </div>
          <img className="about-me__photo" alt="Аватар" src={avatar} />
        </div>
        <Portfolio />
      </div>
    </section>
  );
}

export default AboutMe;