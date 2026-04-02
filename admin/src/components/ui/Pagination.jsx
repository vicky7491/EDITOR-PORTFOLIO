const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = meta;
  const start = (page - 1) * limit + 1;
  const end   = Math.min(page * limit, total);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || i === totalPages ||
      (i >= page - 1 && i <= page + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <p className="text-slate-500">
        Showing <span className="text-slate-300">{start}–{end}</span> of{' '}
        <span className="text-slate-300">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!meta.hasPrevPage}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100
                     hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed
                     transition-colors"
        >
          ←
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="px-2 text-slate-600">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                ${page === p
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!meta.hasNextPage}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100
                     hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed
                     transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Pagination;