import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const Home = React.lazy(() => import('./pages/Home'));
const Pdfs = React.lazy(() => import('./pages/Pdfs'));
const PdfDetail = React.lazy(() => import('./pages/PdfDetail'));
const SignIn = React.lazy(() => import('./pages/SignIn'));

export default function App() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pdfs" element={<Pdfs />} />
        <Route path="/pdfs/:id" element={<PdfDetail />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </React.Suspense>
  );
}
