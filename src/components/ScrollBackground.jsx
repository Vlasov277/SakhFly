import React, { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 300;

const getFrameSrc = (index) => (
  `${import.meta.env.BASE_URL}frames/frame_${String(index + 1).padStart(3, '0')}.webp`
);

export default function ScrollBackground() {
  const [frameIndex, setFrameIndex] = useState(0);
  const rafRef = useRef(null);
  const preloadRef = useRef([]);

  useEffect(() => {
    preloadRef.current = Array.from(
      { length: FRAME_COUNT },
      (_, index) => {
        const image = new Image();
        image.src = getFrameSrc(index);
        return image;
      },
    );

    const updateFrame = () => {
      const shell = document.querySelector('.app-shell');
      if (!shell) return;

      const rect = shell.getBoundingClientRect();
      const shellHeight = shell.scrollHeight;
      const viewportHeight = window.innerHeight;
      const distance = Math.max(1, shellHeight - viewportHeight);
      const travelled = Math.max(0, -rect.top);
      const progress = Math.min(1, Math.max(0, travelled / distance));
      const nextFrame = Math.min(
        FRAME_COUNT - 1,
        Math.floor(progress * FRAME_COUNT),
      );

      setFrameIndex((current) => (
        current === nextFrame ? current : nextFrame
      ));
    };

    const handleScroll = () => {
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        updateFrame();
      });
    };

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        updateFrame();
      });
    });

    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      preloadRef.current = [];
    };
  }, []);

  return (
    <img
      className="scroll-frame"
      src={getFrameSrc(frameIndex)}
      alt=""
      aria-hidden="true"
    />
  );
}
