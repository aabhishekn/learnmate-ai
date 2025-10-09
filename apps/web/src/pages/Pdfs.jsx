import React, { useState } from 'react';
import PdfSourceSelector from '../components/PdfSourceSelector';
import { usePdfs } from '../hooks/usePdfs';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Pdfs() {
  const { pdfs, isLoading, uploadPdf, uploading } = usePdfs();
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState(null);
  // Use a session ID to isolate guest uploads per session/browser tab
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let sid = sessionStorage.getItem('guestSessionId');
      if (!sid) {
        sid = `${Date.now()}-${Math.random()}`;
        sessionStorage.setItem('guestSessionId', sid);
      }
      return sid;
    }
    return null;
  });
  // Only show guest PDFs for this session, reconstruct blob URLs from base64
  const [guestPdfs, setGuestPdfs] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('guestPdfs');
        const all = stored ? JSON.parse(stored) : [];
        return all
          .filter((p) => p.sessionId === sessionId)
          .map((p) => {
            if (p.base64) {
              try {
                const arr = p.base64.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                  u8arr[n] = bstr.charCodeAt(n);
                }
                const blob = new Blob([u8arr], { type: mime });
                const url = URL.createObjectURL(blob);
                return { ...p, url };
              } catch {
                return p;
              }
            }
            return p;
          });
      } catch {
        return [];
      }
    }
    return [];
  });
  const navigate = useNavigate();
  const location = useLocation();
  const isGuest = new URLSearchParams(location.search).get('guest') === '1';

  const handleUpload = async (file) => {
    if (isGuest) {
      // Read file as base64 and persist in localStorage, tagged with sessionId
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setGuestPdfs((prev) => {
          const newPdf = {
            id: `${Date.now()}-${Math.random()}`,
            title: file.name.replace(/\.pdf$/i, ''),
            filename: file.name,
            base64,
            sessionId,
          };
          let all = [];
          try {
            const stored = localStorage.getItem('guestPdfs');
            all = stored ? JSON.parse(stored) : [];
          } catch {}
          const updatedAll = [...all, newPdf];
          try {
            localStorage.setItem('guestPdfs', JSON.stringify(updatedAll));
          } catch {}
          return [...prev, newPdf];
        });
        setToast({
          type: 'success',
          msg: 'Upload successful (guest session only)!',
        });
        setTimeout(() => setToast(null), 3000);
      };
      reader.readAsDataURL(file);
      return;
    }
    try {
      await uploadPdf(file);
      setSelectedId(null);
      setToast({ type: 'success', msg: 'Upload successful!' });
    } catch (err) {
      setToast({
        type: 'error',
        msg: err?.response?.data?.error || 'Upload failed',
      });
    }
    setTimeout(() => setToast(null), 3000);
  };

  // When a PDF is selected, navigate to its detail page
  const handleSelect = (id) => {
    setSelectedId(id);
    if (id) {
      if (isGuest) {
        navigate(`/pdfs/${id}?guest=1`);
      } else {
        navigate(`/pdfs/${id}`);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <button
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition"
        onClick={() => navigate(isGuest ? '/?guest=1' : '/')}
      >
        Back to Home
      </button>
      <h2 className="text-2xl font-semibold mb-4">PDFs</h2>
      {isGuest && (
        <div className="mb-4 px-4 py-2 rounded shadow bg-yellow-100 text-yellow-800 border border-yellow-300">
          <b>Guest Mode:</b> You are using Learnmate AI as a guest. Sign up to
          save your progress and unlock all features.
        </div>
      )}
      {toast && (
        <div
          className={`mb-4 px-4 py-2 rounded shadow text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {toast.msg}
        </div>
      )}
      <PdfSourceSelector
        pdfs={isGuest ? guestPdfs : pdfs}
        uploading={uploading}
        selectedId={selectedId}
        onSelect={handleSelect}
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
