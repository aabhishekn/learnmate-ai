import React, { useState } from 'react';
import AuthForm from './SignIn';

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('sign-in');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-4xl font-bold mb-4 text-indigo-700">Learnmate AI</h1>
      <p className="mb-8 text-lg text-gray-700 max-w-xl text-center">
        Upload your coursebook PDF or select a sample to generate quizzes, track
        your progress, and chat with your study material. Powered by AI,
        optimized for learning.
      </p>
      <div className="flex gap-4">
        <a
          href="/pdfs?guest=1"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Try as Guest
        </a>
        <button
          className="px-6 py-3 bg-white border border-indigo-600 text-indigo-700 rounded-lg shadow hover:bg-indigo-50 transition"
          onClick={() => {
            setShowAuth(true);
            setAuthMode('sign-in');
          }}
        >
          Sign In
        </button>
        <button
          className="px-6 py-3 bg-white border border-indigo-600 text-indigo-700 rounded-lg shadow hover:bg-indigo-50 transition"
          onClick={() => {
            setShowAuth(true);
            setAuthMode('sign-up');
          }}
        >
          Sign Up
        </button>
      </div>
      {showAuth && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200"
          style={{
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="relative animate-fadeInUp flex flex-col items-center justify-center"
            style={{
              width: 'min(90vw, 400px)',
              height: 'min(90vw, 400px)',
              borderRadius: '1.75rem',
              background: 'rgba(255,255,255,0.82)',
              boxShadow:
                '0 8px 32px 0 rgba(31, 38, 135, 0.22), 0 1.5px 8px 0 rgba(99,102,241,0.10)',
              padding: '1.25rem',
              position: 'relative',
              border: '1.5px solid rgba(99,102,241,0.13)',
              margin: '0 1rem',
              overflow: 'hidden',
              transition: 'box-shadow 0.2s',
            }}
          >
            <button
              className="absolute top-2.5 right-2.5 text-gray-400 hover:text-indigo-600 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white bg-opacity-80 rounded-full shadow"
              onClick={() => setShowAuth(false)}
              aria-label="Close"
              style={{
                zIndex: 10,
                width: '2rem',
                height: '2rem',
                lineHeight: '2rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
                border: 'none',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: '2rem',
                  lineHeight: '2rem',
                  fontWeight: 600,
                }}
              >
                &times;
              </span>
            </button>
            <div style={{ width: '100%', maxWidth: '320px' }}>
              <AuthForm initialMode={authMode} />
            </div>
          </div>
          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(40px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeInUp {
              animation: fadeInUp 0.25s cubic-bezier(.4,2,.6,1);
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
