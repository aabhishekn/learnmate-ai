import React, { useState } from 'react';
import axios from 'axios';

export default function AuthForm({ initialMode = 'sign-in' }) {
  const [mode, setMode] = useState(initialMode); // 'sign-in' or 'sign-up'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (mode === 'sign-in') {
        await axios.post('/api/auth/sign-in', { email, password });
        setSuccess('Signed in!');
      } else {
        await axios.post('/api/auth/sign-up', { email, password, name });
        setSuccess('Account created! You can now sign in.');
        setMode('sign-in');
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow max-w-md w-full">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l border border-indigo-600 text-indigo-700 font-semibold ${mode === 'sign-in' ? 'bg-indigo-100' : 'bg-white'}`}
            onClick={() => setMode('sign-in')}
            disabled={mode === 'sign-in'}
          >
            Sign In
          </button>
          <button
            className={`px-4 py-2 rounded-r border border-indigo-600 text-indigo-700 font-semibold ${mode === 'sign-up' ? 'bg-indigo-100' : 'bg-white'}`}
            onClick={() => setMode('sign-up')}
            disabled={mode === 'sign-up'}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === 'sign-up' && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading
              ? mode === 'sign-in'
                ? 'Signing In...'
                : 'Signing Up...'
              : mode === 'sign-in'
                ? 'Sign In'
                : 'Sign Up'}
          </button>
        </form>
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
        {success && (
          <div className="mt-4 text-green-600 text-center">{success}</div>
        )}
      </div>
    </div>
  );
}
