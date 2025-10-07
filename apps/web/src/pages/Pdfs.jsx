import React, { useState } from 'react';
import PdfSourceSelector from '../components/PdfSourceSelector';
import { usePdfs } from '../hooks/usePdfs';

export default function Pdfs() {
  const { pdfs, isLoading, uploadPdf, uploading } = usePdfs();
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState(null);

  const handleUpload = async file => {
    try {
      await uploadPdf(file);
      setSelectedId(null);
      setToast({ type: 'success', msg: 'Upload successful!' });
    } catch (err) {
      setToast({ type: 'error', msg: err?.response?.data?.error || 'Upload failed' });
    }
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">PDFs</h2>
      {toast && (
        <div className={`mb-4 px-4 py-2 rounded shadow text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{toast.msg}</div>
      )}
      <PdfSourceSelector
        pdfs={pdfs}
        uploading={uploading}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onUpload={handleUpload}
      />
      {isLoading && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      )}
      {/* PDF viewer/quiz/progress tabs will go here */}
    </div>
  );
}
