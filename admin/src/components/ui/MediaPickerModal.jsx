// Modal that lets admin pick from existing Cloudinary library
// OR upload a new file — used inside ImageUploader as an alternative to always uploading

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { listMedia, searchMedia, deleteAsset } from '@/api/mediaApi';
import useUpload from '@/hooks/useUpload';
import toast from 'react-hot-toast';

const FOLDERS = [
  { value: 'vickyvfx',              label: 'All assets' },
  { value: 'vickyvfx/thumbnails',   label: 'Thumbnails' },
  { value: 'vickyvfx/avatars',      label: 'Avatars' },
  { value: 'vickyvfx/services',     label: 'Services' },
  { value: 'vickyvfx/site',         label: 'Site assets' },
  { value: 'vickyvfx/before-after', label: 'Before/After' },
];

const formatBytes = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const MediaPickerModal = ({
  isOpen,
  onClose,
  onSelect,         // (media: { url, publicId }) => void
  resourceType = 'image',
  folder:       defaultFolder = 'vickyvfx',
}) => {
  const [assets,      setAssets]      = useState([]);
  const [isLoading,   setIsLoading]   = useState(false);
  const [nextCursor,  setNextCursor]  = useState(null);
  const [folder,      setFolder]      = useState(defaultFolder);
  const [search,      setSearch]      = useState('');
  const [selected,    setSelected]    = useState(null);
  const [activeTab,   setActiveTab]   = useState('browse'); // 'browse' | 'upload'
  const [deleting,    setDeleting]    = useState(null);

  const { upload, uploading, progress } = useUpload();

  // ── Load assets ─────────────────────────────────────────────────────────────
  const load = useCallback(async (reset = true) => {
    setIsLoading(true);
    try {
      if (search.trim().length >= 2) {
        const res = await searchMedia(search, resourceType);
        setAssets(res.data.data || []);
        setNextCursor(null);
      } else {
        const res = await listMedia({
          folder,
          resource_type: resourceType,
          limit:         36,
          next_cursor:   reset ? undefined : nextCursor,
        });
        const incoming = res.data.data || [];
        setAssets((prev) => reset ? incoming : [...prev, ...incoming]);
        setNextCursor(res.data.meta?.nextCursor || null);
      }
    } catch {
      toast.error('Failed to load media');
    } finally {
      setIsLoading(false);
    }
  }, [folder, search, resourceType, nextCursor]);

  useEffect(() => {
    if (isOpen) {
      setSelected(null);
      load(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, folder]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => load(true), 450);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSelect = () => {
    if (!selected) return;
    onSelect({ url: selected.url, publicId: selected.publicId });
    onClose();
  };

  const handleUploadAndSelect = async (file) => {
    const uploadFolder = folder.replace('vickyvfx/', '') || 'thumbnails';
    const media = await upload(file, { type: resourceType, folder: uploadFolder });
    if (media) {
      onSelect(media);
      onClose();
    }
  };

  const handleDelete = async (asset) => {
    if (!window.confirm(`Delete "${asset.publicId}"? This cannot be undone.`)) return;
    setDeleting(asset.publicId);
    try {
      await deleteAsset(asset.publicId, resourceType);
      setAssets((prev) => prev.filter((a) => a.publicId !== asset.publicId));
      if (selected?.publicId === asset.publicId) setSelected(null);
      toast.success('Asset deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2 }}
            className="relative bg-surface-900 border border-white/10 rounded-2xl
                       w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2 className="text-base font-semibold text-slate-200">Media Library</h2>
              <button onClick={onClose}
                      className="text-slate-500 hover:text-slate-200 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth={1.5} className="w-5 h-5">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-5 pt-4">
              {['browse', 'upload'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-xs font-medium capitalize
                          transition-all
                          ${activeTab === tab
                            ? 'bg-brand-600 text-white'
                            : 'text-slate-400 hover:text-slate-200'}`}>
                  {tab === 'browse' ? `Browse library` : 'Upload new'}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">

              {activeTab === 'upload' ? (
                /* ── Upload tab ─────────────────────────────────── */
                <div className="p-5 flex-1 flex flex-col items-center justify-center gap-4">
                  <input
                    type="file"
                    accept={resourceType === 'video' ? 'video/*' : 'image/*'}
                    className="hidden"
                    id="media-picker-file"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUploadAndSelect(f);
                    }}
                  />
                  <label htmlFor="media-picker-file"
                         className={`w-full max-w-sm border-2 border-dashed
                           border-white/10 hover:border-brand-500/40 rounded-xl
                           p-12 text-center cursor-pointer transition-colors
                           ${uploading ? 'pointer-events-none' : ''}`}>
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <svg className="animate-spin w-8 h-8 text-brand-400"
                             viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor"
                                  strokeWidth={2} className="opacity-25"/>
                          <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor"
                                strokeWidth={2} strokeLinecap="round"/>
                        </svg>
                        <div className="w-48">
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Uploading...</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500 transition-all duration-300"
                                 style={{ width: `${progress}%` }}/>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth={1.5} className="w-10 h-10 text-slate-600 mx-auto mb-3">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                                strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round"/>
                        </svg>
                        <p className="text-sm text-slate-400">
                          Click to upload {resourceType}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {resourceType === 'video'
                            ? 'MP4, MOV, WebM · max 500MB'
                            : 'JPG, PNG, WebP · max 10MB'}
                        </p>
                      </>
                    )}
                  </label>
                </div>
              ) : (
                /* ── Browse tab ─────────────────────────────────── */
                <>
                  {/* Filters */}
                  <div className="flex flex-wrap gap-3 px-5 pt-4 pb-3">
                    <select
                      value={folder}
                      onChange={(e) => { setFolder(e.target.value); setSearch(''); }}
                      className="admin-input w-auto text-xs"
                    >
                      {FOLDERS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                    <div className="relative flex-1 min-w-[160px]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           strokeWidth={1.5}
                           className="absolute left-3 top-1/2 -translate-y-1/2
                                      w-3.5 h-3.5 text-slate-500">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35" strokeLinecap="round"/>
                      </svg>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by filename..."
                        className="admin-input text-xs pl-8 h-9"
                      />
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="flex-1 overflow-y-auto px-5 pb-2">
                    {isLoading && assets.length === 0 ? (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {[...Array(18)].map((_, i) => (
                          <div key={i} className="aspect-square rounded-lg
                                                   bg-surface-800 animate-pulse"/>
                        ))}
                      </div>
                    ) : assets.length === 0 ? (
                      <div className="flex flex-col items-center justify-center
                                      py-16 text-slate-600 gap-3">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth={1} className="w-12 h-12">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <p className="text-sm">No assets found</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {assets.map((asset) => (
                            <div
                              key={asset.publicId}
                              onClick={() =>
                                setSelected((prev) =>
                                  prev?.publicId === asset.publicId ? null : asset
                                )
                              }
                              className={`relative aspect-square rounded-lg overflow-hidden
                                cursor-pointer group transition-all duration-150
                                ${selected?.publicId === asset.publicId
                                  ? 'ring-2 ring-brand-400 ring-offset-1 ring-offset-surface-900'
                                  : 'hover:ring-1 hover:ring-white/20'}`}
                            >
                              {/* Thumbnail */}
                              {asset.resourceType === 'video' ? (
                                <div className="w-full h-full bg-surface-800 flex
                                                items-center justify-center relative">
                                  {asset.thumbnailUrl ? (
                                    <img src={asset.thumbnailUrl} alt=""
                                         className="w-full h-full object-cover"/>
                                  ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                         strokeWidth={1.5} className="w-6 h-6 text-slate-600">
                                      <polygon points="5 3 19 12 5 21 5 3"/>
                                    </svg>
                                  )}
                                  <div className="absolute inset-0 bg-black/30 flex
                                                  items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="white"
                                         className="w-6 h-6 opacity-70">
                                      <polygon points="5 3 19 12 5 21 5 3"/>
                                    </svg>
                                  </div>
                                </div>
                              ) : (
                                <img
                                  src={asset.url}
                                  alt={asset.publicId.split('/').pop()}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              )}

                              {/* Selected checkmark */}
                              {selected?.publicId === asset.publicId && (
                                <div className="absolute top-1 right-1 w-5 h-5
                                                rounded-full bg-brand-500 flex items-center
                                                justify-center">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="white"
                                       strokeWidth={2.5} className="w-3 h-3">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                </div>
                              )}

                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black/50 opacity-0
                                              group-hover:opacity-100 transition-opacity
                                              flex items-end justify-between p-1.5">
                                <span className="text-[9px] text-white/70 truncate max-w-[80%]">
                                  {formatBytes(asset.bytes)}
                                </span>
                                {/* Delete button */}
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDelete(asset); }}
                                  disabled={deleting === asset.publicId}
                                  className="w-5 h-5 rounded bg-red-600/80 flex items-center
                                             justify-center hover:bg-red-600 transition-colors
                                             shrink-0"
                                >
                                  {deleting === asset.publicId ? (
                                    <svg className="animate-spin w-3 h-3 text-white"
                                         viewBox="0 0 24 24" fill="none">
                                      <circle cx="12" cy="12" r="10" stroke="currentColor"
                                              strokeWidth={2} className="opacity-25"/>
                                      <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor"
                                            strokeWidth={2} strokeLinecap="round"/>
                                    </svg>
                                  ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="white"
                                         strokeWidth={2} className="w-3 h-3">
                                      <polyline points="3 6 5 6 21 6"/>
                                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Load more */}
                        {nextCursor && (
                          <div className="text-center mt-4">
                            <button
                              onClick={() => load(false)}
                              disabled={isLoading}
                              className="btn-secondary text-xs py-1.5"
                            >
                              {isLoading ? 'Loading...' : 'Load more'}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-5 border-t border-white/5">
              <div className="text-xs text-slate-500">
                {selected
                  ? `Selected: ${selected.publicId.split('/').pop()}`
                  : 'No asset selected'}
              </div>
              <div className="flex gap-2">
                <button onClick={onClose} className="btn-secondary text-xs">Cancel</button>
                {activeTab === 'browse' && (
                  <button
                    onClick={handleSelect}
                    disabled={!selected}
                    className="btn-primary text-xs disabled:opacity-40"
                  >
                    Use selected
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MediaPickerModal;