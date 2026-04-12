// Enhanced ImageUploader — pick from library OR upload new

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import useUpload from '@/hooks/useUpload';
import MediaPickerModal from './MediaPickerModal';

const ImageUploader = ({
  value,
  onChange,
  folder    = 'thumbnails',
  label     = 'Upload image',
  accept    = 'image/*',
  className = '',
  showLibraryPicker = true,
}) => {
  const [preview,       setPreview]       = useState(value?.url || null);
  const [pickerOpen,    setPickerOpen]    = useState(false);
  const { upload, uploading, progress }   = useUpload();
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    // Instant local preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    const media = await upload(file, { type: 'image', folder });
    if (media) {
      onChange(media);
      setPreview(media.url);
    } else {
      // Revert to previous on failure
      setPreview(value?.url || null);
    }
  };

  const handleLibrarySelect = (media) => {
    onChange(media);
    setPreview(media.url);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={className}>
      {preview ? (
        /* ── Preview state ──────────────────────────────────────── */
        <div className="relative rounded-xl overflow-hidden border border-white/10 group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-44 object-cover"
          />

          {/* Upload progress overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-surface-900/80 flex flex-col
                            items-center justify-center gap-3">
              <svg className="animate-spin w-7 h-7 text-brand-400"
                   viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor"
                        strokeWidth={2} className="opacity-25"/>
                <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor"
                      strokeWidth={2} strokeLinecap="round"/>
              </svg>
              <div className="w-32">
                <div className="h-1 bg-surface-700 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 transition-all duration-300"
                       style={{ width: `${progress}%` }}/>
                </div>
                <p className="text-xs text-slate-400 text-center mt-1">{progress}%</p>
              </div>
            </div>
          )}

          {/* Hover controls */}
          {!uploading && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100
                            transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Replace
              </button>
              {showLibraryPicker && (
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Library
                </button>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="btn-danger text-xs py-1.5 px-3"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ── Empty state ────────────────────────────────────────── */
        <div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-white/10 hover:border-brand-500/40
                       rounded-xl p-8 text-center cursor-pointer transition-colors group"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin w-8 h-8 text-brand-400"
                     viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor"
                          strokeWidth={2} className="opacity-25"/>
                  <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor"
                        strokeWidth={2} strokeLinecap="round"/>
                </svg>
                <div className="w-36">
                  <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 transition-all"
                         style={{ width: `${progress}%` }}/>
                  </div>
                  <p className="text-xs text-slate-500 text-center mt-1">{progress}%</p>
                </div>
              </div>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth={1.5} className="w-8 h-8 text-slate-600
                     group-hover:text-brand-400 mx-auto mb-3 transition-colors">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <p className="text-sm text-slate-400 mb-1">{label}</p>
                <p className="text-xs text-slate-600">
                  Drag & drop · JPG, PNG, WebP
                </p>
              </>
            )}
          </div>

          {/* Library picker button */}
          {showLibraryPicker && !uploading && (
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="w-full mt-2 btn-secondary text-xs py-2 justify-center"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth={1.5} className="w-3.5 h-3.5">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              Choose from library
            </button>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* Media picker modal */}
      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleLibrarySelect}
        resourceType="image"
        folder={`vickyvfx/${folder}`}
      />
    </div>
  );
};

export default ImageUploader;