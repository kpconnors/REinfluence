import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Dashboard/Sidebar';
import { PenSquare, User } from 'lucide-react';
import AddPlanModal from './AddPlanModal';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const { userProfile } = useAuth();

  const handleSelectPlan = (planType: 'social' | 'event') => {
    console.log('Selected plan type:', planType);
    setIsAddPlanModalOpen(false);
    // Handle plan selection
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">My profile</h1>
            <Link 
              to="/profile/edit" 
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              <PenSquare className="h-4 w-4" />
              Edit profile
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center space-y-4">
                {userProfile.profilePhotoUrl ? (
                  <img
                    src={userProfile.profilePhotoUrl}
                    alt="Profile"
                    className="w-48 h-48 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-lg bg-gray-100 flex items-center justify-center">
                    <User className="w-24 h-24 text-gray-400" />
                  </div>
                )}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Public
                </span>
              </div>

              {/* Profile Information */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Full name</h2>
                  <p className="text-gray-600">{userProfile.fullName}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Company name</h2>
                  <p className="text-gray-600">{userProfile.companyName}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Industry</h2>
                  <p className="text-gray-600">{userProfile.industry}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Location</h2>
                  <p className="text-gray-600">{userProfile.location}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Career experience</h2>
                  <p className="text-gray-600">{userProfile.careerExperience}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Social media</h2>
                  <p className="text-gray-600">{userProfile.socialMediaHandle}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">About</h2>
                  <p className="text-gray-600">{userProfile.bio || 'No bio available'}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Goals</h2>
                  <p className="text-gray-600">{userProfile.goals}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cross-promotion Plans */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Cross-promotion plans</h2>
              <button 
                onClick={() => setIsAddPlanModalOpen(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                Add plan
              </button>
            </div>

            <div className="space-y-6">
              {/* Instagram Plan */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Brand awareness partnership</h3>
                <p className="text-gray-600 mb-4">Instagram post by Sept 17, 2024</p>
                
                <h4 className="font-medium text-gray-900 mb-2">What's included:</h4>
                <ul className="list-disc list-inside text-gray-600 mb-4">
                  <li>includes 01</li>
                  <li>includes 02</li>
                  <li>includes 03</li>
                </ul>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="bg-gradient-to-br from-blue-200 to-blue-400 rounded-lg aspect-square"></div>
                  ))}
                </div>
              </div>

              {/* LinkedIn Plan */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Brand awareness partnership</h3>
                <p className="text-gray-600 mb-4">LinkedIn post by Aug 18, 2024</p>
                
                <h4 className="font-medium text-gray-900 mb-2">What's included:</h4>
                <ul className="list-disc list-inside text-gray-600 mb-4">
                  <li>includes 01</li>
                  <li>includes 02</li>
                  <li>includes 03</li>
                </ul>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="bg-gradient-to-br from-blue-200 to-blue-400 rounded-lg aspect-square"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddPlanModal
        isOpen={isAddPlanModalOpen}
        onClose={() => setIsAddPlanModalOpen(false)}
        onSelectPlan={handleSelectPlan}
      />
    </div>
  );
}