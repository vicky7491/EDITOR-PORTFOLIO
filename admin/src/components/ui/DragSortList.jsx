import { useState } from 'react';

/**
 * Simple drag-and-drop reorderable list.
 * No external DnD library needed — uses HTML5 drag events.
 * onReorder(newArray) called after each drop.
 */
const DragSortList = ({ items, onReorder, renderItem, keyProp = '_id' }) => {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverIndex(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newItems = [...items];
    const [moved]  = newItems.splice(dragIndex, 1);
    newItems.splice(index, 0, moved);

    // Assign new order values
    const reordered = newItems.map((item, i) => ({ ...item, order: i }));
    onReorder(reordered);
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={item[keyProp] || index}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`flex items-center gap-3 p-3 glass-card cursor-grab
            active:cursor-grabbing transition-all duration-150
            ${dragIndex === index ? 'opacity-40 scale-[0.98]' : ''}
            ${overIndex === index && dragIndex !== index
              ? 'border-brand-500/40 bg-brand-600/5' : ''}`}
        >
          {/* Drag handle */}
          <div className="text-slate-600 hover:text-slate-400 transition-colors shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={1.5} className="w-4 h-4">
              <circle cx="9"  cy="6"  r="1" fill="currentColor"/>
              <circle cx="9"  cy="12" r="1" fill="currentColor"/>
              <circle cx="9"  cy="18" r="1" fill="currentColor"/>
              <circle cx="15" cy="6"  r="1" fill="currentColor"/>
              <circle cx="15" cy="12" r="1" fill="currentColor"/>
              <circle cx="15" cy="18" r="1" fill="currentColor"/>
            </svg>
          </div>

          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

export default DragSortList;