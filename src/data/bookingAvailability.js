function getDateKey(daysFromToday) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

const bookingAvailability = [
  {
    date: getDateKey(3),
    slots: [
      { time: '10:00', status: 'available' },
      { time: '12:00', status: 'busy' },
      { time: '14:00', status: 'available' },
      { time: '16:00', status: 'available' },
      { time: '18:00', status: 'busy' },
    ],
  },
  {
    date: getDateKey(4),
    slots: [
      { time: '10:00', status: 'busy' },
      { time: '12:00', status: 'available' },
      { time: '14:00', status: 'available' },
      { time: '16:00', status: 'busy' },
      { time: '18:00', status: 'available' },
    ],
  },
  {
    date: getDateKey(5),
    slots: [
      { time: '10:00', status: 'available' },
      { time: '12:00', status: 'available' },
      { time: '14:00', status: 'busy' },
      { time: '16:00', status: 'available' },
      { time: '18:00', status: 'busy' },
    ],
  },
];

export default bookingAvailability;
