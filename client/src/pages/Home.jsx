import { Helmet } from 'react-helmet-async';
import { useSite } from '@/context/SiteContext';

import Hero                from '@/components/home/Hero';
import Showreel            from '@/components/home/Showreel';
import FeaturedProjects    from '@/components/home/FeaturedProjects';
import StatsBar            from '@/components/home/StatsBar';
import ServicesPreview     from '@/components/home/ServicesPreview';
import TestimonialsPreview from '@/components/home/TestimonialsPreview';
import ContactCTA          from '@/components/home/ContactCTA';

const Home = () => {
  const { settings } = useSite();
  const { seo }      = settings;

  return (
    <>
      <Helmet>
        <title>{seo?.defaultTitle || settings.siteTitle || 'CineEdit'}</title>
        <meta name="description" content={seo?.description || ''}/>
        <meta name="keywords"    content={seo?.keywords    || ''}/>
        {seo?.ogImage && <meta property="og:image" content={seo.ogImage}/>}
      </Helmet>

      <Hero/>
      <StatsBar/>
      <Showreel/>
      <FeaturedProjects/>
      <ServicesPreview/>
      <TestimonialsPreview/>
      <ContactCTA/>
    </>
  );
};

export default Home;