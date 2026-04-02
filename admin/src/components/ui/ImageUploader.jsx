import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import axiosAdmin from '@/api/axiosAdmin';

const ImageUploader = ({
  value,           // { url, publicId }
  onChange,        // (media) => void
  folder = 'thumbnails',
  label  = 'Upload image',
  accept = 'image/*',
  className = '',
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview,   setPreview]   = useState(value?.url || null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    // Client-side preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload to Cloudinary via backend
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axiosAdmin.post(
        `/api/admin/upload/image?folder=${folder}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      onChange(res.data.data);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
      setPreview(value?.url || null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={className}>
      {preview ? (
        /* Preview state */
        <div className="relative rounded-xl overflow-hidden border border-white/10 group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100
                          transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="btn-danger text-xs py-1.5 px-3"
            >
              Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-surface-900/80 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <svg className="animate-spin w-6 h-6 text-brand-400"
                     viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor"
                          strokeWidth={2} className="opacity-25"/>
                  <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor"
                        strokeWidth={2} strokeLinecap="round"/>
                </svg>
                <p className="text-xs text-slate-400">Uploading...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-white/10 hover:border-brand-500/40
                     rounded-xl p-8 text-center cursor-pointer
                     transition-colors duration-200 group"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="animate-spin w-8 h-8 text-brand-400"
                   viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor"
                        strokeWidth={2} className="opacity-25"/>
                <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor"
                      strokeWidth={2} strokeLinecap="round"/>
              </svg>
              <p className="text-sm text-slate-400">Uploading...</p>
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
                Drag & drop or click to browse · JPG, PNG, WebP
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
};

export default ImageUploader;