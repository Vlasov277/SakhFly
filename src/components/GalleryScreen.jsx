import React, { useEffect, useRef, useState } from 'react';

const galleryItems = [
  { id: 'gallery-01', src: `${import.meta.env.BASE_URL}images/gallery/gallery-01.webp`, alt: 'Полёт на параплане — фотография 1', type: 'image' },
  { id: 'gallery-02', src: `${import.meta.env.BASE_URL}images/gallery/gallery-02.webp`, alt: 'Полёт на параплане — фотография 2', type: 'image' },
  { id: 'gallery-03', src: `${import.meta.env.BASE_URL}images/gallery/gallery-03.webp`, alt: 'Полёт на параплане — фотография 3', type: 'image' },
  { id: 'gallery-04', src: `${import.meta.env.BASE_URL}images/gallery/gallery-04.webp`, alt: 'Полёт на параплане — фотография 4', type: 'image' },
];

function GalleryScreen() {
  const [activeIndex, setActiveIndex] = useState(null);
  const touchStartRef = useRef(null);
  const isOpen = activeIndex !== null;

  function closeGallery() {
    setActiveIndex(null);
  }

  function showPrevious() {
    setActiveIndex((current) => (
      current === null ? 0 : (current - 1 + galleryItems.length) % galleryItems.length
    ));
  }

  function showNext() {
    setActiveIndex((current) => (
      current === null ? 0 : (current + 1) % galleryItems.length
    ));
  }

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    function handleKeyDown(event) {
      if (event.key === 'Escape') closeGallery();
      if (event.key === 'ArrowLeft') showPrevious();
      if (event.key === 'ArrowRight') showNext();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  function handleTouchStart(event) {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event) {
    if (!touchStartRef.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    if (deltaX > 0) showPrevious();
    else showNext();
  }

  const activeItem = isOpen ? galleryItems[activeIndex] : null;

  return (
    <section id="gallery" className="page-section gallery-section gallery-mode">
      <section className="hero-content gallery-page">
        <div className="gallery-teaser">
          <h2>НАЙДИ СЕБЯ<br />В НЕБЕ</h2>
          <p>После полёта здесь появляются фотографии<br />и видео наших пассажиров.</p>
          <p>Уже летал со мной?<br />Загляни — возможно, найдёшь здесь себя.</p>

          <div className="gallery-preview-strip" aria-label="Превью фотографий с полётов">
            {galleryItems.map((item, index) => (
              <button
                className="gallery-preview-card"
                type="button"
                key={item.id}
                onClick={() => setActiveIndex(index)}
                aria-label={`Открыть: ${item.alt}`}
              >
                <img src={item.src} alt="" />
              </button>
            ))}
          </div>
          <div className="gallery-swipe-hint">← листай →</div>

          <button className="gallery-open-btn" type="button" onClick={() => setActiveIndex(0)}>
            Смотреть все фото и видео →
          </button>
        </div>
      </section>

      {activeItem && (
        <div
          className="gallery-viewer"
          role="dialog"
          aria-modal="true"
          aria-label="Фото и видео полётов"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className="gallery-viewer-close" type="button" aria-label="Закрыть галерею" onClick={closeGallery}>×</button>
          <div className="gallery-viewer-counter">{activeIndex + 1} / {galleryItems.length}</div>

          <button className="gallery-viewer-arrow gallery-viewer-arrow--previous" type="button" aria-label="Предыдущее фото" onClick={showPrevious}>←</button>

          <div className="gallery-viewer-media">
            {activeItem.type === 'video' ? (
              <video src={activeItem.src} controls playsInline />
            ) : (
              <img src={activeItem.src} alt={activeItem.alt} />
            )}
          </div>

          <button className="gallery-viewer-arrow gallery-viewer-arrow--next" type="button" aria-label="Следующее фото" onClick={showNext}>→</button>
        </div>
      )}
    </section>
  );
}

export default GalleryScreen;
