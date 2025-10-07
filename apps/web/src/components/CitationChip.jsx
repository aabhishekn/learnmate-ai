import React from 'react';

export default function CitationChip({ page, quote, onClick }) {
  return (
    <button
      className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium mr-2 mb-2 hover:bg-indigo-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
      onClick={onClick}
      title={`Jump to page ${page}`}
      type="button"
      tabIndex={0}
      aria-label={`Jump to page ${page}`}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
      <span className="font-bold mr-1">p.{page}</span>
      <span className="truncate max-w-xs">“{quote}”</span>
    </button>
  );
}
