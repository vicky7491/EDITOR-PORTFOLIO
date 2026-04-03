import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSite } from '@/context/SiteContext';
import { fadeUp, staggerContainer, staggerItem } from '@/utils/motion';

const SOCIAL_ICONS = {
  instagram: <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z"/>,
  youtube:   <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z M9.75 15.02l5.75-3.02-5.75-3.02v6.04z"/>,
  twitter:   <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>,
  linkedin:  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>,
  behance:   <path d="M1 6h7.5a4.5 4.5 0 0 1 0 9H1V6zM1 15h9a5 5 0 0 1 0 10H1V15z M14.5 6h9 M16 9.5a5.5 5.5 0 0 1 11 0c0 .91-.33 3.5-.33 3.5H16s-.36-2.59.5-3.5z M16 18.5a5.5 5.5 0 0 0 11 0"/>,
  vimeo:     <path d="M21.64 6.32C21.5 9.16 19.5 13.17 15.5 18.3 11.4 23.63 7.9 26.3 5.05 26.3c-1.67 0-3.08-1.54-4.24-4.63L-.36 15.47C-1.2 12.38-.3 10.83 1.44 10.83c.77 0 1.93.73 3.48 2.18 1.55 1.45 2.7 2.17 3.48 2.17.53 0 1.33-.65 2.4-1.94C11.87 11.95 12.77 10.6 13 9.16c.23-1.45-.46-2.18-2.07-2.18-.73 0-1.48.17-2.25.5 1.5-4.9 4.36-7.3 8.6-7.2 3.14.07 4.63 2.1 4.36 6.04z"/>,
};

const SocialLink = ({ href, icon, name }) => {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       aria-label={name}
       className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center
                  text-slate-500 hover:text-white hover:border-brand-500/50
                  hover:bg-brand-600/10 transition-all duration-300">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
           className="w-4 h-4">
        {SOCIAL_ICONS[name]}
      </svg>
    </a>
  );
};

const Footer = () => {
  const { settings } = useSite();
  const social  = settings?.socialLinks  || {};
  const contact = settings?.contactInfo  || {};

  const NAV_COLS = [
    {
      title: 'Pages',
      links: [
        { to: '/',            label: 'Home'         },
        { to: '/about',       label: 'About'        },
        { to: '/portfolio',   label: 'Portfolio'    },
        { to: '/services',    label: 'Services'     },
        { to: '/testimonials',label: 'Testimonials' },
        { to: '/contact',     label: 'Contact'      },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'Short-Form Editing'  },
        { label: 'Long-Form Editing'   },
        { label: 'YouTube Editing'     },
        { label: 'Ads & Promos'        },
        { label: 'Motion Graphics'     },
        { label: 'Color Grading'       },
      ],
    },
  ];

  return (
    <footer className="relative bg-dark-950 border-t border-white/5 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48
                      bg-brand-600/5 rounded-full blur-3xl pointer-events-none"/>

      <div className="section-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600
                              to-brand-400 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white"
                     strokeWidth={2} className="w-4 h-4">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
              <span className="font-bold text-lg text-white">
                {settings?.siteTitle?.split('—')[0]?.trim() || 'CineEdit'}
              </span>
            </Link>

            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
              {settings?.tagline || 'Transforming footage into cinematic stories that captivate audiences worldwide.'}
            </p>

            {/* Social links */}
            <div className="flex gap-2">
              {Object.entries(social).map(([name, href]) => (
                <SocialLink key={name} href={href} name={name} />
              ))}
            </div>

            {/* Contact info */}
            {contact.email && (
              <a href={`mailto:${contact.email}`}
                 className="flex items-center gap-2 mt-5 text-sm text-slate-500
                            hover:text-brand-400 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth={1.5} className="w-4 h-4">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                {contact.email}
              </a>
            )}
          </div>

          {/* Nav columns */}
          {NAV_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-white text-sm font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(({ to, label }) => (
                  <li key={label}>
                    {to ? (
                      <Link to={to}
                            className="text-slate-500 hover:text-slate-200 text-sm
                                       transition-colors duration-200">
                        {label}
                      </Link>
                    ) : (
                      <span className="text-slate-500 text-sm">{label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5
                        flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            {settings?.footerText || `© ${new Date().getFullYear()} CineEdit. All rights reserved.`}
          </p>
          <p className="text-slate-700 text-xs">
            Built with ♥ for cinematic storytelling
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;