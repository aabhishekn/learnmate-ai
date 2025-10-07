import React, { useState } from 'react';
import PdfSourceSelector from '../components/PdfSourceSelector';
import { usePdfs } from '../hooks/usePdfs';

export default function Pdfs() {
  const { pdfs, isLoading, uploadPdf, uploading } = usePdfs();
  const [selectedId, setSelectedId] = useState(null);

  const handleUpload = async file => {
    try {
      await uploadPdf(file);
      setSelectedId(null);
    } catch (err) {
      alert(err?.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">PDFs</h2>
      <PdfSourceSelector
        pdfs={pdfs}
        uploading={uploading}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onUpload={handleUpload}
      />
      {isLoading && <div className="text-gray-500">Loading PDFs...</div>}
      {/* PDF viewer/quiz/progress tabs will go here */}
    </div>
  );
}
