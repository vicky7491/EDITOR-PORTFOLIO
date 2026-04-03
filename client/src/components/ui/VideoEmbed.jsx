// Smart video embed — handles Cloudinary, YouTube, Vimeo, raw video URL

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── URL detection ─────────────────────────────────────────────────────────────
const detectType = (url) => {
  if (!url) return 'unknown';
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/vimeo\.com/.test(url))             return 'vimeo';
  if (/cloudinary\.com/.test(url))        return 'cloudinary';
  if (/\.(mp4|webm|ogg|mov)$/i.test(url)) return 'native';
  return 'native';
};

const getYouTubeId = (url) => {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return m?.[1] || null;
};

const getVimeoId = (url) => {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m?.[1] || null;
};

const PlayButton = ({ onClick, size = 'lg' }) => {
  const sz = size === 'sm' ? 'w-12 h-12' : 'w-20 h-20';
  const ic = size === 'sm' ? 'w-5 h-5'  : 'w-8 h-8';
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${sz} rounded-full bg-violet-600 flex items-center justify-center
                  shadow-[0_0_40px_rgba(139,92,246,0.6)]
                  hover:shadow-[0_0_60px_rgba(139,92,246,0.8)]
                  transition-shadow duration-300`}
    >
      <svg viewBox="0 0 24 24" fill="white" className={`${ic} ml-1`}>
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    </motion.button>
  );
};

const VideoEmbed = ({
  url,
  poster,
  title      = '',
  autoPlay   = false,
  className  = '',
  controls   = true,
  loop       = false,
  muted      = false,
  playButton = true, // show custom play overlay
  onPlay,
}) => {
  const [playing, setPlaying] = useState(autoPlay);
  const type = detectType(url);

  const handlePlay = () => {
    setPlaying(true);
    onPlay?.();
  };

  if (!url) {
    return (
      <div className={`aspect-video rounded-2xl bg-night-800 flex items-center
                       justify-center text-night-600 ${className}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth={1} className="w-12 h-12">
          <polygon points="23 7 16 12 23 17 23 7"/>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
      </div>
    );
  }

  // ── YouTube ──────────────────────────────────────────────────────────────────
  if (type === 'youtube') {
    const id = getYouTubeId(url);
    if (!id) return null;

    const thumbUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

    return (
      <div className={`relative aspect-video rounded-2xl overflow-hidden
                       bg-black ${className}`}>
        {!playing ? (
          <>
            <img src={thumbUrl} alt={title}
                 className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-black/40 flex items-center
                            justify-center">
              {playButton && <PlayButton onClick={handlePlay}/>}
            </div>
          </>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media;
                   gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        )}
      </div>
    );
  }

  // ── Vimeo ────────────────────────────────────────────────────────────────────
  if (type === 'vimeo') {
    const id = getVimeoId(url);
    if (!id) return null;

    return (
      <div className={`relative aspect-video rounded-2xl overflow-hidden
                       bg-black ${className}`}>
        {!playing ? (
          <div className="w-full h-full flex items-center justify-center bg-night-900">
            {playButton && <PlayButton onClick={handlePlay}/>}
          </div>
        ) : (
          <iframe
            src={`https://player.vimeo.com/video/${id}?autoplay=1&color=8b5cf6`}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        )}
      </div>
    );
  }

  // ── Cloudinary / Native ───────────────────────────────────────────────────────
  return (
    <div className={`relative aspect-video rounded-2xl overflow-hidden
                     bg-black ${className}`}>
      {!playing && poster && playButton ? (
        <>
          <img src={poster} alt={title}
               className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-black/40 flex items-center
                          justify-center">
            <PlayButton onClick={handlePlay}/>
          </div>
        </>
      ) : (
        <video
          src={url}
          poster={poster}
          controls={controls}
          autoPlay={playing}
          loop={loop}
          muted={muted}
          playsInline
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
};

export default VideoEmbed;