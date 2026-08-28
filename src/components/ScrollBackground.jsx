import React, { useEffect, useRef, useState } from 'react';

function getScrollMetrics() {
  const app = document.querySelector('.app-shell');

  if (!app) {
    return {
      progress: 0,
      rectTop: 0,
      appHeight: 0,
      viewportHeight: window.innerHeight,
    };
  }

  const rect = app.getBoundingClientRect();
  const totalScrollableDistance = app.offsetHeight - window.innerHeight;
  const travelled = -rect.top;
  const progress = totalScrollableDistance > 0
    ? Math.min(1, Math.max(0, travelled / totalScrollableDistance))
    : 0;

  return {
    progress,
    rectTop: rect.top,
    appHeight: app.offsetHeight,
    viewportHeight: window.innerHeight,
  };
}

function ScrollBackground() {
  const [metrics, setMetrics] = useState({
    progress: 0,
    rectTop: 0,
    appHeight: 0,
    viewportHeight: 0,
  });
  const [videoTiming, setVideoTiming] = useState({
    currentTime: 0,
    duration: 0,
    readyState: 0,
    videoWidth: 0,
    videoHeight: 0,
    currentSrc: '',
    error: 'none',
  });
  const frameRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    function updateMetrics() {
      const nextMetrics = getScrollMetrics();
      const video = videoRef.current;

      setMetrics((currentMetrics) => (
        currentMetrics.progress === nextMetrics.progress
        && currentMetrics.rectTop === nextMetrics.rectTop
        && currentMetrics.appHeight === nextMetrics.appHeight
        && currentMetrics.viewportHeight === nextMetrics.viewportHeight
          ? currentMetrics
          : nextMetrics
      ));

      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        const targetTime = nextMetrics.progress === 0
          ? Math.min(0.1, video.duration)
          : nextMetrics.progress * video.duration;

        if (Math.abs(video.currentTime - targetTime) > 0.01 && !video.seeking) {
          video.currentTime = targetTime;
        }

        const nextVideoTiming = {
          currentTime: video.currentTime,
          duration: video.duration,
          readyState: video.readyState,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          currentSrc: video.currentSrc,
          error: video.error?.code || 'none',
        };

        setVideoTiming((currentTiming) => (
          currentTiming.currentTime === nextVideoTiming.currentTime
          && currentTiming.duration === nextVideoTiming.duration
          && currentTiming.readyState === nextVideoTiming.readyState
          && currentTiming.videoWidth === nextVideoTiming.videoWidth
          && currentTiming.videoHeight === nextVideoTiming.videoHeight
          && currentTiming.currentSrc === nextVideoTiming.currentSrc
          && currentTiming.error === nextVideoTiming.error
            ? currentTiming
            : nextVideoTiming
        ));
      }
    }

    function handleUpdate() {
      updateMetrics();
    }

    function animationLoop() {
      updateMetrics();
      frameRef.current = window.requestAnimationFrame(animationLoop);
    }

    window.addEventListener('scroll', handleUpdate, { passive: true });
    document.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    handleUpdate();
    frameRef.current = window.requestAnimationFrame(animationLoop);

    return () => {
      window.removeEventListener('scroll', handleUpdate);
      document.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

    };
  }, []);

  function handleLoadedMetadata() {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = Math.min(0.1, video.duration || 0.1);
    setVideoTiming({
      currentTime: video.currentTime,
      duration: Number.isFinite(video.duration) ? video.duration : 0,
      readyState: video.readyState,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      currentSrc: video.currentSrc,
      error: video.error?.code || 'none',
    });
  }

  return (
    <>
      <video
        ref={videoRef}
        className="scroll-video"
        preload="auto"
        muted
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        data-scroll-progress={metrics.progress}
        aria-hidden="true"
      >
        <source src={`${import.meta.env.BASE_URL}videos/flight.mp4`} type="video/mp4" />
      </video>
      <output className="scroll-progress-indicator" aria-live="off">
        SCROLL: {Math.round(metrics.progress * 100)}%
        <br />
        VIDEO: {videoTiming.currentTime.toFixed(2)} / {videoTiming.duration.toFixed(2)} sec
      </output>
    </>
  );
}

export default ScrollBackground;
