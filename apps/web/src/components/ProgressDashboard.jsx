import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

export default function ProgressDashboard({ stats }) {
  // stats: { accuracyByType, attemptsTimeline, weakTopics }
  return (
    <div className="bg-white rounded shadow p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">Progress Dashboard</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2">Accuracy by Question Type</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.accuracyByType}>
              <XAxis dataKey="type" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h4 className="font-medium mb-2">Attempts Over Time</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.attemptsTimeline}>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-6">
        <h4 className="font-medium mb-2">Weak Topic Suggestions</h4>
        <ul className="list-disc pl-6 text-gray-700">
          {stats.weakTopics.length === 0 && <li>None! Keep it up.</li>}
          {stats.weakTopics.map((topic, i) => (
            <li key={i}>{topic}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
