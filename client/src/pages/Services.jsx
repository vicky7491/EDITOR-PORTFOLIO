import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getServices } from '@/api/publicApi';
import { useSite } from '@/context/SiteContext';
import { staggerContainer, staggerItem } from '@/utils/motion';

const Services = () => {
  const { settings }  = useSite();
  const [services,  setServices]  = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((r) => setServices(r.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Services — {settings.siteTitle || 'CineEdit'}</title>
        <meta name="description" content="Professional video editing services tailored to your brand."/>
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-night-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-violet-600/8
                        via-transparent to-transparent pointer-events-none"/>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-tag">
              <span className="w-6 h-px bg-violet-400"/>
              What I Offer
            </span>
            <h1 className="font-display text-title text-white uppercase">
              Services
            </h1>
            <p className="text-slate-500 max-w-xl mt-3 text-sm leading-relaxed">
              Every service is a bespoke collaboration — designed around your
              creative vision and business goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services grid */}
      <section className="section">
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-night-800 animate-pulse"/>
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {services.map((svc, i) => (
              <motion.div
                key={svc._id}
                variants={staggerItem}
                className="glass p-8 hover:border-violet-500/20
                           transition-all duration-300 group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: title + description */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-display text-4xl text-gradient-violet
                                       opacity-30">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h2 className="font-display text-2xl text-white uppercase">
                        {svc.title}
                      </h2>
                    </div>
                    <p className="text-slate-400 leading-relaxed mb-5">
                      {svc.description || svc.shortDescription}
                    </p>
                    {svc.deliverables?.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-600 uppercase tracking-widest mb-3">
                          Deliverables
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {svc.deliverables.map((d) => (
                            <span key={d}
                                  className="text-xs text-slate-400 px-3 py-1.5
                                             rounded-full glass border-white/5">
                              ✓ {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: meta */}
                  <div className="space-y-4">
                    {svc.pricingNote && (
                      <div className="glass p-4 rounded-xl">
                        <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">
                          Pricing
                        </p>
                        <p className="text-violet-400 font-medium">{svc.pricingNote}</p>
                      </div>
                    )}
                    {svc.turnaround && (
                      <div className="glass p-4 rounded-xl">
                        <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">
                          Turnaround
                        </p>
                        <p className="text-slate-300 text-sm">{svc.turnaround}</p>
                      </div>
                    )}
                    <Link to="/contact" className="btn-cta w-full justify-center text-sm">
                      Book this service
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
};

export default Services;