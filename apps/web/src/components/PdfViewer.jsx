import React, { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';
import 'pdfjs-dist/web/pdf_viewer.css';

// --- PDF.js worker setup (Vite friendly) ---
// In pdfjs-dist v4 the ESM worker can be bundled by importing its URL.
// We attempt multiple strategies so guest PDFs render without manual copying.
let workerConfigured = false;
try {
  // 1. Preferred: bundle worker via Vite using ?url so it is emitted as an asset.
  // This import will be statically analyzed by Vite.
  // eslint-disable-next-line import/no-unresolved
  const workerSrc = require('pdfjs-dist/build/pdf.worker.mjs?url');
  if (workerSrc && workerSrc.default) {
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc.default;
    workerConfigured = true;
  } else if (typeof workerSrc === 'string') {
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    workerConfigured = true;
  }
} catch (e) {
  // ignore and try dynamic import below
}

if (!workerConfigured) {
  // 2. Dynamic import fallback (some bundler configs):
  import('pdfjs-dist/build/pdf.worker.mjs?url')
    .then((mod) => {
      if (!workerConfigured) {
        const candidate = mod.default || mod;
        if (candidate) {
          // eslint-disable-next-line no-console
          console.log(
            '[PdfViewer] Configured worker from dynamic import:',
            candidate
          );
          pdfjs.GlobalWorkerOptions.workerSrc = candidate;
          workerConfigured = true;
        }
      }
    })
    .catch(() => {
      // 3. Last resort: legacy public path assumption (may 404 silently if missing)
      if (!workerConfigured) {
        // eslint-disable-next-line no-console
        console.warn(
          '[PdfViewer] Falling back to /pdf.worker.mjs; consider bundling with ?url import'
        );
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
      }
    });
}

export default function PdfViewer({
  url,
  initialPage = 1,
  onPageChange,
  scrollToPage,
}) {
  const [pdf, setPdf] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef();
  const containerRef = useRef();
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLoadError(null);
    pdfjs
      .getDocument(url)
      .promise.then((doc) => {
        if (!isMounted) return;
        setPdf(doc);
        setNumPages(doc.numPages);
        setLoading(false);
        setPage(initialPage);
      })
      .catch((err) => {
        if (!isMounted) return;
        setLoadError(err.message || 'Failed to load PDF');
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [url, initialPage]);

  useEffect(() => {
    if (!pdf || !page) return;
    pdf
      .getPage(page)
      .then((p) => {
        const viewport = p.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        return p.render({ canvasContext: context, viewport }).promise;
      })
      .catch((err) => {
        // Optionally, handle render errors here
      });
    if (onPageChange) onPageChange(page);
  }, [pdf, page, onPageChange]);

  useEffect(() => {
    if (typeof scrollToPage === 'number' && pdf) {
      setPage(scrollToPage);
    }
  }, [scrollToPage, pdf]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center w-full max-w-full"
    >
      {loading && (
        <div className="text-gray-500 animate-pulse">
          Loading PDF...
          <br />
          <span className="text-xs">{url}</span>
        </div>
      )}
      {loadError && (
        <div className="text-red-600 font-semibold mb-2">
          PDF Error: {loadError}
          <br />
          <span className="text-xs break-all">URL: {url}</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="rounded shadow mb-2 max-w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        tabIndex={0}
      />
      <div className="flex gap-2 items-center mt-2">
        <button
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} / {numPages}
        </span>
        <button
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onClick={() => setPage((p) => Math.min(numPages, p + 1))}
          disabled={page >= numPages}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}
