const base = import.meta.env.BASE_URL;
const photo = (number) => ({
  type: 'image', src: `${base}images/gallery/gallery-0${number}.webp`,
  alt: 'Полёт на параплане над Южно-Сахалинском',
});
const video = { type: 'video', src: `${base}videos/flight.mp4`, alt: 'Видео полёта на параплане' };
const makeFlight = (id, time, media) => ({ id, time, media });

const flightArchive = [
  { date: '2026-08-31', location: 'Большевик', period: 'вечер', cover: photo(1).src, totals: { photos: 38, videos: 9 }, flights: [
    makeFlight('01', '17:20', [photo(1), photo(2), photo(3), video]), makeFlight('02', '17:55', [photo(2), photo(4), video, photo(1), photo(3)]),
    makeFlight('03', '18:30', [photo(3), photo(1), photo(4)]), makeFlight('04', '19:05', [photo(4), photo(2), video]),
    makeFlight('05', '19:40', [photo(1), photo(3), photo(2)]), makeFlight('06', '20:15', [photo(2), photo(4), photo(1), video]),
  ] },
  { date: '2026-08-30', location: 'Большевик', period: 'день', cover: photo(2).src, totals: { photos: 27, videos: 6 }, flights: [
    makeFlight('01', '13:10', [photo(2), photo(1), video]), makeFlight('02', '13:45', [photo(3), photo(4), photo(2)]),
    makeFlight('03', '14:20', [photo(4), photo(1), video]), makeFlight('04', '14:55', [photo(1), photo(3), photo(2)]),
  ] },
  { date: '2026-08-29', location: 'Большевик', period: 'вечер', cover: photo(3).src, totals: { photos: 21, videos: 4 }, flights: [
    makeFlight('01', '17:40', [photo(3), photo(2), photo(1)]), makeFlight('02', '18:15', [photo(4), video, photo(3)]),
    makeFlight('03', '18:50', [photo(1), photo(4), photo(2)]),
  ] },
];

export const archiveMonths = ['ИЮЛ', 'АВГ', 'СЕН', 'ОКТ'];
export default flightArchive;
