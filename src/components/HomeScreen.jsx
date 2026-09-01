import React from 'react';
import { FLIGHT_PRICE } from '../data/pricing';

const flightSteps = [
  {
    number: '01',
    title: 'ВСТРЕЧАЕМСЯ',
    text: 'На старте знакомимся и надеваем снаряжение.',
  },
  {
    number: '02',
    title: 'РАЗБЕГАЕМСЯ ВМЕСТЕ',
    text: 'Несколько шагов — и земля остаётся внизу.',
  },
  {
    number: '03',
    title: 'ЛЕТИМ',
    text: 'Дальше просто смотри по сторонам и кайфуй.',
  },
];

const firstFlightBenefits = [
  'Опыт не нужен',
  'Полёт 10–20 минут',
  'Всё снаряжение включено',
];

function FlightTransition({ children }) {
  return (
    <section className="flight-transition" aria-label={children}>
      <div className="flight-route" aria-hidden="true">
        <span>⌄</span>
        <i />
        <span>⌄</span>
      </div>
      <p>{children}</p>
    </section>
  );
}

function HomeScreen({ onBook }) {
  return (
    <>
      <section id="home" className="page-section home-section home-mode">
        <section className="hero-content home-intro">
          <div className="hero intro-copy">
            <h1>ГОТОВ ВЗГЛЯНУТЬ<br />НА ГОРОД СВЕРХУ?</h1>
            <p className="hero-description">
              Город остаётся внизу.<br />
              Рядом — только ветер, горы и небо.<br />
              На несколько минут ты оказываешься там,<br />
              где обычно летают только птицы.
            </p>
            <p className="hero-location">Южно-Сахалинск · гора Большевик</p>
            <button className="primary-btn" type="button" onClick={onBook}>Записаться на полёт</button>
          </div>

          <div className="scroll-hint">
            <strong>ЛИСТАЙ ВНИЗ</strong>
            <span className="scroll-hint-arrow" aria-hidden="true">↓</span>
            <span>покажу, как проходит полёт</span>
          </div>
        </section>
      </section>

      <FlightTransition>Несколько шагов — и ты уже в воздухе</FlightTransition>

      <section className="page-section first-flight-section" aria-labelledby="first-flight-title">
        <div className="first-flight-content">
          <h2 id="first-flight-title">ТВОЙ ПЕРВЫЙ<br />ПОЛЁТ</h2>

          <div className="flight-steps">
            {flightSteps.map((step) => (
              <article className="flight-step" key={step.number}>
                <div className="flight-step-number">{step.number}</div>
                <div className="flight-step-copy">
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="first-flight-benefits">
            {firstFlightBenefits.map((benefit) => (
              <article className="first-flight-benefit" key={benefit}>
                <h3>{benefit}</h3>
              </article>
            ))}
          </div>

          <div className="flight-price" aria-label={`Стоимость полёта ${FLIGHT_PRICE} за человека`}>
            <span>СТОИМОСТЬ ПОЛЁТА</span>
            <div><strong>{FLIGHT_PRICE}</strong><small>за человека</small></div>
          </div>
        </div>
      </section>

      <FlightTransition>А дальше начинается самое интересное</FlightTransition>
    </>
  );
}

export default HomeScreen;
