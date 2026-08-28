import React from 'react';

const benefits = [
  {
    title: 'Безопасно',
    text: 'опытный пилот и проверенное оборудование',
  },
  {
    title: '10–20 минут',
    text: 'время полёта зависит от погоды и ветра',
  },
  {
    title: 'Впечатления',
    text: 'незабываемые виды на город, море и горы',
  },
];

function HomeScreen({ onBook }) {
  return (
    <section id="home" className="page-section home-section home-mode">
      <div className="hero-overlay" />

      <section className="hero-content">
        <div className="hero">
          <div className="hero-badge">Тандемные полёты</div>
          <h1>Тандемные полёты</h1>
          <p className="hero-subtitle">над Южно-Сахалинском</p>
          <div className="location-pill">гора Большевик</div>
        </div>

        <div className="bottom-content">
          <div className="info-banner">
            <p className="banner-title">Сегодня летаем!</p>
            <p className="banner-text">Есть 2 свободных окна после 16:00</p>
          </div>

          <button className="primary-btn" onClick={onBook}>Записаться на полёт</button>

          <div className="benefits-grid">
            {benefits.map((item) => (
              <article key={item.title} className="benefit-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <button className="secondary-btn">Написать пилоту</button>
        </div>
      </section>
    </section>
  );
}

export default HomeScreen;
