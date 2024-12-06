import React from 'react';
import Sidebar from '../../Dashboard/Sidebar';
import UpdateProfileForm from './UpdateProfileForm';

export default function UpdateProfile() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Update profile</h1>
          <UpdateProfileForm />
        </div>
      </main>
    </div>
  );
}