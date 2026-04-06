import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  listMedia,
  searchMedia,
  getMediaUsage,
  bulkDeleteAssets,
  deleteAsset,
} from '@/api/mediaApi';
import useUpload    from '@/hooks/useUpload';
import ConfirmModal from '@/components/ui/ConfirmModal';
import SearchBar    from '@/components/ui/SearchBar';

const FOLDERS = [
  { value: 'cineedit',              label: 'All' },
  { value: 'cineedit/thumbnails',   label: 'Thumbnails' },
  { value: 'cineedit/videos',       label: 'Videos' },
  { value: 'cineedit/avatars',      label: 'Avatars' },
  { value: 'cineedit/services',     label: 'Services' },
  { value: 'cineedit/site',         label: 'Site' },
  { value: 'cineedit/before-after', label: 'Before/After' },
];

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const AssetCard = ({ asset, selected, onSelect, onDelete, deleting }) => {
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(asset.url)
      .then(() => toast.success('URL copied'))
      .catch(() => toast.error('Copy failed'));
  };

  return (
    <div
      onClick={() => onSelect(asset)}
      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer
        group transition-all duration-150
        ${selected
          ? 'ring-2 ring-brand-400 ring-offset-2 ring-offset-surface-950'
          : 'hover:ring-1 hover:ring-white/20'}`}
    >
      {/* Thumbnail */}
      <div className="w-full h-full bg-surface-800">
        {asset.resourceType === 'video' ? (
          <>
            {asset.thumbnailUrl
              ? <img src={asset.thumbnailUrl} alt="" className="w-full h-full object-cover"/>
              : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth={1.5} className="w-8 h-8 text-slate-600">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              )
            }
            <div className="absolute top-1.5 left-1.5">
              <span className="text-[9px] bg-surface-900/80 text-slate-400
                               px-1.5 py-0.5 rounded font-medium">
                VIDEO
              </span>
            </div>
          </>
        ) : (
          <img src={asset.url} alt="" className="w-full h-full object-cover" loading="lazy"/>
        )}
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full
                        bg-brand-500 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="white"
               strokeWidth={2.5} className="w-3 h-3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100
                      transition-opacity flex flex-col items-start justify-end p-2 gap-1">
        <p className="text-[9px] text-white/70 truncate w-full">
          {asset.publicId.split('/').pop()}
        </p>
        <div className="flex items-center justify-between w-full gap-1">
          <span className="text-[9px] text-white/50">{formatBytes(asset.bytes)}</span>
          <div className="flex gap-1">

            {/* Copy URL */}
            <button
              onClick={handleCopy}
              className="w-5 h-5 rounded bg-brand-600/80 flex items-center justify-center
                         hover:bg-brand-600 transition-colors shrink-0"
              title="Copy URL"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white"
                   strokeWidth={2} className="w-3 h-3">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>

            {/* Delete */}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(asset); }}
              disabled={deleting}
              className="w-5 h-5 rounded bg-red-600/80 flex items-center justify-center
                         hover:bg-red-600 transition-colors shrink-0"
              title="Delete"
            >
              {deleting ? (
                <svg className="animate-spin w-3 h-3 text-white" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2}
                          className="opacity-25"/>
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
      </div>
    </div>
  );
};

const MediaLibrary = () => {
  const [assets,       setAssets]       = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [nextCursor,   setNextCursor]   = useState(null);
  const [folder,       setFolder]       = useState('cineedit');
  const [resourceType, setResourceType] = useState('image');
  const [search,       setSearch]       = useState('');
  const [selected,     setSelected]     = useState(new Set());
  const [usage,        setUsage]        = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [deletingId,   setDeletingId]   = useState(null);

  const { upload, uploading, progress } = useUpload();

  // ── Load assets ──────────────────────────────────────────────────────────────
  const load = useCallback(async (reset = true, cursor = null) => {
    setIsLoading(true);
    try {
      if (search.length >= 2) {
        const res = await searchMedia(search, resourceType);
        setAssets(res.data.data || []);
        setNextCursor(null);
      } else {
        const res = await listMedia({
          folder, resource_type: resourceType,
          limit: 36, next_cursor: cursor,
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
  }, [folder, resourceType, search]);

  useEffect(() => {
    setSelected(new Set());
    load(true);
  }, [folder, resourceType]); // eslint-disable-line

  useEffect(() => {
    const t = setTimeout(() => { if (search.length !== 1) load(true); }, 450);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line

  // ── Load usage stats ─────────────────────────────────────────────────────────
  useEffect(() => {
    getMediaUsage().then((r) => setUsage(r.data.data)).catch(() => {});
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const toggleSelect = (asset) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(asset.publicId)) next.delete(asset.publicId);
      else next.add(asset.publicId);
      return next;
    });
  };

  const handleSingleDelete = async (asset) => {
    setDeletingId(asset.publicId);
    try {
      await deleteAsset(asset.publicId, resourceType);
      setAssets((prev) => prev.filter((a) => a.publicId !== asset.publicId));
      setSelected((prev) => { const n = new Set(prev); n.delete(asset.publicId); return n; });
      toast.success('Asset deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    setBulkDeleting(true);
    try {
      await bulkDeleteAssets([...selected], resourceType);
      setAssets((prev) => prev.filter((a) => !selected.has(a.publicId)));
      setSelected(new Set());
      toast.success(`Deleted ${selected.size} assets`);
    } catch {
      toast.error('Bulk delete failed');
    } finally {
      setBulkDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleUpload = async (file) => {
    const uploadFolder = folder.replace('cineedit/', '') || 'thumbnails';
    const media = await upload(file, { type: resourceType, folder: uploadFolder });
    if (media) {
      toast.success('Uploaded');
      load(true);
    }
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Media Library</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            All Cloudinary assets for this portfolio
          </p>
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <button
              onClick={() => setDeleteTarget('bulk')}
              disabled={bulkDeleting}
              className="btn-danger text-xs"
            >
              Delete {selected.size} selected
            </button>
          )}
          <label className="btn-primary text-xs cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={1.5} className="w-4 h-4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round"/>
            </svg>
            Upload
            <input
              type="file"
              accept={resourceType === 'video' ? 'video/*' : 'image/*'}
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
            />
          </label>
        </div>
      </div>

      {/* Usage stats */}
      {usage && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Storage used',  value: usage.storage.used },
            { label: 'Storage limit', value: usage.storage.limit },
            { label: 'Images',        value: usage.resources.images.toLocaleString() },
            { label: 'Videos',        value: usage.resources.videos.toLocaleString() },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4">
              <p className="text-xs text-slate-500 mb-0.5">{s.label}</p>
              <p className="text-base font-semibold text-slate-200">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Storage bar */}
      {usage && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Storage: {usage.storage.used} / {usage.storage.limit}</span>
            <span>{usage.storage.percent}%</span>
          </div>
          <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500
                ${parseFloat(usage.storage.percent) > 80 ? 'bg-red-500' : 'bg-brand-500'}`}
              style={{ width: `${Math.min(parseFloat(usage.storage.percent), 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 glass-card p-1 flex-wrap">
          {FOLDERS.map((f) => (
            <button key={f.value} onClick={() => setFolder(f.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                      ${folder === f.value
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'}`}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 glass-card p-1">
          {['image', 'video'].map((t) => (
            <button key={t} onClick={() => setResourceType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize
                      transition-all
                      ${resourceType === t
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'}`}>
              {t}s
            </button>
          ))}
        </div>

        <SearchBar
          onSearch={setSearch}
          placeholder="Search by filename..."
          className="flex-1 min-w-[200px]"
        />

        {selected.size > 0 && (
          <button onClick={() => setSelected(new Set())}
                  className="text-xs text-slate-500 hover:text-slate-300">
            Clear selection
          </button>
        )}
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <svg className="animate-spin w-4 h-4 text-brand-400 shrink-0"
                 viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor"
                      strokeWidth={2} className="opacity-25"/>
              <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor"
                    strokeWidth={2} strokeLinecap="round"/>
            </svg>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 bg-surface-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 transition-all"
                     style={{ width: `${progress}%` }}/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Asset grid */}
      {isLoading && assets.length === 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-surface-800 animate-pulse"/>
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}
               className="w-12 h-12 text-slate-700 mx-auto mb-3">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p className="text-slate-500 text-sm">No assets found</p>
          <p className="text-slate-600 text-xs mt-1">
            Upload files or try a different folder
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {assets.map((asset) => (
              <motion.div
                key={asset.publicId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <AssetCard
                  asset={asset}
                  selected={selected.has(asset.publicId)}
                  onSelect={toggleSelect}
                  onDelete={(a) => setDeleteTarget(a)}
                  deleting={deletingId === asset.publicId}
                />
              </motion.div>
            ))}
          </div>

          {nextCursor && (
            <div className="text-center">
              <button onClick={() => load(false, nextCursor)}
                      disabled={isLoading}
                      className="btn-secondary text-sm">
                {isLoading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget === 'bulk'
            ? handleBulkDelete()
            : handleSingleDelete(deleteTarget)
        }
        isLoading={bulkDeleting || !!deletingId}
        title={deleteTarget === 'bulk'
          ? `Delete ${selected.size} assets?`
          : 'Delete asset?'}
        description={deleteTarget === 'bulk'
          ? `${selected.size} files will be permanently deleted from Cloudinary.`
          : `"${typeof deleteTarget === 'object' ? deleteTarget?.publicId?.split('/').pop() : ''}" will be permanently deleted from Cloudinary.`}
        confirmLabel="Delete permanently"
      />
    </div>
  );
};

export default MediaLibrary;