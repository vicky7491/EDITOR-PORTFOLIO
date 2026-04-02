import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import useFetch     from '@/hooks/useFetch';
import DataTable    from '@/components/ui/DataTable';
import Pagination   from '@/components/ui/Pagination';
import ConfirmModal from '@/components/ui/ConfirmModal';
import SearchBar    from '@/components/ui/SearchBar';
import axiosAdmin   from '@/api/axiosAdmin';

const STATUS_TABS = ['all','unread','read','replied'];

const InquiriesManager = () => {
  const navigate = useNavigate();
  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting,   setIsDeleting]   = useState(false);

  const { data: inquiries, meta, isLoading, refetch } = useFetch(
    '/api/contact/inquiries',
    { page, limit: 20, search, status: statusFilter }
  );

  const handleSearch   = useCallback((q) => { setSearch(q); setPage(1); }, []);
  const handleDelete   = async () => {
    setIsDeleting(true);
    try {
      await axiosAdmin.delete(`/api/contact/inquiries/${deleteTarget._id}`);
      toast.success('Inquiry deleted');
      setDeleteTarget(null);
      refetch();
    } catch { toast.error('Delete failed'); }
    finally { setIsDeleting(false); }
  };

  const COLUMNS = [
    {
      key:    'status',
      label:  '',
      width:  '12px',
      render: (v) => (
        <div className={`w-2 h-2 rounded-full
          ${v === 'unread' ? 'bg-blue-400' : 'bg-transparent'}`}/>
      ),
    },
    {
      key:    'name',
      label:  'From',
      render: (v, row) => (
        <div>
          <p className="font-medium text-slate-200 text-sm">{v}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
    },
    {
      key:    'subject',
      label:  'Subject',
      render: (v, row) => (
        <p className="text-sm text-slate-300 truncate max-w-[200px]">
          {v || row.message?.slice(0, 50) + '…'}
        </p>
      ),
    },
    {
      key:    'service',
      label:  'Service',
      render: (v) => v || <span className="text-slate-600">—</span>,
    },
    {
      key:      'status',
      label:    'Status',
      sortable: true,
      render:   (v) => <span className={`badge badge-${v}`}>{v}</span>,
    },
    {
      key:      'createdAt',
      label:    'Received',
      sortable: true,
      render:   (v) => (
        <span className="text-xs text-slate-500">
          {new Date(v).toLocaleDateString()}
        </span>
      ),
    },
    {
      key:    'actions',
      label:  '',
      width:  '60px',
      render: (_, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }}
          className="p-1.5 rounded text-slate-500 hover:text-red-400
                     hover:bg-red-500/5 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth={1.5} className="w-3.5 h-3.5">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          </svg>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Inquiries</h2>
          <p className="text-slate-500 text-sm mt-0.5">{meta?.total ?? 0} total messages</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 glass-card p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button key={tab}
                  onClick={() => { setStatusFilter(tab === 'all' ? '' : tab); setPage(1); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize
                    transition-all duration-200
                    ${(tab === 'all' && !statusFilter) || statusFilter === tab
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'}`}>
            {tab}
          </button>
        ))}
      </div>

      <SearchBar onSearch={handleSearch} placeholder="Search inquiries..."/>

      <DataTable
        columns={COLUMNS}
        data={inquiries || []}
        isLoading={isLoading}
        emptyMessage="No inquiries yet."
        onRowClick={(row) => navigate(`/admin/inquiries/${row._id}`)}
      />

      <Pagination meta={meta} onPageChange={setPage}/>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete inquiry?"
        description={`Message from "${deleteTarget?.name}" will be permanently deleted.`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default InquiriesManager;