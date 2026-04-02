import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

import useFetch      from '@/hooks/useFetch';
import ConfirmModal  from '@/components/ui/ConfirmModal';
import ImageUploader from '@/components/ui/ImageUploader';
import axiosAdmin    from '@/api/axiosAdmin';

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map((star) => (
      <button key={star} type="button" onClick={() => onChange(star)}
              className={`text-lg transition-colors
                ${star <= value ? 'text-amber-400' : 'text-slate-700'}`}>
        ★
      </button>
    ))}
  </div>
);

const TestimonialForm = ({ initial, onSave, onCancel }) => {
  const [photo,  setPhoto]  = useState(initial?.photo || null);
  const [rating, setRating] = useState(initial?.rating || 5);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      clientName:          initial?.clientName   || '',
      clientTitle:         initial?.clientTitle  || '',
      company:             initial?.company      || '',
      review:              initial?.review       || '',
      videoTestimonialUrl: initial?.videoTestimonialUrl || '',
      featured:            initial?.featured     || false,
    },
  });

  return (
    <form onSubmit={handleSubmit((d) => onSave({ ...d, rating, photo }))}
          className="glass-card p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Client name *</label>
          <input className={`admin-input ${errors.clientName?'border-red-500/50':''}`}
                 placeholder="John Smith"
                 {...register('clientName',{required:'Required'})}/>
        </div>
        <div>
          <label className="admin-label">Client title</label>
          <input className="admin-input" placeholder="CEO, Acme Corp"
                 {...register('clientTitle')}/>
        </div>
      </div>
      <div>
        <label className="admin-label">Company</label>
        <input className="admin-input" placeholder="Acme Corporation"
               {...register('company')}/>
      </div>
      <div>
        <label className="admin-label">Review *</label>
        <textarea rows={4} className={`admin-input resize-none
          ${errors.review?'border-red-500/50':''}`}
                  placeholder="Client's review..."
                  {...register('review',{required:'Review is required'})}/>
        {errors.review && <p className="mt-1 text-xs text-red-400">{errors.review.message}</p>}
      </div>
      <div>
        <label className="admin-label">Rating</label>
        <StarRating value={rating} onChange={setRating}/>
      </div>
      <div>
        <label className="admin-label">Video testimonial URL (optional)</label>
        <input type="url" className="admin-input" placeholder="https://youtube.com/..."
               {...register('videoTestimonialUrl')}/>
      </div>
      <div>
        <label className="admin-label">Client photo (optional)</label>
        <ImageUploader value={photo} onChange={setPhoto}
                       folder="avatars" label="Upload client photo"/>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="tmn-featured" className="w-4 h-4 accent-brand-500"
               {...register('featured')}/>
        <label htmlFor="tmn-featured" className="text-sm text-slate-300 cursor-pointer">
          Featured testimonial
        </label>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary text-xs">Cancel</button>
        <button type="submit" className="btn-primary text-xs">
          {initial ? 'Update' : 'Add testimonial'}
        </button>
      </div>
    </form>
  );
};

const TestimonialsManager = () => {
  const { data: testimonials, isLoading, refetch } = useFetch('/api/testimonials');
  const [showForm,     setShowForm]     = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting,   setIsDeleting]   = useState(false);

  const handleCreate = async (data) => {
    try {
      await axiosAdmin.post('/api/testimonials', data);
      toast.success('Testimonial added');
      setShowForm(false);
      refetch();
    } catch (err) { toast.error(err.response?.data?.message||'Failed'); }
  };

  const handleUpdate = async (data) => {
    try {
      await axiosAdmin.put(`/api/testimonials/${editTarget._id}`, data);
      toast.success('Testimonial updated');
      setEditTarget(null);
      refetch();
    } catch (err) { toast.error(err.response?.data?.message||'Failed'); }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axiosAdmin.delete(`/api/testimonials/${deleteTarget._id}`);
      toast.success('Testimonial deleted');
      setDeleteTarget(null);
      refetch();
    } catch { toast.error('Delete failed'); }
    finally { setIsDeleting(false); }
  };

  const handleToggleFeatured = async (tmn) => {
    try {
      await axiosAdmin.patch(`/api/testimonials/${tmn._id}/featured`);
      toast.success(`${tmn.featured ? 'Removed from' : 'Added to'} featured`);
      refetch();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Testimonials</h2>
          <p className="text-slate-500 text-sm mt-0.5">{testimonials?.length ?? 0} reviews</p>
        </div>
        {!showForm && !editTarget && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + Add Testimonial
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
                      exit={{opacity:0,height:0}}>
            <TestimonialForm onSave={handleCreate} onCancel={() => setShowForm(false)}/>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_,i)=><div key={i} className="glass-card h-24 animate-pulse"/>)}
        </div>
      ) : !testimonials?.length ? (
        <div className="glass-card p-12 text-center text-slate-600">No testimonials yet.</div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((tmn) => (
            <AnimatePresence key={tmn._id}>
              {editTarget?._id === tmn._id ? (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <TestimonialForm initial={tmn} onSave={handleUpdate}
                                   onCancel={() => setEditTarget(null)}/>
                </motion.div>
              ) : (
                <motion.div
                  initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                  className="glass-card p-4 flex gap-4"
                >
                  {/* Avatar */}
                  {tmn.photo?.url ? (
                    <img src={tmn.photo.url} alt={tmn.clientName}
                         className="w-12 h-12 rounded-full object-cover shrink-0"/>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br
                                    from-brand-600 to-accent-500 flex items-center
                                    justify-center text-white font-semibold shrink-0">
                      {tmn.clientName[0]}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-slate-200 text-sm">{tmn.clientName}</p>
                        {(tmn.clientTitle || tmn.company) && (
                          <p className="text-xs text-slate-500">
                            {[tmn.clientTitle, tmn.company].filter(Boolean).join(' · ')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {tmn.featured && (
                          <span className="badge badge-published text-xs">★ Featured</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-0.5 my-1.5">
                      {[...Array(5)].map((_,i)=>(
                        <span key={i} className={i < tmn.rating
                          ? 'text-amber-400 text-xs' : 'text-slate-700 text-xs'}>★</span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {tmn.review}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => handleToggleFeatured(tmn)}
                            className={`p-1.5 rounded transition-colors text-xs
                              ${tmn.featured
                                ? 'text-amber-400 hover:text-slate-400'
                                : 'text-slate-500 hover:text-amber-400'}`}
                            title="Toggle featured">★</button>
                    <button onClick={() => setEditTarget(tmn)}
                            className="p-1.5 rounded text-slate-500 hover:text-slate-200
                                       hover:bg-white/5 transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           strokeWidth={1.5} className="w-3.5 h-3.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button onClick={() => setDeleteTarget(tmn)}
                            className="p-1.5 rounded text-slate-500 hover:text-red-400
                                       hover:bg-red-500/5 transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           strokeWidth={1.5} className="w-3.5 h-3.5">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      )}

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
                   onConfirm={handleDelete} isLoading={isDeleting}
                   title="Delete testimonial?"
                   description={`Review from "${deleteTarget?.clientName}" will be deleted.`}
                   confirmLabel="Delete"/>
    </div>
  );
};

export default TestimonialsManager;