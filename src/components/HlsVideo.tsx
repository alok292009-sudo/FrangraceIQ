import Hls from 'hls.js';
import React, { useEffect, useRef } from 'react';

interface HlsVideoProps {
  src: string;
  className?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  style?: React.CSSProperties;
}

export default function HlsVideo({
  src,
  className = '',
  poster = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  style = {},
}: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (src.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) video.play().catch(() => {});
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native support
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          if (autoPlay) video.play().catch(() => {});
        });
      }
    } else {
      video.src = src;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      style={style}
    />
  );
}
