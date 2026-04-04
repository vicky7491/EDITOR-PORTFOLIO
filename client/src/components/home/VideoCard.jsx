// Video card for the featured videos section

import { useState } from 'react';
import { motion } from 'framer-motion';

const VideoCard = ({ video, index = 0, onPlay }) => {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
    onPlay?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative rounded-2xl overflow-hidden glass
                 hover:border-violet-500/20 transition-all duration-300"
    >
      {/* Aspect ratio wrapper */}
      <div className="aspect-video bg-night-900 relative overflow-hidden">

        {playing ? (
          <video
            src={video.videoUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            {/* Thumbnail */}
            {video.thumbnail?.url ? (
              <motion.img
                src={video.thumbnail.url}
                alt={video.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center
                              bg-night-800 text-night-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth={1} className="w-12 h-12">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            )}

            {/* Play button overlay */}
            <div className="absolute inset-0 bg-night-900/40 flex items-center
                            justify-center opacity-0 group-hover:opacity-100
                            transition-opacity duration-300">
              <motion.button
                onClick={handlePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full bg-violet-600/90
                           flex items-center justify-center
                           shadow-[0_0_40px_rgba(139,92,246,0.5)]"
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-1">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </motion.button>
            </div>

            {/* Duration badge */}
            {video.duration && (
              <div className="absolute bottom-2 right-2">
                <span className="text-[10px] font-mono bg-black/70
                                 text-white px-1.5 py-0.5 rounded">
                  {video.duration}
                </span>
              </div>
            )}

            {/* Category badge */}
            {video.category && (
              <div className="absolute top-2 left-2">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: `${video.category.color}25`,
                    color:       video.category.color,
                    border:      `1px solid ${video.category.color}40`,
                  }}
                >
                  {video.category.name}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-slate-200 group-hover:text-violet-300
                       transition-colors duration-300 line-clamp-1">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-2">
          {video.views > 0 && (
            <span className="text-[10px] text-slate-600">
              {video.views.toLocaleString()} views
            </span>
          )}
          <span className="text-[10px] text-slate-700">
            {new Date(video.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;