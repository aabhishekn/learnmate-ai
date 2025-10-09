import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import PdfViewer from '../components/PdfViewer';
import ProgressDashboard from '../components/ProgressDashboard';
import ChatDock from '../components/ChatDock';
import YouTubeCards from '../components/YouTubeCards';
import axios from 'axios';

function PdfDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isGuest = new URLSearchParams(location.search).get('guest') === '1';
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState(null);
  const [scrollToPage, setScrollToPage] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (isGuest) {
      // Get guest PDFs from localStorage
      let guestPdfs = [];
      try {
        const stored = localStorage.getItem('guestPdfs');
        guestPdfs = stored ? JSON.parse(stored) : [];
      } catch {}
      const found = guestPdfs.find((p) => p.id === id);
      console.log('[PdfDetail] Guest mode:', { id, found, guestPdfs });
      if (found) setPdf(found);
      else setError('PDF not found (guest session)');
      return;
    }
    axios
      .get('/api/pdfs')
      .then((res) => {
        const found = res.data.find((p) => p.id === id);
        setPdf(found);
      })
      .catch(() => setError('PDF not found'));
  }, [id, isGuest]);

  useEffect(() => {
    if (pdf?.title) {
      axios
        .get('/api/youtube/search', { params: { q: pdf.title } })
        .then((res) => setVideos(res.data))
        .catch(() => setVideos([]));
    }
  }, [pdf]);

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center gap-4">
        <div className="text-red-600 text-lg font-semibold">{error}</div>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition"
          onClick={() => navigate(isGuest ? `/pdfs?guest=1` : '/pdfs')}
        >
          Back to PDFs
        </button>
      </div>
    );
  }
  if (!pdf) {
    return <div className="p-8">Loading PDF...</div>;
  }

  // For guest, reconstruct blob URL from base64 if present; for signed-in, use backend URL
  let url = '';
  if (isGuest && pdf) {
    let debugInfo = {};
    if (pdf.base64) {
      try {
        const arr = pdf.base64.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        url = URL.createObjectURL(blob);
        debugInfo = {
          mime,
          byteLength: u8arr.length,
          blobSize: blob.size,
          url,
          base64Prefix: pdf.base64.slice(0, 40) + '...',
        };
      } catch (err) {
        url = pdf.url || '';
        debugInfo = { error: err && err.message, pdf, url };
      }
    } else {
      url = pdf.url || '';
      debugInfo = { fallback: true, pdf, url };
    }
    console.log('[PdfDetail] Using PDF url for guest:', url, pdf, debugInfo);
    // Debug output in UI for troubleshooting
    window._pdfDetailDebug = { pdf, url, debugInfo };
  } else if (pdf) {
    url = `/uploads/${pdf.filename}`;
  }

  // TODO: Replace with real stats from useProgress
  const stats = {
    accuracyByType: [
      { type: 'MCQ', accuracy: 80 },
      { type: 'SAQ', accuracy: 65 },
      { type: 'LAQ', accuracy: 50 },
    ],
    attemptsTimeline: [
      { date: '2025-10-01', score: 70 },
      { date: '2025-10-03', score: 80 },
      { date: '2025-10-05', score: 90 },
    ],
    weakTopics: ['Kinematics', 'Thermodynamics'],
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition"
        onClick={() => navigate(isGuest ? '/pdfs?guest=1' : '/pdfs')}
      >
        Back to PDFs
      </button>
      <h2 className="text-2xl font-semibold mb-4">{pdf.title}</h2>
      <div className="bg-white rounded shadow p-4 mb-6">
        <PdfViewer url={url} scrollToPage={scrollToPage} />
      </div>
      <ProgressDashboard stats={stats} />
      <ChatDock pdfId={id} onCitationClick={(page) => setScrollToPage(page)} />
      <YouTubeCards videos={videos} />
    </div>
  );
}

export default PdfDetail;
