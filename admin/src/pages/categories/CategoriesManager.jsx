import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import useFetch     from '@/hooks/useFetch';
import ConfirmModal from '@/components/ui/ConfirmModal';
import DragSortList from '@/components/ui/DragSortList';
import axiosAdmin   from '@/api/axiosAdmin';

const PRESET_COLORS = [
  '#8b5cf6','#0ea5e9','#10b981','#f59e0b',
  '#ef4444','#ec4899','#14b8a6','#f97316',
];

const CategoryForm = ({ initial, onSave, onCancel }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name:        initial?.name        || '',
      description: initial?.description || '',
      color:       initial?.color       || '#8b5cf6',
    },
  });
  const selectedColor = watch('color');

  return (
    <form onSubmit={handleSubmit(onSave)} className="glass-card p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Name *</label>
          <input className={`admin-input ${errors.name ? 'border-red-500/50' : ''}`}
                 placeholder="e.g. Short-Form"
                 {...register('name', { required: 'Name is required' })}/>
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className="admin-label">Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={selectedColor}
                   onChange={(e) => setValue('color', e.target.value)}
                   className="w-10 h-10 rounded-lg border border-white/10
                              bg-transparent cursor-pointer"/>
            <div className="flex gap-1 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button key={c} type="button"
                        onClick={() => setValue('color', c)}
                        className={`w-5 h-5 rounded-full border-2 transition-all
                          ${selectedColor === c ? 'scale-125 border-white' : 'border-transparent'}`}
                        style={{ background: c }}/>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <label className="admin-label">Description</label>
        <input className="admin-input" placeholder="Optional description"
               {...register('description')}/>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary text-xs">Cancel</button>
        <button type="submit" className="btn-primary text-xs">
          {initial ? 'Update category' : 'Create category'}
        </button>
      </div>
    </form>
  );
};

const CategoriesManager = () => {
  const { data: categories, isLoading, refetch } = useFetch('/api/categories');
  const [showForm,     setShowForm]     = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting,   setIsDeleting]   = useState(false);

  const handleCreate = async (data) => {
    try {
      await axiosAdmin.post('/api/categories', data);
      toast.success('Category created');
      setShowForm(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await axiosAdmin.put(`/api/categories/${editTarget._id}`, data);
      toast.success('Category updated');
      setEditTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axiosAdmin.delete(`/api/categories/${deleteTarget._id}`);
      toast.success('Category deleted');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorder = async (reordered) => {
    try {
      await axiosAdmin.patch('/api/categories/reorder/batch', {
        items: reordered.map(({ _id, order }) => ({ id: _id, order })),
      });
      refetch();
    } catch {
      toast.error('Reorder failed');
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Categories</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {categories?.length ?? 0} categories
          </p>
        </div>
        {!showForm && !editTarget && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + New Category
          </button>
        )}
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CategoryForm
              onSave={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category list */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card h-14 animate-pulse"/>
          ))}
        </div>
      ) : categories?.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-600">
          No categories yet. Create one above.
        </div>
      ) : (
        <DragSortList
          items={categories}
          onReorder={handleReorder}
          renderItem={(cat) =>
            editTarget?._id === cat._id ? (
              <div className="flex-1">
                <CategoryForm
                  initial={cat}
                  onSave={handleUpdate}
                  onCancel={() => setEditTarget(null)}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-3 h-3 rounded-full shrink-0"
                     style={{ background: cat.color }}/>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-slate-500 truncate">{cat.description}</p>
                  )}
                </div>
                <span className="text-xs text-slate-600">
                  {cat.projectCount ?? 0} projects
                </span>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setEditTarget(cat)}
                          className="p-1.5 rounded text-slate-500 hover:text-slate-200
                                     hover:bg-white/5 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth={1.5} className="w-3.5 h-3.5">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button onClick={() => setDeleteTarget(cat)}
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

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete category?"
        description={`"${deleteTarget?.name}" will be deleted. Projects using this category will have their category cleared.`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default CategoriesManager;