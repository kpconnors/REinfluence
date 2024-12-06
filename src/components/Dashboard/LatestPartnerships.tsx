import React from 'react';

const partnerships = [
  {
    id: 1,
    name: 'Partnership-name',
    status: 'Submission complete',
  },
  {
    id: 2,
    name: 'Partnership-name',
    status: 'Submission complete',
  },
  {
    id: 3,
    name: 'Partnership-name',
    status: 'Submission complete',
  },
  {
    id: 4,
    name: 'Partnership-name',
    status: 'Submission complete',
  },
  {
    id: 5,
    name: 'Partnership-name',
    status: 'Submission complete',
  },
];

export default function LatestPartnerships() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest partnerships</h2>
      <div className="space-y-4">
        {partnerships.map((partnership) => (
          <div key={partnership.id} className="flex justify-between items-center">
            <span className="font-medium text-gray-900">{partnership.name}</span>
            <span className="text-gray-500">{partnership.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}