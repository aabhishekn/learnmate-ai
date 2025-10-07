import React, { useRef } from 'react';

export default function PdfSourceSelector({ onUpload, onSelect, pdfs, uploading, selectedId }) {
  const fileInput = useRef();

  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 ${!selectedId ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'} transition`}
            onClick={() => onSelect(null)}
            aria-pressed={!selectedId}
          >
            All uploaded PDFs
          </button>
          <button
            className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 ${selectedId ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'} transition`}
            onClick={() => fileInput.current.click()}
            disabled={uploading}
            aria-label="Upload PDF"
          >
            Upload PDF
          </button>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInput}
            className="hidden"
            onChange={e => {
              if (e.target.files[0]) onUpload(e.target.files[0]);
            }}
            tabIndex={-1}
          />
        </div>
        <span className="text-sm text-gray-500">Select a PDF to view or quiz</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {pdfs.map(pdf => (
          <div
            key={pdf.id}
            className={`border rounded p-3 flex items-center justify-between cursor-pointer transition focus-within:ring-2 focus-within:ring-indigo-400 ${selectedId === pdf.id ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'}`}
            onClick={() => onSelect(pdf.id)}
            tabIndex={0}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelect(pdf.id)}
            aria-selected={selectedId === pdf.id}
            role="button"
          >
            <span className="font-medium text-gray-800">{pdf.title}</span>
            <span className="text-xs text-gray-500">{pdf.filename}</span>
          </div>
        ))}
        {pdfs.length === 0 && <div className="text-gray-400 col-span-2">No PDFs uploaded yet.</div>}
      </div>
    </div>
  );
}
