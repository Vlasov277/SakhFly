import React, { useState } from 'react';

const galleryItems = [
  { id: 'gallery-01', src: `${import.meta.env.BASE_URL}images/gallery/gallery-01.webp`, alt: 'Полёт на параплане — фотография 1' },
  { id: 'gallery-02', src: `${import.meta.env.BASE_URL}images/gallery/gallery-02.webp`, alt: 'Полёт на параплане — фотография 2' },
  { id: 'gallery-03', src: `${import.meta.env.BASE_URL}images/gallery/gallery-03.webp`, alt: 'Полёт на параплане — фотография 3' },
  { id: 'gallery-04', src: `${import.meta.env.BASE_URL}images/gallery/gallery-04.webp`, alt: 'Полёт на параплане — фотография 4' },
];

function GalleryScreen() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <section id="gallery" className="page-section gallery-section gallery-mode">
      <div className="hero-overlay" />
      <section className="hero-content gallery-page">
        <header className="gallery-header">
          <h2>Галерея</h2>
          <p>Как это выглядит с высоты</p>
        </header>

        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <button
              className="gallery-tile"
              type="button"
              key={item.id}
              onClick={() => setSelectedItem(item)}
              aria-label={`Открыть фотографию: ${item.alt}`}
            >
              <img src={item.src} alt={item.alt} />
            </button>
          ))}
        </div>
      </section>

      {selectedItem && (
        <div className="gallery-lightbox" role="presentation" onClick={() => setSelectedItem(null)}>
          <button
            className="lightbox-close"
            type="button"
            aria-label="Закрыть фотографию"
            onClick={() => setSelectedItem(null)}
          >
            ×
          </button>
          <img
            src={selectedItem.src}
            alt={selectedItem.alt}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}

export default GalleryScreen;
