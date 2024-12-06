import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#1d4e74] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
        <p className="text-lg">Loading...</p>
      </div>
    </div>
  );
}