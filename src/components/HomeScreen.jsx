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
  { title: 'ОПЫТ НЕ НУЖЕН', text: 'Перед стартом всё покажем и объясним' },
  { title: '10–20 МИНУТ', text: 'Полёт длится примерно 10–20 минут' },
  { title: 'ВСЁ ВКЛЮЧЕНО', text: 'Шлем и всё снаряжение уже включены' },
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
              Первый полёт не требует подготовки.<br />
              Ты летишь вместе с пилотом — остаётся<br />
              разбежаться, оторваться от земли<br />
              и получать удовольствие.
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
              <article className="first-flight-benefit" key={benefit.title}>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
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
