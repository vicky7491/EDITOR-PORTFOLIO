import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosAdmin from '@/api/axiosAdmin';

const STATUS_OPTIONS = ['unread','read','replied'];

const InquiryDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [inquiry,   setInquiry]   = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [note,      setNote]      = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosAdmin.get(`/api/contact/inquiries/${id}`);
        setInquiry(res.data.data);
        setNote(res.data.data?.adminNotes || '');
      } catch {
        toast.error('Failed to load inquiry');
        navigate('/admin/inquiries');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleStatusChange = async (status) => {
    try {
      const res = await axiosAdmin.patch(`/api/contact/inquiries/${id}/status`, { status });
      setInquiry(res.data.data);
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  const handleSaveNote = async () => {
    setSavingNote(true);
    try {
      await axiosAdmin.patch(`/api/contact/inquiries/${id}/note`, { note });
      toast.success('Note saved');
    } catch { toast.error('Failed to save note'); }
    finally { setSavingNote(false); }
  };

  if (isLoading) {
    return <div className="glass-card h-64 animate-pulse rounded-xl"/>;
  }

  if (!inquiry) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl space-y-5"
    >
      {/* Back */}
      <button onClick={() => navigate('/admin/inquiries')}
              className="text-sm text-slate-500 hover:text-slate-300
                         transition-colors flex items-center gap-1">
        ← Back to inquiries
      </button>

      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-600
                            to-accent-500 flex items-center justify-center
                            text-white font-semibold">
              {inquiry.name[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">{inquiry.name}</h2>
              <a href={`mailto:${inquiry.email}`}
                 className="text-sm text-brand-400 hover:underline">
                {inquiry.email}
              </a>
            </div>
          </div>

          {/* Status selector */}
          <select
            value={inquiry.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="admin-input w-auto text-xs"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {inquiry.phone && (
            <div className="glass-card p-3">
              <p className="text-xs text-slate-500 mb-0.5">Phone</p>
              <p className="text-sm text-slate-300">{inquiry.phone}</p>
            </div>
          )}
          {inquiry.service && (
            <div className="glass-card p-3">
              <p className="text-xs text-slate-500 mb-0.5">Service</p>
              <p className="text-sm text-slate-300">{inquiry.service}</p>
            </div>
          )}
          {inquiry.budget && (
            <div className="glass-card p-3">
              <p className="text-xs text-slate-500 mb-0.5">Budget</p>
              <p className="text-sm text-slate-300">{inquiry.budget}</p>
            </div>
          )}
          <div className="glass-card p-3">
            <p className="text-xs text-slate-500 mb-0.5">Received</p>
            <p className="text-sm text-slate-300">
              {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Subject */}
        {inquiry.subject && (
          <div className="mb-3">
            <p className="text-xs text-slate-500 mb-1">Subject</p>
            <p className="text-sm font-medium text-slate-200">{inquiry.subject}</p>
          </div>
        )}

        {/* Message */}
        <div>
          <p className="text-xs text-slate-500 mb-2">Message</p>
          <div className="bg-surface-900/60 rounded-xl p-4">
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {inquiry.message}
            </p>
          </div>
        </div>
      </div>

      {/* Admin note */}
      <div className="glass-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-300">Admin notes</h3>
        <p className="text-xs text-slate-600">
          Private notes — not visible to the client.
        </p>
        <textarea
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="admin-input resize-none"
          placeholder="Add notes about this inquiry..."
        />
        <button onClick={handleSaveNote} disabled={savingNote}
                className="btn-primary text-sm">
          {savingNote ? 'Saving...' : 'Save note'}
        </button>
      </div>

      {/* Quick reply */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Quick reply</h3>
        <a
          href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject || 'Your Inquiry'}`}
          className="btn-primary inline-flex"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth={1.5} className="w-4 h-4">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          Reply via email
        </a>
      </div>
    </motion.div>
  );
};

export default InquiryDetail;