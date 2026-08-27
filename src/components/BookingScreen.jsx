import React from 'react';

function BookingScreen({
  dates,
  selectedDate,
  selectedTime,
  selectedDateData,
  people,
  canSubmit,
  onChangeWeek,
  onSelectDate,
  onSelectTime,
  onDecreasePeople,
  onIncreasePeople,
  onSubmit,
}) {
  return (
    <>
      <div className="hero-overlay" />

      <section className="hero-content booking">
        <div className="booking-header">
          <h2>Запись на полёт</h2>
        </div>

        <div className="booking-body">
          <div className="week-controls">
            <button type="button" className="week-arrow" onClick={() => onChangeWeek(-1)} aria-label="Предыдущая неделя">
              ← <span>Предыдущая неделя</span>
            </button>
            <button type="button" className="week-arrow" onClick={() => onChangeWeek(1)} aria-label="Следующая неделя">
              <span>Следующая неделя</span> →
            </button>
          </div>

          <div className="dates-row">
            {dates.map((date) => (
              <button
                key={date.key}
                type="button"
                className={`date-btn ${date.isAvailable ? 'available' : 'unavailable'} ${selectedDate === date.key ? 'active' : ''}`}
                onClick={() => date.isAvailable && onSelectDate(date.key)}
                disabled={!date.isAvailable}
                aria-pressed={selectedDate === date.key}
              >
                <span className="date-weekday">{date.weekday}</span>
                <strong className="date-number">{date.dayNumber}</strong>
                <span className="date-month">{date.month}</span>
              </button>
            ))}
          </div>

          <div className="dates-legend" aria-label="Легенда доступности дат">
            <span><i className="legend-dot legend-dot--available" />Зелёный — доступно для записи</span>
            <span><i className="legend-dot legend-dot--unavailable" />Серый — пока недоступно</span>
          </div>

          <div className="booking-lower">
            {selectedDateData && (
              <div className="slots-section">
                <h3 className="slots-heading">Свободное время</h3>
                <div className="times-grid">
                  {selectedDateData.slots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      className={`time-btn time-btn--${slot.status} ${selectedTime === slot.time ? 'active' : ''}`}
                      onClick={() => slot.status === 'available' && onSelectTime(slot.time)}
                      disabled={slot.status === 'busy'}
                      aria-pressed={selectedTime === slot.time}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="people-row">
              <div className="people-label">Количество людей</div>
              <div className="people-controls">
                <button type="button" className="icon-btn" onClick={onDecreasePeople} aria-label="Уменьшить">−</button>
                <div className="people-count">{people}</div>
                <button type="button" className="icon-btn" onClick={onIncreasePeople} aria-label="Увеличить">+</button>
              </div>
            </div>

            <div className="booking-actions">
              <button className="primary-btn full" onClick={onSubmit} disabled={!canSubmit}>
                Отправить заявку
              </button>

              <p className="booking-note">Полёт зависит от погодных условий. Окончательно подтверждаем ближе к дате.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BookingScreen;
