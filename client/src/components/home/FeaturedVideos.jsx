// Featured videos row on the homepage

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getFeaturedVideos } from '@/api/publicApi';
import { incrementVideoView } from '@/api/publicApi';
import ScrollReveal  from '@/components/animations/ScrollReveal';
import VideoCard     from './VideoCard';

const FeaturedVideos = () => {
  const [videos,    setVideos]    = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFeaturedVideos(4)
      .then((r) => setVideos(r.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (!isLoading && videos.length === 0) return null;

  return (
    <section className="section bg-night-800">
      <ScrollReveal variant="fadeUp" className="mb-12">
        <span className="section-tag">
          <span className="w-6 h-px bg-violet-400"/>
          Watch
        </span>
        <h2 className="font-display text-title text-white uppercase">
          Featured Videos
        </h2>
      </ScrollReveal>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-video rounded-2xl bg-night-900 animate-pulse"/>
          ))}
        </div>
      ) : (
        <ScrollReveal variant="fadeUp" stagger={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {videos.map((video, i) => (
              <VideoCard
                key={video._id}
                video={video}
                index={i}
                onPlay={() => incrementVideoView(video._id).catch(() => {})}
              />
            ))}
          </div>
        </ScrollReveal>
      )}
    </section>
  );
};

export default FeaturedVideos;