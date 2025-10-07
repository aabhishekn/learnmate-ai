import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-4xl font-bold mb-4 text-indigo-700">Learnmate AI</h1>
      <p className="mb-8 text-lg text-gray-700 max-w-xl text-center">
        Upload your coursebook PDF or select a sample to generate quizzes, track your progress, and chat with your study material. Powered by AI, optimized for learning.
      </p>
      <div className="flex gap-4">
        <a href="/pdfs" className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">Upload or Choose Sample</a>
        <a href="/auth/sign-in" className="px-6 py-3 bg-white border border-indigo-600 text-indigo-700 rounded-lg shadow hover:bg-indigo-50 transition">Sign In</a>
      </div>
    </div>
  );
}
