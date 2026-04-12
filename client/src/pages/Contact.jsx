import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { submitContact } from '@/api/publicApi';
import { useSite } from '@/context/SiteContext';
import { staggerContainer, staggerItem, fadeUp } from '@/utils/motion';

const FAQ_ITEMS = [
  {
    q: 'What is your typical turnaround time?',
    a: 'Most projects are delivered within 3–7 business days depending on length and complexity. Rush delivery is available.',
  },
  {
    q: 'What file formats do you accept?',
    a: 'I accept all common video formats — MP4, MOV, MXF, R3D, BRAW, and more. Just send me what your camera outputs.',
  },
  {
    q: 'Do you offer revisions?',
    a: 'Yes — all packages include revision rounds. I work until you\'re 100% satisfied with the result.',
  },
  {
    q: 'How do I send you my footage?',
    a: 'Via Google Drive, Dropbox, WeTransfer, or Frame.io. I\'ll share a secure upload link once the project is confirmed.',
  },
];

const SERVICES_LIST = [
  'YouTube Video Editing', 'Short-Form / Reels', 'Brand Commercial',
  'Documentary', 'Wedding Film', 'Motion Graphics', 'Color Grading',
  'Sound Design', 'Other',
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="text-sm font-medium text-slate-300">{q}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
             className={`w-4 h-4 text-violet-400 shrink-0 transition-transform duration-200
               ${open ? 'rotate-45' : ''}`}>
          <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round"/>
          <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round"/>
        </svg>
      </button>
      {open && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          className="px-5 pb-5"
        >
          <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
};

const Contact = () => {
  const { settings }  = useSite();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register, handleSubmit, reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await submitContact(data);
      setSubmitted(true);
      reset();
      toast.success('Message sent! I\'ll be in touch within 24 hours.');
    } catch (err) {
      toast.error(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contact = settings.contactInfo || {};

  return (
    <>
      <Helmet>
        <title>Contact — {settings.siteTitle || 'VickyVfx'}</title>
        <meta name="description" content="Get in touch to start your next video project."/>
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
              Let's Talk
            </span>
            <h1 className="font-display text-title text-white uppercase">
              Start a Project
            </h1>
            <p className="text-slate-500 max-w-xl mt-3 text-sm leading-relaxed">
              Tell me about your vision and I'll get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="section">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Form — wider column */}
          <div className="lg:col-span-3">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-10 text-center rounded-2xl"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center
                                justify-center mx-auto mb-5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e"
                       strokeWidth={1.5} className="w-8 h-8">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 className="font-display text-2xl text-white uppercase mb-3">
                  Message Sent!
                </h2>
                <p className="text-slate-400 mb-6">
                  Thanks for reaching out. I'll be in touch within 24 hours.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn-outline text-sm">
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                onSubmit={handleSubmit(onSubmit)}
                className="glass p-8 rounded-2xl space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <motion.div variants={staggerItem}>
                    <label className="block text-xs text-slate-500 uppercase
                                      tracking-wider mb-2">Name *</label>
                    <input
                      className={`w-full bg-night-900/60 border rounded-xl px-4 py-3
                        text-slate-100 placeholder-slate-600 text-sm
                        transition-colors focus:outline-none focus:border-violet-500/50
                        ${errors.name ? 'border-red-500/50' : 'border-white/[0.06]'}`}
                      placeholder="Your name"
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                    )}
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={staggerItem}>
                    <label className="block text-xs text-slate-500 uppercase
                                      tracking-wider mb-2">Email *</label>
                    <input
                      type="email"
                      className={`w-full bg-night-900/60 border rounded-xl px-4 py-3
                        text-slate-100 placeholder-slate-600 text-sm
                        transition-colors focus:outline-none focus:border-violet-500/50
                        ${errors.email ? 'border-red-500/50' : 'border-white/[0.06]'}`}
                      placeholder="your@email.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                    )}
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Service */}
                  <motion.div variants={staggerItem}>
                    <label className="block text-xs text-slate-500 uppercase
                                      tracking-wider mb-2">Service</label>
                    <select
                      className="w-full bg-night-900/60 border border-white/[0.06]
                                 rounded-xl px-4 py-3 text-slate-400 text-sm
                                 focus:outline-none focus:border-violet-500/50"
                      {...register('service')}
                    >
                      <option value="">Select a service</option>
                      {SERVICES_LIST.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Budget */}
                  <motion.div variants={staggerItem}>
                    <label className="block text-xs text-slate-500 uppercase
                                      tracking-wider mb-2">Budget</label>
                    <select
                      className="w-full bg-night-900/60 border border-white/[0.06]
                                 rounded-xl px-4 py-3 text-slate-400 text-sm
                                 focus:outline-none focus:border-violet-500/50"
                      {...register('budget')}
                    >
                      <option value="">Select budget range</option>
                      <option>Under $500</option>
                      <option>$500–$1,500</option>
                      <option>$1,500–$5,000</option>
                      <option>$5,000+</option>
                    </select>
                  </motion.div>
                </div>

                {/* Subject */}
                <motion.div variants={staggerItem}>
                  <label className="block text-xs text-slate-500 uppercase
                                    tracking-wider mb-2">Subject</label>
                  <input
                    className="w-full bg-night-900/60 border border-white/[0.06]
                               rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600
                               text-sm focus:outline-none focus:border-violet-500/50"
                    placeholder="What's your project about?"
                    {...register('subject')}
                  />
                </motion.div>

                {/* Message */}
                <motion.div variants={staggerItem}>
                  <label className="block text-xs text-slate-500 uppercase
                                    tracking-wider mb-2">Message *</label>
                  <textarea
                    rows={5}
                    className={`w-full bg-night-900/60 border rounded-xl px-4 py-3
                      text-slate-100 placeholder-slate-600 text-sm resize-none
                      transition-colors focus:outline-none focus:border-violet-500/50
                      ${errors.message ? 'border-red-500/50' : 'border-white/[0.06]'}`}
                    placeholder="Describe your project, timeline, and any specific requirements..."
                    {...register('message', {
                      required:  'Message is required',
                      minLength: { value: 10, message: 'Message is too short' },
                    })}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>
                  )}
                </motion.div>

                <motion.div variants={staggerItem}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-cta w-full justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor"
                                  strokeWidth={2} className="opacity-25"/>
                          <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor"
                                strokeWidth={2} strokeLinecap="round"/>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send message
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth={1.5} className="w-4 h-4">
                          <line x1="22" y1="2" x2="11" y2="13"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.form>
            )}
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact info */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass p-6 rounded-2xl space-y-4"
            >
              <h3 className="font-display text-lg text-white uppercase">
                Get in touch
              </h3>
              {contact.email && (
                <a href={`mailto:${contact.email}`}
                   className="flex items-center gap-3 text-sm text-slate-400
                              hover:text-violet-400 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-violet-600/10 flex items-center
                                  justify-center text-violet-400 shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth={1.5} className="w-4 h-4">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </div>
                  {contact.email}
                </a>
              )}
              {contact.whatsapp && (
                <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g,'')}`}
                   target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 text-sm text-slate-400
                              hover:text-violet-400 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-violet-600/10 flex items-center
                                  justify-center text-violet-400 shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth={1.5} className="w-4 h-4">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7
                               8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8
                               8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                  </div>
                  WhatsApp
                </a>
              )}
              {contact.location && (
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <div className="w-8 h-8 rounded-lg bg-violet-600/10 flex items-center
                                  justify-center text-violet-400 shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth={1.5} className="w-4 h-4">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  {contact.location}
                </div>
              )}
            </motion.div>

            {/* Response time note */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
              className="glass p-5 rounded-2xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft"/>
                <p className="text-xs text-green-400 font-medium">Available for projects</p>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Typical response time is under 24 hours. For urgent projects, mention it in your message.
              </p>
            </motion.div>

            {/* FAQ */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
            >
              <h3 className="font-display text-lg text-white uppercase mb-4">
                FAQs
              </h3>
              <div className="space-y-2">
                {FAQ_ITEMS.map((item, i) => (
                  <FAQItem key={i} q={item.q} a={item.a}/>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;