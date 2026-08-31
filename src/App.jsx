import React, { useEffect, useRef, useState } from 'react';
import HomeScreen from './components/HomeScreen';
import BookingScreen from './components/BookingScreen';
import GalleryScreen from './components/GalleryScreen';
import bookingAvailability from './data/bookingAvailability';
import './styles.css';

const PILOT_TELEGRAM_URL = 'https://t.me/vlasov277';

function getWeekStart(weekOffset) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1 + weekOffset * 7);
  return date;
}

function App() {
  const videoRef = useRef(null);
  const [videoDiagnostics, setVideoDiagnostics] = useState({
    readyState: 0,
    networkState: 0,
    paused: true,
    currentTime: 0,
    error: 'none',
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [people, setPeople] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const updateDiagnostics = () => {
      setVideoDiagnostics({
        readyState: video.readyState,
        networkState: video.networkState,
        paused: video.paused,
        currentTime: Number.isFinite(video.currentTime) ? video.currentTime : 0,
        error: video.error ? `${video.error.code}: ${video.error.message || 'media error'}` : 'none',
      });
    };

    let touchFallbackActive = true;
    const attemptPlay = async (source) => {
      try {
        await video.play();
        console.log(`[flight-background] play succeeded: ${source}`);
        if (touchFallbackActive) {
          document.removeEventListener('touchstart', handleFirstTouch);
          touchFallbackActive = false;
        }
      } catch (error) {
        console.warn(`[flight-background] play failed: ${source}`, error);
      } finally {
        updateDiagnostics();
      }
    };
    const handleFirstTouch = () => attemptPlay('first touchstart');
    const events = ['loadedmetadata', 'canplay', 'playing', 'stalled', 'waiting', 'error'];
    const logEvent = (event) => {
      console.log(`[flight-background] ${event.type}`, {
        readyState: video.readyState,
        networkState: video.networkState,
        paused: video.paused,
        currentTime: video.currentTime,
        error: video.error,
      });
      updateDiagnostics();
    };

    events.forEach((eventName) => video.addEventListener(eventName, logEvent));
    document.addEventListener('touchstart', handleFirstTouch, { passive: true });
    attemptPlay('mount');

    const telegramWebApp = window.Telegram?.WebApp;
    if (telegramWebApp) {
      telegramWebApp.ready();
      attemptPlay('Telegram.WebApp.ready');
    }

    const diagnosticsTimer = window.setInterval(updateDiagnostics, 500);
    return () => {
      window.clearInterval(diagnosticsTimer);
      events.forEach((eventName) => video.removeEventListener(eventName, logEvent));
      if (touchFallbackActive) document.removeEventListener('touchstart', handleFirstTouch);
    };
  }, []);

  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = getWeekStart(weekOffset);
    date.setDate(date.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    const displayDate = new Date(`${key}T12:00:00`);
    const dateData = bookingAvailability.find((item) => item.date === key);
    return {
      key,
      isAvailable: Boolean(dateData),
      weekday: displayDate.toLocaleDateString('ru-RU', { weekday: 'short' }).replace('.', ''),
      dayNumber: displayDate.getDate(),
      month: displayDate.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', ''),
      slots: dateData?.slots ?? [],
    };
  });

  function changeWeek(offset) {
    setWeekOffset((currentOffset) => currentOffset + offset);
    setSelectedDate(null);
    setSelectedTime(null);
  }

  function selectDate(date) {
    setSelectedDate(date);
    setSelectedTime(null);
  }

  const selectedDateData = dates.find((date) => date.key === selectedDate);
  const selectedAvailability = bookingAvailability.find((item) => item.date === selectedDate);
  const isSelectedSlotAvailable = selectedAvailability?.slots.some(
    (slot) => slot.time === selectedTime && slot.status === 'available',
  );
  const canSubmit = Boolean(selectedAvailability && isSelectedSlotAvailable && people >= 1);

  function submitBooking() {
    if (!canSubmit) return;

    const booking = {
      date: selectedDate,
      time: selectedTime,
      people,
      status: 'pending',
    };

    console.log('booking', booking);
    setIsModalOpen(true);
  }

  function scrollToBooking() {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  }

  function openPilotChat() {
    const openTelegramLink = window.Telegram?.WebApp?.openTelegramLink;

    if (typeof openTelegramLink === 'function') {
      openTelegramLink.call(window.Telegram.WebApp, PILOT_TELEGRAM_URL);
      return;
    }

    window.location.href = PILOT_TELEGRAM_URL;
  }

  return (
    <>
      <video
        ref={videoRef}
        className="flight-background"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
      >
        <source
          src={`${import.meta.env.BASE_URL}flight-bg.mp4`}
          type="video/mp4"
        />
      </video>
      <output className="video-diagnostics" aria-live="polite">
        <strong>VIDEO</strong>
        <span>readyState: {videoDiagnostics.readyState}</span>
        <span>networkState: {videoDiagnostics.networkState}</span>
        <span>paused: {String(videoDiagnostics.paused)}</span>
        <span>currentTime: {videoDiagnostics.currentTime.toFixed(2)}</span>
        <span>error: {videoDiagnostics.error}</span>
      </output>
      <div className="app-shell">
        <main className="hero-card" role="main">
          <HomeScreen onBook={scrollToBooking} />
          <BookingScreen
            dates={dates} selectedDate={selectedDate} selectedTime={selectedTime}
            selectedDateData={selectedDateData} people={people} canSubmit={canSubmit}
            onChangeWeek={changeWeek} onSelectDate={selectDate} onSelectTime={setSelectedTime}
            onDecreasePeople={() => setPeople((current) => Math.max(1, current - 1))}
            onIncreasePeople={() => setPeople((current) => Math.min(4, current + 1))}
            onSubmit={submitBooking}
          />

          <section className="flight-transition" aria-label="Оставим тебе кое-что на память">
            <div className="flight-route" aria-hidden="true">
              <span>⌄</span>
              <i />
              <span>⌄</span>
            </div>
            <p>Оставим тебе кое-что на память</p>
          </section>

          <GalleryScreen />

          <section id="contacts" className="contacts-section" aria-labelledby="contacts-title">
            <div className="contacts-content">
              <h2 id="contacts-title">НУ ЧТО,<br />ПОЛЕТЕЛИ?</h2>
              <p>Остались вопросы — напиши.<br />Расскажу про погоду, одежду и сам полёт.</p>
              <button className="secondary-btn" type="button" onClick={openPilotChat}>НАПИСАТЬ ПИЛОТУ →</button>
            </div>
          </section>

          {isModalOpen && (
            <div className="modal-backdrop" role="presentation">
              <div className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
                <h2 id="confirmation-title">Есть! Ты в списке 🪂</h2>
                <p>Осталось дождаться полётов</p>
                <button className="primary-btn modal-button" type="button" onClick={() => setIsModalOpen(false)}>Отлично</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
