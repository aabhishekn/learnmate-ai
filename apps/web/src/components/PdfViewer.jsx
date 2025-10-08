import React, { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';
import 'pdfjs-dist/web/pdf_viewer.css';
// Use public folder for worker in Vite dev (copy node_modules/pdfjs-dist/build/pdf.worker.mjs to public/)
// If you haven't already, copy the worker file:
// cp node_modules/pdfjs-dist/build/pdf.worker.mjs public/pdf.worker.mjs
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

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

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    pdfjs.getDocument(url).promise.then((doc) => {
      if (!isMounted) return;
      setPdf(doc);
      setNumPages(doc.numPages);
      setLoading(false);
      setPage(initialPage);
    });
    return () => {
      isMounted = false;
    };
  }, [url, initialPage]);

  useEffect(() => {
    if (!pdf || !page) return;
    pdf.getPage(page).then((p) => {
      const viewport = p.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      p.render({ canvasContext: context, viewport });
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
        <div className="text-gray-500 animate-pulse">Loading PDF...</div>
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
