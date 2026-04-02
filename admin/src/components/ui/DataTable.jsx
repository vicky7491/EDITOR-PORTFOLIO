import { useState } from 'react';
import { motion } from 'framer-motion';

const DataTable = ({
  columns,       // [{ key, label, render, sortable, width }]
  data,          // array of row objects
  isLoading,
  emptyMessage  = 'No data found',
  emptyIcon,
  onRowClick,
  rowKey        = '_id',
}) => {
  const [sortKey, setSortKey]   = useState(null);
  const [sortDir, setSortDir]   = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey] ?? '';
        const bVal = b[sortKey] ?? '';
        const cmp  = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  if (isLoading) {
    return (
      <div className="glass-card overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border-b border-white/5">
            {columns.map((col) => (
              <div key={col.key}
                   className="h-4 bg-surface-800 rounded animate-pulse"
                   style={{ width: col.width || '120px' }} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Head */}
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left px-4 py-3 text-xs font-medium
                    text-slate-500 uppercase tracking-wider whitespace-nowrap
                    ${col.sortable ? 'cursor-pointer select-none hover:text-slate-300' : ''}
                    transition-colors`}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="text-slate-600">
                        {sortKey === col.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ⇅'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    {emptyIcon && (
                      <div className="text-slate-600 opacity-40">{emptyIcon}</div>
                    )}
                    <p className="text-slate-500 text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <motion.tr
                  key={row[rowKey] || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-white/5 last:border-0
                    hover:bg-white/[0.02] transition-colors
                    ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-300">
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;