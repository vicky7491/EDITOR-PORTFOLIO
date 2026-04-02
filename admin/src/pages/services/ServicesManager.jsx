import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

import useFetch      from '@/hooks/useFetch';
import ConfirmModal  from '@/components/ui/ConfirmModal';
import DragSortList  from '@/components/ui/DragSortList';
import ImageUploader from '@/components/ui/ImageUploader';
import axiosAdmin    from '@/api/axiosAdmin';

const DEFAULT_ICONS = [
  'video','scissors','monitor','film','music','palette',
  'zap','star','layers','cpu',
];

const ServiceForm = ({ initial, onSave, onCancel }) => {
  const [serviceImage, setServiceImage] = useState(initial?.image || null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title:            initial?.title            || '',
      shortDescription: initial?.shortDescription || '',
      description:      initial?.description      || '',
      deliverables:     (initial?.deliverables || []).join('\n'),
      pricingNote:      initial?.pricingNote      || '',
      turnaround:       initial?.turnaround       || '',
      icon:             initial?.icon             || 'video',
      active:           initial?.active !== false,
    },
  });

  const handleSave = (data) => {
    onSave({
      ...data,
      deliverables: data.deliverables
        ? data.deliverables.split('\n').map((s) => s.trim()).filter(Boolean)
        : [],
      image: serviceImage,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleSave)} className="glass-card p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Service title *</label>
          <input className={`admin-input ${errors.title ? 'border-red-500/50':''}`}
                 placeholder="e.g. YouTube Video Editing"
                 {...register('title',{required:'Title is required'})}/>
          {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
        </div>
        <div>
          <label className="admin-label">Icon</label>
          <select className="admin-input" {...register('icon')}>
            {DEFAULT_ICONS.map((ic) => (
              <option key={ic} value={ic}>{ic}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="admin-label">Short description *</label>
        <input className="admin-input" placeholder="One-liner for service cards"
               {...register('shortDescription',{required:'Required'})}/>
      </div>
      <div>
        <label className="admin-label">Full description</label>
        <textarea rows={4} className="admin-input resize-none"
                  placeholder="Detailed description..."
                  {...register('description')}/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Pricing note</label>
          <input className="admin-input" placeholder="Starting at $150"
                 {...register('pricingNote')}/>
        </div>
        <div>
          <label className="admin-label">Turnaround</label>
          <input className="admin-input" placeholder="3–5 business days"
                 {...register('turnaround')}/>
        </div>
      </div>
      <div>
        <label className="admin-label">Deliverables (one per line)</label>
        <textarea rows={4} className="admin-input resize-none font-mono text-xs"
                  placeholder={"4K export\nColor graded\nCustom intro"}
                  {...register('deliverables')}/>
      </div>
      <div>
        <label className="admin-label">Service image (optional)</label>
        <ImageUploader value={serviceImage} onChange={setServiceImage}
                       folder="services" label="Upload service image"/>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="svc-active" className="w-4 h-4 accent-brand-500"
               {...register('active')}/>
        <label htmlFor="svc-active" className="text-sm text-slate-300 cursor-pointer">
          Active (visible on public site)
        </label>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary text-xs">Cancel</button>
        <button type="submit" className="btn-primary text-xs">
          {initial ? 'Update service' : 'Create service'}
        </button>
      </div>
    </form>
  );
};

const ServicesManager = () => {
  const { data: services, isLoading, refetch } = useFetch('/api/services?all=true');
  const [showForm,     setShowForm]     = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting,   setIsDeleting]   = useState(false);

  const handleCreate = async (data) => {
    try {
      await axiosAdmin.post('/api/services', data);
      toast.success('Service created');
      setShowForm(false);
      refetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleUpdate = async (data) => {
    try {
      await axiosAdmin.put(`/api/services/${editTarget._id}`, data);
      toast.success('Service updated');
      setEditTarget(null);
      refetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axiosAdmin.delete(`/api/services/${deleteTarget._id}`);
      toast.success('Service deleted');
      setDeleteTarget(null);
      refetch();
    } catch { toast.error('Delete failed'); }
    finally { setIsDeleting(false); }
  };

  const handleToggle = async (svc) => {
    try {
      await axiosAdmin.patch(`/api/services/${svc._id}/toggle`);
      toast.success(`Service ${svc.active ? 'deactivated' : 'activated'}`);
      refetch();
    } catch { toast.error('Toggle failed'); }
  };

  const handleReorder = async (reordered) => {
    try {
      await axiosAdmin.patch('/api/services/reorder/batch', {
        items: reordered.map(({ _id, order }) => ({ id: _id, order })),
      });
      refetch();
    } catch { toast.error('Reorder failed'); }
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Services</h2>
          <p className="text-slate-500 text-sm mt-0.5">{services?.length ?? 0} services</p>
        </div>
        {!showForm && !editTarget && (
          <button onClick={() => setShowForm(true)} className="btn-primary">+ New Service</button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
                      exit={{opacity:0,height:0}}>
            <ServiceForm onSave={handleCreate} onCancel={() => setShowForm(false)}/>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_,i)=><div key={i} className="glass-card h-16 animate-pulse"/>)}
        </div>
      ) : !services?.length ? (
        <div className="glass-card p-12 text-center text-slate-600">No services yet.</div>
      ) : (
        <DragSortList
          items={services}
          onReorder={handleReorder}
          renderItem={(svc) =>
            editTarget?._id === svc._id ? (
              <div className="flex-1">
                <ServiceForm initial={svc} onSave={handleUpdate}
                             onCancel={() => setEditTarget(null)}/>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0
                  ${svc.active ? 'bg-green-400' : 'bg-slate-600'}`}/>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">{svc.title}</p>
                  <p className="text-xs text-slate-500 truncate">{svc.shortDescription}</p>
                </div>
                {svc.pricingNote && (
                  <span className="text-xs text-brand-400 shrink-0">{svc.pricingNote}</span>
                )}
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleToggle(svc)}
                          className={`p-1.5 rounded text-xs transition-colors
                            ${svc.active
                              ? 'text-green-400 hover:text-slate-400'
                              : 'text-slate-500 hover:text-green-400'}`}
                          title={svc.active ? 'Deactivate' : 'Activate'}>
                    {svc.active ? '●' : '○'}
                  </button>
                  <button onClick={() => setEditTarget(svc)}
                          className="p-1.5 rounded text-slate-500 hover:text-slate-200
                                     hover:bg-white/5 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth={1.5} className="w-3.5 h-3.5">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button onClick={() => setDeleteTarget(svc)}
                          className="p-1.5 rounded text-slate-500 hover:text-red-400
                                     hover:bg-red-500/5 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth={1.5} className="w-3.5 h-3.5">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    </svg>
                  </button>
                </div>
              </div>
            )
          }
        />
      )}

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
                   onConfirm={handleDelete} isLoading={isDeleting}
                   title="Delete service?"
                   description={`"${deleteTarget?.title}" will be permanently deleted.`}
                   confirmLabel="Delete service"/>
    </div>
  );
};

export default ServicesManager;