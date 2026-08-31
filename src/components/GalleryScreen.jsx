import React, { useEffect, useRef, useState } from 'react';
import flightArchive, { archiveMonths } from '../data/flightArchive';

const months = ['ЯНВАРЯ', 'ФЕВРАЛЯ', 'МАРТА', 'АПРЕЛЯ', 'МАЯ', 'ИЮНЯ', 'ИЮЛЯ', 'АВГУСТА', 'СЕНТЯБРЯ', 'ОКТЯБРЯ', 'НОЯБРЯ', 'ДЕКАБРЯ'];
const shortMonths = ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'];
const dateParts = (value) => { const [, m, d] = value.split('-').map(Number); return { day: d, month: months[m - 1], short: shortMonths[m - 1] }; };
const mediaCounts = (media) => ({ photos: media.filter((x) => x.type === 'image').length, videos: media.filter((x) => x.type === 'video').length });

function DayCard({ day, compact, active, onClick }) {
  const date = dateParts(day.date); const total = day.totals || mediaCounts(day.flights.flatMap((flight) => flight.media));
  const flightWord = day.flights.length === 6 ? 'полётов' : 'полёта';
  return <button className={`flight-day-card ${compact ? 'flight-day-card--compact' : ''} ${active ? 'is-active' : ''}`} type="button" onClick={onClick}>
    <img src={day.cover} alt="" /><span className="flight-day-shade" />
    <span className="flight-day-date"><strong>{date.day}</strong><small>{date.short}</small></span>
    <span className="flight-day-info"><strong>{day.location} · {day.period}</strong><span>{day.flights.length} {flightWord}</span>{!compact && <small>{total.photos} фото · {total.videos} видео</small>}</span>
  </button>;
}

function GalleryScreen() {
  const [galleryOpen, setGalleryOpen] = useState(false); const [month, setMonth] = useState('АВГ');
  const [dayIndex, setDayIndex] = useState(0); const [viewer, setViewer] = useState(null);
  const touchRef = useRef(null); const dayRefs = useRef([]); const selectedDay = flightArchive[dayIndex];
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
  const openGallery = (index = 0) => { setDayIndex(index); setGalleryOpen(true); };
  const selectDay = (index) => { setDayIndex(index); dayRefs.current[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); };
  const touchStart = (event) => { const t = event.touches[0]; touchRef.current = { x: t.clientX, y: t.clientY }; };
  const touchEnd = (event, action) => { if (!touchRef.current) return; const t = event.changedTouches[0]; const dx = t.clientX - touchRef.current.x; const dy = t.clientY - touchRef.current.y; touchRef.current = null; if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) action(dx > 0 ? -1 : 1); };

  return <section id="gallery" className="page-section gallery-section gallery-mode">
    <div className="hero-content gallery-page"><div className="gallery-teaser">
      <h2>НАЙДИ СЕБЯ<br />В НЕБЕ</h2><p>Каждый полёт остаётся здесь.</p><p>Найди свой день — и забери фото<br />и видео на память.</p>
      <div className="flight-days-preview">{flightArchive.map((day, i) => <DayCard key={day.date} day={day} onClick={() => openGallery(i)} />)}</div>
      <div className="gallery-swipe-hint">← листай дни →</div><button className="gallery-open-btn" type="button" onClick={() => openGallery()}>СМОТРЕТЬ ВСЕ ПОЛЁТЫ →</button>
    </div></div>
    {galleryOpen && <div className="flight-gallery" role="dialog" aria-modal="true" aria-label="Архив полётов">
      <header className="flight-gallery-header"><div><span>АРХИВ ПОЛЁТОВ</span><strong>2026</strong></div><button className="flight-gallery-close" type="button" aria-label="Закрыть галерею" onClick={() => setGalleryOpen(false)}>×</button>
        <nav className="month-nav">{archiveMonths.map((item) => <button key={item} className={month === item ? 'is-active' : ''} type="button" onClick={() => setMonth(item)}>{item}</button>)}</nav>
      </header>
      <main className="flight-gallery-body">{month !== 'АВГ' ? <div className="empty-month"><strong>{month}</strong><span>Полётов пока нет</span></div> : <>
        <div className="selected-day-title"><span>{date.day} {date.month}</span><small>{selectedDay.location} · {selectedDay.period}</small></div>
        <div className="day-carousel" onTouchStart={touchStart} onTouchEnd={(e) => touchEnd(e, (d) => selectDay(Math.max(0, Math.min(flightArchive.length - 1, dayIndex + d))))}>{flightArchive.map((day, i) => <div ref={(node) => { dayRefs.current[i] = node; }} key={day.date}><DayCard day={day} compact active={i === dayIndex} onClick={() => selectDay(i)} /></div>)}</div>
        <section className="day-flights"><div className="day-flights-heading"><h3>{date.day} {date.month}</h3><span>{selectedDay.flights.length} ПОЛЁТОВ</span></div>
          <div className="flight-carousel">{selectedDay.flights.map((flight, i) => { const total = mediaCounts(flight.media); return <button className="single-flight-card" type="button" key={flight.id} onClick={() => setViewer({ flightIndex: i, mediaIndex: 0 })}>
            <img src={flight.media.find((x) => x.type === 'image')?.src} alt="" /><span className="single-flight-shade" /><span className="single-flight-copy"><small>ПОЛЁТ {flight.id}</small><strong>{flight.time}</strong><span>{total.photos} фото · {total.videos} видео</span></span>
          </button>; })}</div>
        </section></>}</main>
      {activeMedia && <div className="media-viewer" role="dialog" aria-modal="true" onTouchStart={touchStart} onTouchEnd={(e) => touchEnd(e, moveMedia)}>
        <div className="media-viewer-meta">{date.day} {date.month} · {activeFlight.time}</div><button className="media-viewer-close" type="button" aria-label="Вернуться к дню" onClick={() => setViewer(null)}>×</button>
        <button className="media-arrow media-arrow--prev" type="button" onClick={() => moveMedia(-1)}>←</button><div className="media-stage">{activeMedia.type === 'video' ? <video src={activeMedia.src} controls playsInline preload="metadata" /> : <img src={activeMedia.src} alt={activeMedia.alt} />}</div><button className="media-arrow media-arrow--next" type="button" onClick={() => moveMedia(1)}>→</button><div className="media-counter">{viewer.mediaIndex + 1} / {activeFlight.media.length}</div>
      </div>}
    </div>}
  </section>;
}
export default GalleryScreen;
