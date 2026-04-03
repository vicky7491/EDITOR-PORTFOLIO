import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import axiosAdmin    from '@/api/axiosAdmin';
import useFetch      from '@/hooks/useFetch';
import ImageUploader from '@/components/ui/ImageUploader';
import VideoUploader from '@/components/ui/VideoUploader';

const ProjectEditor = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const isEditing = Boolean(id);

  const [isSaving,    setIsSaving]    = useState(false);
  const [thumbnail,   setThumbnail]   = useState(null);
  const [video,       setVideo]       = useState(null);
  const [beforeImg,   setBeforeImg]   = useState(null);
  const [afterImg,    setAfterImg]    = useState(null);
  const [activeTab,   setActiveTab]   = useState('basic');

  const { data: categories } = useFetch('/api/categories');

  const {
    register, handleSubmit, reset, control,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      title: '', shortDescription: '', description: '',
      category: '', clientName: '', projectDate: '',
      softwareUsed: '', tags: '', externalLink: '',
      status: 'draft', featured: false, order: 0,
    },
  });

  // Load existing project when editing
  useEffect(() => {
    if (isEditing) {
      axiosAdmin.get(`/api/projects?slug=_id_${id}`)
        .catch(() => axiosAdmin.get(`/api/admin/projects/${id}`))
        .then((res) => {
          // Try fetching by ID directly
        });

      // Simpler approach — fetch all and filter, or use a dedicated get-by-id
      const load = async () => {
        try {
          // We'll use the admin dashboard endpoint pattern
          const res = await axiosAdmin.get(`/api/projects/id/${id}`).catch(
            () => axiosAdmin.get(`/api/admin/projects/single/${id}`)
          );
          // If those don't exist, use the projects list and filter
        } catch {
          // fallback
        }
      };

      // Realistic approach: fetch by ID using the PUT route existence
      const fetchProject = async () => {
  try {
    // Use the new admin-only by-id route
    const res = await axiosAdmin.get(`/api/projects/by-id/${id}`);
    const project = res.data.data;

    if (project) {
      reset({
        title:            project.title            || '',
        shortDescription: project.shortDescription || '',
        description:      project.description      || '',
        category:         project.category?._id    || '',
        clientName:       project.clientName        || '',
        projectDate:      project.projectDate
          ? new Date(project.projectDate).toISOString().split('T')[0]
          : '',
        softwareUsed: (project.softwareUsed || []).join(', '),
        tags:         (project.tags         || []).join(', '),
        externalLink: project.externalLink  || '',
        status:       project.status        || 'draft',
        featured:     project.featured      || false,
        order:        project.order         || 0,
      });

      setThumbnail(project.thumbnail || null);

      setVideo(
        project.videoUrl
          ? { url: project.videoUrl, publicId: project.videoPublicId || '' }
          : null
      );

      setBeforeImg(project.beforeAfter?.before || null);
      setAfterImg( project.beforeAfter?.after  || null);
    }
  } catch (err) {
    toast.error('Failed to load project');
    navigate('/admin/projects');
  }
};
      fetchProject();
    }
  }, [id, isEditing, reset]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        softwareUsed: data.softwareUsed
          ? data.softwareUsed.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        tags: data.tags
          ? data.tags.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        thumbnail,
        videoUrl:      video?.url       || null,
        videoPublicId: video?.publicId  || null,
        beforeAfter: {
          before: beforeImg || null,
          after:  afterImg  || null,
        },
      };

      if (isEditing) {
        await axiosAdmin.put(`/api/projects/${id}`, payload);
        toast.success('Project updated');
      } else {
        await axiosAdmin.post('/api/projects', payload);
        toast.success('Project created');
        navigate('/admin/projects');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const TABS = ['basic', 'media', 'details', 'before/after'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/admin/projects')}
            className="text-sm text-slate-500 hover:text-slate-300
                       transition-colors mb-2 flex items-center gap-1"
          >
            ← Back to projects
          </button>
          <h2 className="text-xl font-semibold text-slate-100">
            {isEditing ? 'Edit Project' : 'New Project'}
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            form="project-form"
            type="submit"
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? 'Saving...' : isEditing ? 'Update project' : 'Create project'}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 glass-card p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium capitalize
              transition-all duration-200
              ${activeTab === tab
                ? 'bg-brand-600 text-white'
                : 'text-slate-400 hover:text-slate-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form id="project-form" onSubmit={handleSubmit(onSubmit)}>

        {/* ── Tab: Basic ─────────────────────────────────────────────────── */}
        {activeTab === 'basic' && (
          <div className="glass-card p-6 space-y-5">

            <div>
              <label className="admin-label">Title *</label>
              <input
                className={`admin-input ${errors.title ? 'border-red-500/50' : ''}`}
                placeholder="e.g. Brand Documentary — Acme Corp"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="admin-label">Short description</label>
              <input
                className="admin-input"
                placeholder="One-liner shown in project cards (max 200 chars)"
                {...register('shortDescription')}
              />
            </div>

            <div>
              <label className="admin-label">Full description</label>
              <textarea
                rows={5}
                className="admin-input resize-none"
                placeholder="Detailed description of the project..."
                {...register('description')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Category</label>
                <select className="admin-input" {...register('category')}>
                  <option value="">Select category</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label">Status</label>
                <select className="admin-input" {...register('status')}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Client name</label>
                <input
                  className="admin-input"
                  placeholder="Acme Corporation"
                  {...register('clientName')}
                />
              </div>
              <div>
                <label className="admin-label">Project date</label>
                <input
                  type="date"
                  className="admin-input"
                  {...register('projectDate')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Order</label>
                <input
                  type="number"
                  className="admin-input"
                  {...register('order', { valueAsNumber: true })}
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  className="w-4 h-4 accent-brand-500 cursor-pointer"
                  {...register('featured')}
                />
                <label htmlFor="featured" className="text-sm text-slate-300 cursor-pointer">
                  Mark as featured
                </label>
              </div>
            </div>

          </div>
        )}

        {/* ── Tab: Media ─────────────────────────────────────────────────── */}
        {activeTab === 'media' && (
          <div className="glass-card p-6 space-y-6">
            <div>
              <label className="admin-label">Thumbnail image</label>
              <ImageUploader
                value={thumbnail}
                onChange={setThumbnail}
                folder="thumbnails"
                label="Upload thumbnail"
              />
            </div>
            <div>
              <label className="admin-label">Project video</label>
              <VideoUploader
                value={video}
                onChange={setVideo}
                label="Upload project video"
              />
              <p className="mt-2 text-xs text-slate-600">
                Or paste a video URL:
              </p>
              <input
                className="admin-input mt-1.5"
                placeholder="https://res.cloudinary.com/..."
                value={video?.url || ''}
                onChange={(e) => setVideo(e.target.value
                  ? { url: e.target.value, publicId: '' } : null)}
              />
            </div>
          </div>
        )}

        {/* ── Tab: Details ───────────────────────────────────────────────── */}
        {activeTab === 'details' && (
          <div className="glass-card p-6 space-y-5">
            <div>
              <label className="admin-label">Software used</label>
              <input
                className="admin-input"
                placeholder="Premiere Pro, After Effects, DaVinci Resolve (comma-separated)"
                {...register('softwareUsed')}
              />
            </div>
            <div>
              <label className="admin-label">Tags</label>
              <input
                className="admin-input"
                placeholder="documentary, brand, cinematic (comma-separated)"
                {...register('tags')}
              />
            </div>
            <div>
              <label className="admin-label">External link</label>
              <input
                type="url"
                className="admin-input"
                placeholder="https://vimeo.com/..."
                {...register('externalLink')}
              />
            </div>
          </div>
        )}

        {/* ── Tab: Before / After ────────────────────────────────────────── */}
        {activeTab === 'before/after' && (
          <div className="glass-card p-6 space-y-6">
            <p className="text-sm text-slate-500">
              Upload before and after comparison images for this project.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Before</label>
                <ImageUploader
                  value={beforeImg}
                  onChange={setBeforeImg}
                  folder="before-after"
                  label="Upload before image"
                />
              </div>
              <div>
                <label className="admin-label">After</label>
                <ImageUploader
                  value={afterImg}
                  onChange={setAfterImg}
                  folder="before-after"
                  label="Upload after image"
                />
              </div>
            </div>
          </div>
        )}

      </form>
    </motion.div>
  );
};

export default ProjectEditor;