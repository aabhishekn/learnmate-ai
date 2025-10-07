import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PdfViewer from '../components/PdfViewer';
import axios from 'axios';

export default function PdfDetail() {
  const { id } = useParams();
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/pdfs').then(res => {
      const found = res.data.find(p => p.id === id);
      setPdf(found);
    }).catch(() => setError('PDF not found'));
  }, [id]);

  if (error) return <div className="p-8">{error}</div>;
  if (!pdf) return <div className="p-8">Loading PDF...</div>;

  const url = `/uploads/${pdf.filename}`;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{pdf.title}</h2>
      <div className="bg-white rounded shadow p-4">
        <PdfViewer url={url} />
      </div>
    </div>
  );
}
