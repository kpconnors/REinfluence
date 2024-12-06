import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function WelcomeCard() {
  const { userProfile } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Hello {userProfile?.fullName || 'Guest'}, welcome back!
      </h1>
      <p className="text-gray-500 mt-1">Track your partnerships and campaign progress</p>
    </div>
  );
}