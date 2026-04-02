import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import axiosAdmin from '@/api/axiosAdmin';

const VideoUploader = ({ value, onChange, label = 'Upload video' }) => {
  const [uploading,  setUploading]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('video', file);

    try {
      const res = await axiosAdmin.post(
        '/api/admin/upload/video',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            const pct = Math.round((e.loaded * 100) / e.total);
            setProgress(pct);
          },
        }
      );
      onChange(res.data.data);
      toast.success('Video uploaded successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Video upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      {value?.url ? (
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-brand-600/10 flex items-center
                            justify-center text-brand-400 shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth={1.5} className="w-5 h-5">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-300 truncate">
                Video uploaded
              </p>
              <p className="text-xs text-slate-500 truncate">{value.url}</p>
            </div>
          </div>

          {/* Preview */}
          <video
            src={value.url}
            controls
            className="w-full rounded-lg max-h-48 bg-surface-900"
          />

          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn-secondary text-xs flex-1"
            >
              Replace video
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="btn-danger text-xs"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-white/10 hover:border-brand-500/40
                     rounded-xl p-8 text-center cursor-pointer
                     transition-colors duration-200 group"
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
              <div className="w-full max-w-xs">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Uploading video...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth={1.5} className="w-8 h-8 text-slate-600
                   group-hover:text-brand-400 mx-auto mb-3 transition-colors">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              <p className="text-sm text-slate-400 mb-1">{label}</p>
              <p className="text-xs text-slate-600">
                MP4, MOV, WebM · Max 500MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
};

export default VideoUploader;