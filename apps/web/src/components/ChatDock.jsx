import React, { useRef, useState } from 'react';
import CitationChip from './CitationChip';
import axios from 'axios';

export default function ChatDock({ pdfId, onCitationClick }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setMessages((msgs) => [...msgs, { role: 'user', content: input }]);
    try {
      const res = await axios.post('/api/chat/ask', { pdfId, message: input });
      setMessages((msgs) => [
        ...msgs,
        {
          role: 'assistant',
          content: res.data.answer,
          citations: res.data.citations,
        },
      ]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { role: 'assistant', content: 'Sorry, something went wrong.' },
      ]);
    }
    setInput('');
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white rounded shadow p-4 mt-6 max-w-full">
      <h3 className="text-lg font-semibold mb-2">Chat with your PDF</h3>
      <div className="h-48 overflow-y-auto mb-2 border rounded p-2 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              tabIndex={0}
              aria-label={
                msg.role === 'user' ? 'User message' : 'Assistant message'
              }
            >
              {typeof msg.content === 'object' && msg.content !== null
                ? msg.content.content || JSON.stringify(msg.content)
                : msg.content}
            </div>
            {msg.citations && (
              <div className="mt-1 flex flex-wrap">
                {msg.citations.map((c, j) => (
                  <CitationChip
                    key={j}
                    page={c.page}
                    quote={c.quote}
                    onClick={() => onCitationClick?.(c.page)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <form
        onSubmit={sendMessage}
        className="flex gap-2"
        aria-label="Chat input form"
      >
        <input
          ref={inputRef}
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          aria-label="Chat input"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          disabled={loading}
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  );
}
