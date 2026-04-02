import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosAdmin    from '@/api/axiosAdmin';
import ImageUploader from '@/components/ui/ImageUploader';

const SiteSettingsPage = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [logo,     setLogo]     = useState(null);
  const [favicon,  setFavicon]  = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { siteTitle: '', tagline: '' },
  });

  useEffect(() => {
    axiosAdmin.get('/api/settings/admin').then((res) => {
      const s = res.data.data;
      reset({ siteTitle: s.siteTitle || '', tagline: s.tagline || '' });
      setLogo(s.logo     || null);
      setFavicon(s.favicon || null);
    }).catch(() => toast.error('Failed to load settings'));
  }, [reset]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      await axiosAdmin.put('/api/settings', { ...data, logo, favicon });
      toast.success('Settings saved');
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
          <h2 className="text-xl font-semibold text-slate-100">Site Settings</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Global site configuration
          </p>
        </div>
        <button form="settings-form" type="submit" disabled={isSaving}
                className="btn-primary">
          {isSaving ? 'Saving...' : 'Save settings'}
        </button>
      </div>

      <form id="settings-form" onSubmit={handleSubmit(onSubmit)}
            className="space-y-5">

        {/* Brand */}
        <div className="glass-card p-6 space-y-5">
          <h3 className="text-sm font-semibold text-slate-300 border-b
                         border-white/5 pb-3">Brand</h3>
          <div>
            <label className="admin-label">Site title</label>
            <input className="admin-input" placeholder="CineEdit"
                   {...register('siteTitle')}/>
          </div>
          <div>
            <label className="admin-label">Tagline</label>
            <input className="admin-input"
                   placeholder="Professional Video Editor"
                   {...register('tagline')}/>
          </div>
          <div>
            <label className="admin-label">Logo</label>
            <ImageUploader value={logo} onChange={setLogo}
                           folder="site" label="Upload logo"/>
          </div>
          <div>
            <label className="admin-label">Favicon</label>
            <ImageUploader value={favicon} onChange={setFavicon}
                           folder="site" label="Upload favicon (32×32 recommended)"/>
          </div>
        </div>

        {/* Account */}
        <div className="glass-card p-6 space-y-3">
          <h3 className="text-sm font-semibold text-slate-300 border-b
                         border-white/5 pb-3">Account</h3>
          <p className="text-sm text-slate-500">
            Manage your admin account credentials.
          </p>
          <button type="button"
                  onClick={() => navigate('/admin/settings/password')}
                  className="btn-secondary text-sm">
            Change password
          </button>
        </div>

      </form>
    </motion.div>
  );
};

export default SiteSettingsPage;