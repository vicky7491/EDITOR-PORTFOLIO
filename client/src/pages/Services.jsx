import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock3, ArrowRight, Sparkles } from 'lucide-react';
import { getServices } from '@/api/publicApi';
import { useSite } from '@/context/SiteContext';
import { staggerContainer, staggerItem } from '@/utils/motion';

const Services = () => {
  const { settings } = useSite();
  const [services, setServices] = useState([]);
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
        <meta
          name="description"
          content="Professional video editing services tailored to your brand."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 px-6 bg-night-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute top-20 right-0 h-[280px] w-[280px] rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.16),transparent_35%)]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
              What I Offer
            </span>

            <h1 className="mt-5 font-display text-4xl md:text-6xl text-white uppercase leading-[0.95]">
              Editing services
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-white to-violet-500">
                built to grow creators
              </span>
            </h1>

            <p className="mt-5 text-slate-400 max-w-2xl text-sm md:text-base leading-relaxed">
              From high-retention short-form content to polished branded edits,
              every package is designed to make your content look sharper, move
              faster, and convert better.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 md:py-16 px-6 bg-night-900">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-3xl bg-night-800/80 border border-white/5 animate-pulse"
                />
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
                  className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 hover:border-violet-500/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.12)]"
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[linear-gradient(120deg,rgba(139,92,246,0.08),transparent_35%,transparent_65%,rgba(99,102,241,0.08))]" />

                  <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[1.5fr_0.8fr] gap-8 p-6 md:p-8">
                    {/* Left content */}
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-lg font-display text-violet-300">
                          {String(i + 1).padStart(2, '0')}
                        </span>

                        <div>
                          <h2 className="font-display text-2xl md:text-3xl text-white uppercase leading-none">
                            {svc.title}
                          </h2>
                          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">
                            Premium editing service
                          </p>
                        </div>
                      </div>

                      <p className="text-slate-300/90 leading-relaxed text-sm md:text-base max-w-3xl">
                        {svc.description || svc.shortDescription}
                      </p>

                      {svc.deliverables?.length > 0 && (
                        <div className="mt-6">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-[0.22em] mb-3">
                            What’s included
                          </p>

                          <div className="flex flex-wrap gap-2.5">
                            {svc.deliverables.map((d) => (
                              <span
                                key={d}
                                className="inline-flex items-center rounded-full border border-violet-500/15 bg-violet-500/[0.08] px-3.5 py-1.5 text-xs text-violet-100"
                              >
                                <span className="mr-2 text-violet-400">✓</span>
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right content */}
                    <div className="flex flex-col justify-between gap-4">
                      <div className="grid gap-4">
                        {svc.pricingNote && (
                          <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">
                              Pricing
                            </p>
                            <p className="text-lg font-semibold text-white">
                              {svc.pricingNote}
                            </p>
                          </div>
                        )}

                        {svc.turnaround && (
                          <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">
                              Turnaround
                            </p>
                            <div className="flex items-center gap-2 text-slate-200 text-sm">
                              <Clock3 className="h-4 w-4 text-violet-400" />
                              <span>{svc.turnaround}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <Link
                        to="/contact"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/30 hover:scale-[1.02] hover:shadow-purple-500/50 active:scale-[0.98]"
                      >
                        Book this service
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default Services;