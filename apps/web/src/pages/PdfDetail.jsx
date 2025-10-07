import React from 'react';
import { useParams } from 'react-router-dom';

export default function PdfDetail() {
  const { id } = useParams();
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">PDF Detail: {id}</h2>
      <div className="bg-white rounded shadow p-4">PDF viewer, quiz, and progress tabs coming soon.</div>
    </div>
  );
}
