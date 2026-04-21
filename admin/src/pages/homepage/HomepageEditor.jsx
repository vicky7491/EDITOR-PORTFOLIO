import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosAdmin from '@/api/axiosAdmin';

const TABS = ['hero','stats','social','contact','seo','footer'];

const HomepageEditor = () => {
  const [activeTab, setActiveTab]   = useState('hero');
  const [isSaving,  setIsSaving]    = useState(false);
  const [settings,  setSettings]    = useState(null);

  const { register, handleSubmit, reset, control } = useForm();
  const { fields: ctaFields, append: appendCta,
          remove: removeCta } = useFieldArray({ control, name: 'hero.ctaButtons' });
  const { fields: statFields, append: appendStat,
          remove: removeStat } = useFieldArray({ control, name: 'stats' });

  useEffect(() => {
    axiosAdmin.get('/api/settings/admin').then((res) => {
      const s = res.data.data;
      setSettings(s);
      reset({
        hero:         s.hero         || {},
        stats:        s.stats        || [],
        socialLinks:  s.socialLinks  || {},
        contactInfo:  s.contactInfo  || {},
        seo:          s.seo          || {},
        footerText:   s.footerText   || '',
        showreelUrl:  s.showreelUrl  || '',
        aboutPreview: s.aboutPreview || '',
        showTestimonialsSection: s.showTestimonialsSection,
        showServicesSection:     s.showServicesSection,
        showShowreelSection:     s.showShowreelSection,
      });
    }).catch(() => toast.error('Failed to load settings'));
  }, [reset]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      await axiosAdmin.put('/api/settings', data);
      toast.success('Homepage content updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }}
                className="max-w-2xl space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Homepage Editor</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Edit all public-facing homepage content
          </p>
        </div>
        <button form="homepage-form" type="submit" disabled={isSaving}
                className="btn-primary">
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 glass-card p-1">
        {TABS.map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium capitalize
                    transition-all duration-200
                    ${activeTab === tab
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'}`}>
            {tab}
          </button>
        ))}
      </div>

      <form id="homepage-form" onSubmit={handleSubmit(onSubmit)}>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        {activeTab === 'hero' && (
          <div className="glass-card p-6 space-y-5">
            <div>
              <label className="admin-label">Hero title</label>
              <input className="admin-input"
                     placeholder="Transforming Footage Into Cinematic Stories"
                     {...register('hero.title')}/>
            </div>
            <div>
              <label className="admin-label">Hero subtitle</label>
              <textarea rows={3} className="admin-input resize-none"
                        placeholder="Short tagline below the main title"
                        {...register('hero.subtitle')}/>
            </div>
            <div>
              <label className="admin-label">Showreel URL</label>
              <input type="url" className="admin-input"
                     placeholder="https://cloudinary.com/..."
                     {...register('showreelUrl')}/>
            </div>
            <div>
              <label className="admin-label">About preview text</label>
              <textarea rows={3} className="admin-input resize-none"
                        placeholder="Short about blurb for homepage"
                        {...register('aboutPreview')}/>
            </div>

            {/* CTA buttons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="admin-label mb-0">CTA buttons</label>
                <button type="button" onClick={() => appendCta({ label:'', link:'', variant:'primary' })}
                        className="btn-secondary text-xs py-1">+ Add CTA</button>
              </div>
              <div className="space-y-2">
                {ctaFields.map((field, i) => (
                  <div key={field.id} className="flex gap-2">
                    <input className="admin-input flex-1" placeholder="Label"
                           {...register(`hero.ctaButtons.${i}.label`)}/>
                    <input className="admin-input flex-1" placeholder="/link or #anchor"
                           {...register(`hero.ctaButtons.${i}.link`)}/>
                    <select className="admin-input w-32"
                            {...register(`hero.ctaButtons.${i}.variant`)}>
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="outline">Outline</option>
                    </select>
                    <button type="button" onClick={() => removeCta(i)}
                            className="btn-danger px-2 py-2">×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section toggles */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <p className="text-sm font-medium text-slate-400">Section visibility</p>
              {[
                ['showShowreelSection',     'Show showreel section'],
                ['showServicesSection',     'Show services section'],
                ['showTestimonialsSection', 'Show testimonials section'],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center gap-3">
                  <input type="checkbox" id={key} className="w-4 h-4 accent-brand-500"
                         {...register(key)}/>
                  <label htmlFor={key} className="text-sm text-slate-300 cursor-pointer">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Stats ────────────────────────────────────────────────────── */}
        {activeTab === 'stats' && (
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="admin-label mb-0">Homepage stats</label>
              <button type="button" onClick={() => appendStat({ label:'', value:'' })}
                      className="btn-secondary text-xs py-1">+ Add stat</button>
            </div>
            <p className="text-xs text-slate-600 -mt-2">
              e.g. "150+" Projects, "5 Years" Experience
            </p>
            <div className="space-y-2">
              {statFields.map((field, i) => (
                <div key={field.id} className="flex gap-2">
                  <input className="admin-input flex-1" placeholder="Value (e.g. 150+)"
                         {...register(`stats.${i}.value`)}/>
                  <input className="admin-input flex-1" placeholder="Label (e.g. Projects)"
                         {...register(`stats.${i}.label`)}/>
                  <button type="button" onClick={() => removeStat(i)}
                          className="btn-danger px-2">×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Social ───────────────────────────────────────────────────── */}
        {activeTab === 'social' && (
          <div className="glass-card p-6 space-y-4">
            {['instagram','youtube','twitter','linkedin','behance','vimeo'].map((platform) => (
              <div key={platform}>
                <label className="admin-label capitalize">{platform}</label>
                <input type="url" className="admin-input"
                       placeholder={`https://${platform}.com/...`}
                       {...register(`socialLinks.${platform}`)}/>
              </div>
            ))}
          </div>
        )}

        {/* ── Contact ──────────────────────────────────────────────────── */}
        {activeTab === 'contact' && (
          <div className="glass-card p-6 space-y-4">
            {[
              ['email',    'Email address',  'email',  'contact@vickyvfx.me'],
              ['phone',    'Phone number',   'tel',    '+1 234 567 8901'],
              ['whatsapp', 'WhatsApp',       'tel',    '+1 234 567 8901'],
              ['location', 'Location',       'text',   'Los Angeles, CA'],
            ].map(([key, label, type, placeholder]) => (
              <div key={key}>
                <label className="admin-label">{label}</label>
                <input type={type} className="admin-input" placeholder={placeholder}
                       {...register(`contactInfo.${key}`)}/>
              </div>
            ))}
          </div>
        )}

        {/* ── SEO ──────────────────────────────────────────────────────── */}
        {activeTab === 'seo' && (
          <div className="glass-card p-6 space-y-4">
            <div>
              <label className="admin-label">Default page title</label>
              <input className="admin-input"
                     placeholder="VickyVfx — Professional Video Editor"
                     {...register('seo.defaultTitle')}/>
            </div>
            <div>
              <label className="admin-label">Meta description</label>
              <textarea rows={3} className="admin-input resize-none"
                        placeholder="Brief site description for search engines (150–160 chars)"
                        {...register('seo.description')}/>
            </div>
            <div>
              <label className="admin-label">Keywords</label>
              <input className="admin-input"
                     placeholder="video editor, cinematic, post-production"
                     {...register('seo.keywords')}/>
            </div>
            <div>
              <label className="admin-label">OG image URL</label>
              <input type="url" className="admin-input"
                     placeholder="https://res.cloudinary.com/..."
                     {...register('seo.ogImage')}/>
            </div>
          </div>
        )}

        {/* ── Footer ───────────────────────────────────────────────────── */}
        {activeTab === 'footer' && (
          <div className="glass-card p-6 space-y-4">
            <div>
              <label className="admin-label">Footer text</label>
              <input className="admin-input"
                     placeholder="© 2024 VickyVfx. All rights reserved."
                     {...register('footerText')}/>
            </div>
          </div>
        )}

      </form>
    </motion.div>
  );
};

export default HomepageEditor;