// Drag-and-drop reorder page for projects

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosAdmin   from '@/api/axiosAdmin';
import DragSortList from '@/components/ui/DragSortList';

const ProjectReorder = () => {
  const navigate  = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [dirty,    setDirty]    = useState(false);

  useEffect(() => {
    axiosAdmin.get('/api/projects', { params: { limit: 100, sort: 'order' } })
      .then((r) => setProjects(r.data.data || []))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  const handleReorder = (reordered) => {
    setProjects(reordered);
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosAdmin.patch('/api/projects/reorder/batch', {
        items: projects.map((p, i) => ({ id: p._id, order: i })),
      });
      toast.success('Order saved');
      setDirty(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl space-y-5"
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
          <h2 className="text-xl font-semibold text-slate-100">Reorder Projects</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Drag rows to change display order on the public portfolio.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!dirty || saving}
          className="btn-primary disabled:opacity-40"
        >
          {saving ? 'Saving...' : 'Save order'}
        </button>
      </div>

      {dirty && (
        <div className="glass-card p-3 text-sm text-amber-400 border border-amber-500/20
                        flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth={1.5} className="w-4 h-4 shrink-0">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0
                     1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          You have unsaved changes. Click "Save order" to apply.
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card h-16 animate-pulse"/>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-600 text-sm">
          No projects yet. Create your first project.
        </div>
      ) : (
        <DragSortList
          items={projects}
          onReorder={handleReorder}
          renderItem={(project, index) => (
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Order number */}
              <span className="text-xs text-slate-600 w-5 text-right shrink-0">
                {index + 1}
              </span>

              {/* Thumbnail */}
              {project.thumbnail?.url ? (
                <img
                  src={project.thumbnail.url}
                  alt={project.title}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-surface-700 flex items-center
                                justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth={1.5} className="w-4 h-4 text-slate-600">
                    <rect x="2" y="7" width="20" height="15" rx="2"/>
                    <polyline points="17 2 12 7 7 2"/>
                  </svg>
                </div>
              )}

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {project.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {project.category && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        background: `${project.category.color}20`,
                        color:       project.category.color,
                      }}
                    >
                      {project.category.name}
                    </span>
                  )}
                  <span className={`text-[10px] ${
                    project.status === 'published' ? 'text-green-400' : 'text-amber-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Featured badge */}
              {project.featured && (
                <span className="text-xs text-amber-400 shrink-0">★</span>
              )}
            </div>
          )}
        />
      )}
    </motion.div>
  );
};

export default ProjectReorder;