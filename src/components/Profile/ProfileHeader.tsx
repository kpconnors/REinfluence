import React from 'react';
import { PenSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfileHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-gray-900">My profile</h1>
      <Link 
        to="/profile/edit" 
        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
      >
        <PenSquare className="h-4 w-4" />
        Edit profile
      </Link>
    </div>
  );
}