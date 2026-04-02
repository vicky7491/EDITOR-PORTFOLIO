import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import axiosAdmin      from '@/api/axiosAdmin';
import useFetch        from '@/hooks/useFetch';
import ImageUploader   from '@/components/ui/ImageUploader';
import VideoUploaderUI from '@/components/ui/VideoUploader';

const VideoUploader = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const isEditing = Boolean(id);

  const [isSaving,   setIsSaving]   = useState(false);
  const [thumbnail,  setThumbnail]  = useState(null);
  const [videoMedia, setVideoMedia] = useState(null);

  const { data: categories } = useFetch('/api/categories');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '', description: '', category: '',
      featured: false, order: 0, duration: '',
    },
  });

  useEffect(() => {
    if (!isEditing) return;
    const load = async () => {
      try {
        const res = await axiosAdmin.get('/api/videos', { params: { limit: 200 } });
        const video = res.data.data?.find((v) => v._id === id);
        if (video) {
          reset({
            title:       video.title       || '',
            description: video.description || '',
            category:    video.category?._id || '',
            featured:    video.featured    || false,
            order:       video.order       || 0,
            duration:    video.duration    || '',
          });
          setThumbnail(video.thumbnail || null);
          setVideoMedia(video.videoUrl
            ? { url: video.videoUrl, publicId: video.videoPublicId } : null);
        }
      } catch {
        toast.error('Failed to load video');
      }
    };
    load();
  }, [id, isEditing, reset]);

  const onSubmit = async (data) => {
    if (!videoMedia?.url && !isEditing) {
      toast.error('Please upload or provide a video URL');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        thumbnail,
        videoUrl:      videoMedia?.url      || '',
        videoPublicId: videoMedia?.publicId || '',
      };
      if (isEditing) {
        await axiosAdmin.put(`/api/videos/${id}`, payload);
        toast.success('Video updated');
      } else {
        await axiosAdmin.post('/api/videos', payload);
        toast.success('Video added');
        navigate('/admin/videos');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/admin/videos')}
                  className="text-sm text-slate-500 hover:text-slate-300 mb-2 flex items-center gap-1">
            ← Back to videos
          </button>
          <h2 className="text-xl font-semibold text-slate-100">
            {isEditing ? 'Edit Video' : 'Upload Video'}
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/admin/videos')} className="btn-secondary">Cancel</button>
          <button form="video-form" type="submit" disabled={isSaving} className="btn-primary">
            {isSaving ? 'Saving...' : isEditing ? 'Update' : 'Save video'}
          </button>
        </div>
      </div>

      <form id="video-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="admin-label">Title *</label>
            <input className={`admin-input ${errors.title ? 'border-red-500/50' : ''}`}
                   placeholder="Video title"
                   {...register('title', { required: 'Title is required' })}/>
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
          </div>

          <div>
            <label className="admin-label">Description</label>
            <textarea rows={3} className="admin-input resize-none"
                      placeholder="Brief description..."
                      {...register('description')}/>
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
              <label className="admin-label">Duration</label>
              <input className="admin-input" placeholder="e.g. 2:34"
                     {...register('duration')}/>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="vid-featured" className="w-4 h-4 accent-brand-500"
                     {...register('featured')}/>
              <label htmlFor="vid-featured" className="text-sm text-slate-300 cursor-pointer">
                Featured video
              </label>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-300">Order:</label>
              <input type="number" className="admin-input w-20"
                     {...register('order', { valueAsNumber: true })}/>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="admin-label">Video file</label>
            <VideoUploaderUI
              value={videoMedia}
              onChange={setVideoMedia}
              label="Upload video"
            />
          </div>
          <div>
            <label className="admin-label">Thumbnail</label>
            <ImageUploader
              value={thumbnail}
              onChange={setThumbnail}
              folder="thumbnails"
              label="Upload thumbnail"
            />
          </div>
        </div>

      </form>
    </motion.div>
  );
};

export default VideoUploader;