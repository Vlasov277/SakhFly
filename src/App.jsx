import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import BookingScreen from './components/BookingScreen';
import GalleryScreen from './components/GalleryScreen';
import BottomNav from './components/BottomNav';
import bookingAvailability from './data/bookingAvailability';
import './styles.css';

function getWeekStart(weekOffset) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1 + weekOffset * 7);
  return date;
}

function App() {
  const [screen, setScreen] = useState('home');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [people, setPeople] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

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

  return (
    <div className="app-shell">
      <main className={`hero-card ${screen === 'home' ? 'home-mode' : ''} ${screen === 'book' ? 'booking-mode' : ''} ${screen === 'gallery' ? 'gallery-mode' : ''}`} role="main">
        {screen === 'home' && <HomeScreen onBook={() => setScreen('book')} />}
        {screen === 'book' && (
          <BookingScreen
            dates={dates} selectedDate={selectedDate} selectedTime={selectedTime}
            selectedDateData={selectedDateData} people={people} canSubmit={canSubmit}
            onChangeWeek={changeWeek} onSelectDate={selectDate} onSelectTime={setSelectedTime}
            onDecreasePeople={() => setPeople((current) => Math.max(1, current - 1))}
            onIncreasePeople={() => setPeople((current) => Math.min(4, current + 1))}
            onSubmit={submitBooking}
          />
        )}
        {screen === 'gallery' && <GalleryScreen />}

        <BottomNav screen={screen} onNavigate={setScreen} />

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
  );
}

export default App;
