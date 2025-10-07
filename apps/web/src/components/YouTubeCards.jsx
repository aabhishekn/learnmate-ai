import React from 'react';

export default function YouTubeCards({ videos }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {videos.map(v => (
        <a
          key={v.id}
          href={`https://youtube.com/watch?v=${v.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded shadow hover:shadow-lg transition p-3 flex gap-3 items-center"
        >
          <img src={v.thumbnail} alt={v.title} className="w-24 h-16 object-cover rounded" />
          <div className="flex-1">
            <div className="font-semibold text-gray-800 mb-1 line-clamp-2">{v.title}</div>
            <div className="text-xs text-gray-500 mb-1">{v.channel}</div>
            <div className="text-xs text-gray-400">{new Date(v.publishedAt).toLocaleDateString()}</div>
          </div>
        </a>
      ))}
      {videos.length === 0 && <div className="text-gray-400 col-span-2">No videos found.</div>}
    </div>
  );
}
