import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import useFetch     from '@/hooks/useFetch';
import DataTable    from '@/components/ui/DataTable';
import Pagination   from '@/components/ui/Pagination';
import ConfirmModal from '@/components/ui/ConfirmModal';
import SearchBar    from '@/components/ui/SearchBar';
import axiosAdmin   from '@/api/axiosAdmin';

const VideosList = () => {
  const navigate = useNavigate();
  const [page,   setPage]   = useState(1);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting,   setIsDeleting]   = useState(false);

  const { data: videos, meta, isLoading, refetch } = useFetch(
    '/api/videos',
    { page, limit: 15, search }
  );

  const handleSearch = useCallback((q) => { setSearch(q); setPage(1); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await axiosAdmin.delete(`/api/videos/${deleteTarget._id}`);
      toast.success('Video deleted');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const COLUMNS = [
    {
      key:    'thumbnail',
      label:  '',
      width:  '60px',
      render: (_, row) => row.thumbnail?.url ? (
        <img src={row.thumbnail.url} alt={row.title}
             className="w-10 h-10 rounded-lg object-cover"/>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-surface-800 flex items-center
                        justify-center text-slate-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth={1.5} className="w-4 h-4">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
      ),
    },
    {
      key:      'title',
      label:    'Title',
      sortable: true,
      render:   (v) => <p className="font-medium text-slate-200">{v}</p>,
    },
    {
      key:    'category',
      label:  'Category',
      render: (v) => v?.name
        ? <span className="badge" style={{ background: `${v.color}20`,
            color: v.color, border: `1px solid ${v.color}40` }}>{v.name}</span>
        : <span className="text-slate-600">—</span>,
    },
    {
      key:    'featured',
      label:  'Featured',
      render: (v) => v
        ? <span className="text-amber-400 text-xs">★ Yes</span>
        : <span className="text-slate-600 text-xs">No</span>,
    },
    {
      key:      'views',
      label:    'Views',
      sortable: true,
      render:   (v) => <span className="text-slate-400">{v || 0}</span>,
    },
    {
      key:      'createdAt',
      label:    'Uploaded',
      sortable: true,
      render:   (v) => new Date(v).toLocaleDateString(),
    },
    {
      key:    'actions',
      label:  '',
      width:  '90px',
      render: (_, row) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/admin/videos/edit/${row._id}`)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200
                       hover:bg-white/5 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={1.5} className="w-4 h-4">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400
                       hover:bg-red-500/5 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={1.5} className="w-4 h-4">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Videos</h2>
          <p className="text-slate-500 text-sm mt-0.5">{meta?.total ?? 0} total videos</p>
        </div>
        <button onClick={() => navigate('/admin/videos/upload')} className="btn-primary">
          + Upload Video
        </button>
      </div>

      <SearchBar onSearch={handleSearch} placeholder="Search videos..." />

      <DataTable
        columns={COLUMNS}
        data={videos || []}
        isLoading={isLoading}
        emptyMessage="No videos yet. Upload your first video!"
      />

      <Pagination meta={meta} onPageChange={setPage} />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete video?"
        description={`"${deleteTarget?.title}" will be permanently deleted.`}
        confirmLabel="Delete video"
      />
    </div>
  );
};

export default VideosList;