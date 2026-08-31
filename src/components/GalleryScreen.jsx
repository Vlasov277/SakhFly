import React, { useEffect, useRef, useState } from 'react';
import flightArchive, { archiveMonths } from '../data/flightArchive';

const months = ['ЯНВАРЯ', 'ФЕВРАЛЯ', 'МАРТА', 'АПРЕЛЯ', 'МАЯ', 'ИЮНЯ', 'ИЮЛЯ', 'АВГУСТА', 'СЕНТЯБРЯ', 'ОКТЯБРЯ', 'НОЯБРЯ', 'ДЕКАБРЯ'];
const dateParts = (value) => { const [, m, d] = value.split('-').map(Number); return { day: d, month: months[m - 1] }; };
const mediaCounts = (media) => ({ photos: media.filter((x) => x.type === 'image').length, videos: media.filter((x) => x.type === 'video').length });

function FlightsRow({ day, onOpenFlight }) {
  const date = dateParts(day.date);
  const flightWord = day.flights.length === 6 ? 'ПОЛЁТОВ' : 'ПОЛЁТА';
  return <section className="day-flights">
    <div className="day-flights-heading"><h3>{date.day} {date.month}</h3><span>{day.flights.length} {flightWord}</span></div>
    <div className="flight-carousel">{day.flights.map((flight, index) => {
      const total = mediaCounts(flight.media);
      return <button className="single-flight-card" type="button" key={flight.id} onClick={() => onOpenFlight(index)}>
        <img src={flight.media.find((item) => item.type === 'image')?.src} alt="" /><span className="single-flight-shade" />
        <span className="single-flight-copy"><small>ПОЛЁТ {flight.id}</small><strong>{flight.time}</strong><span>{total.photos} фото · {total.videos} видео</span></span>
      </button>;
    })}</div>
  </section>;
}

function GalleryScreen() {
  const [galleryOpen, setGalleryOpen] = useState(false); const [month, setMonth] = useState('АВГ');
  const [dayIndex, setDayIndex] = useState(0); const [viewer, setViewer] = useState(null);
  const touchRef = useRef(null); const selectedDay = flightArchive[dayIndex];
  const date = dateParts(selectedDay.date); const activeFlight = viewer ? selectedDay.flights[viewer.flightIndex] : null;
  const activeMedia = activeFlight?.media[viewer?.mediaIndex];

  function moveMedia(delta) { setViewer((current) => current && ({ ...current, mediaIndex: (current.mediaIndex + delta + selectedDay.flights[current.flightIndex].media.length) % selectedDay.flights[current.flightIndex].media.length })); }
  useEffect(() => {
    if (!galleryOpen) return undefined;
    const y = window.scrollY; const old = { position: document.body.style.position, top: document.body.style.top, width: document.body.style.width };
    Object.assign(document.body.style, { position: 'fixed', top: `-${y}px`, width: '100%' });
    return () => { Object.assign(document.body.style, old); window.scrollTo(0, y); };
  }, [galleryOpen]);
  useEffect(() => {
    if (!galleryOpen) return undefined;
    const keys = (event) => { if (event.key === 'Escape') viewer ? setViewer(null) : setGalleryOpen(false); if (viewer && event.key === 'ArrowLeft') moveMedia(-1); if (viewer && event.key === 'ArrowRight') moveMedia(1); };
    window.addEventListener('keydown', keys);
    return () => window.removeEventListener('keydown', keys);
  }, [galleryOpen, viewer]);
  const openGallery = () => { setViewer(null); setGalleryOpen(true); };
  const openFlight = (selectedDayIndex, flightIndex) => { setDayIndex(selectedDayIndex); setViewer({ flightIndex, mediaIndex: 0 }); setGalleryOpen(true); };
  const touchStart = (event) => { const t = event.touches[0]; touchRef.current = { x: t.clientX, y: t.clientY }; };
  const touchEnd = (event, action) => { if (!touchRef.current) return; const t = event.changedTouches[0]; const dx = t.clientX - touchRef.current.x; const dy = t.clientY - touchRef.current.y; touchRef.current = null; if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) action(dx > 0 ? -1 : 1); };

  return <section id="gallery" className="page-section gallery-section gallery-mode">
    <div className="hero-content gallery-page"><div className="gallery-teaser">
      <h2>НАЙДИ СЕБЯ<br />В НЕБЕ</h2><p>Каждый полёт остаётся здесь.</p><p>Найди свой день — и забери фото<br />и видео на память.</p>
      <div className="gallery-archive-list">{flightArchive.map((day, index) => <FlightsRow key={day.date} day={day} onOpenFlight={(flightIndex) => openFlight(index, flightIndex)} />)}</div>
      <div className="gallery-swipe-hint">← листай полёты →</div><button className="gallery-open-btn" type="button" onClick={openGallery}>СМОТРЕТЬ ВСЕ ПОЛЁТЫ →</button>
    </div></div>
    {galleryOpen && <div className="flight-gallery" role="dialog" aria-modal="true" aria-label="Архив полётов">
      <header className="flight-gallery-header"><div><span>АРХИВ ПОЛЁТОВ</span><strong>2026</strong></div><button className="flight-gallery-close" type="button" aria-label="Закрыть галерею" onClick={() => setGalleryOpen(false)}>×</button>
        <nav className="month-nav">{archiveMonths.map((item) => <button key={item} className={month === item ? 'is-active' : ''} type="button" onClick={() => setMonth(item)}>{item}</button>)}</nav>
      </header>
      <main className="flight-gallery-body">{month !== 'АВГ' ? <div className="empty-month"><strong>{month}</strong><span>Полётов пока нет</span></div> : <div className="gallery-archive-list">{flightArchive.map((day, index) => <FlightsRow key={day.date} day={day} onOpenFlight={(flightIndex) => openFlight(index, flightIndex)} />)}</div>}</main>
      {activeMedia && <div className="media-viewer" role="dialog" aria-modal="true" onTouchStart={touchStart} onTouchEnd={(e) => touchEnd(e, moveMedia)}>
        <div className="media-viewer-meta">{date.day} {date.month} · {activeFlight.time}</div><button className="media-viewer-close" type="button" aria-label="Вернуться к дню" onClick={() => setViewer(null)}>×</button>
        <button className="media-arrow media-arrow--prev" type="button" onClick={() => moveMedia(-1)}>←</button><div className="media-stage">{activeMedia.type === 'video' ? <video src={activeMedia.src} controls playsInline preload="metadata" /> : <img src={activeMedia.src} alt={activeMedia.alt} />}</div><button className="media-arrow media-arrow--next" type="button" onClick={() => moveMedia(1)}>→</button><div className="media-counter">{viewer.mediaIndex + 1} / {activeFlight.media.length}</div>
      </div>}
    </div>}
  </section>;
}
export default GalleryScreen;
