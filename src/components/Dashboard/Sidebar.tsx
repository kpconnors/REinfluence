import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Users, CheckSquare, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="w-64 bg-[#1d4e74] text-white flex flex-col h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold">REinfluence</h1>
      </div>
      
      <nav className="flex-1">
        <Link to="/" className="flex items-center px-6 py-3 text-gray-100 hover:bg-[#163a57]">
          <Home className="h-5 w-5 mr-3" />
          Dashboard
        </Link>
        <Link to="/profile" className="flex items-center px-6 py-3 text-gray-100 hover:bg-[#163a57]">
          <User className="h-5 w-5 mr-3" />
          My profile
        </Link>
        <Link to="/partners" className="flex items-center px-6 py-3 text-gray-100 hover:bg-[#163a57]">
          <Users className="h-5 w-5 mr-3" />
          Discover team partners
        </Link>
        <Link to="/partners-campaigns" className="flex items-center px-6 py-3 text-gray-100 hover:bg-[#163a57]">
          <Users className="h-5 w-5 mr-3" />
          My partners & campaigns
        </Link>
        <Link to="/tasks" className="flex items-center px-6 py-3 text-gray-100 hover:bg-[#163a57]">
          <CheckSquare className="h-5 w-5 mr-3" />
          Tasks list
        </Link>
        <Link to="/messages" className="flex items-center px-6 py-3 text-gray-100 hover:bg-[#163a57]">
          <MessageSquare className="h-5 w-5 mr-3" />
          Messages
        </Link>
      </nav>
      
      <div className="p-6 border-t border-gray-700">
        <div className="flex items-center">
          {userProfile?.profilePhotoUrl ? (
            <img
              src={userProfile.profilePhotoUrl}
              alt="Profile"
              className="h-8 w-8 rounded-full mr-3 object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full mr-3 bg-gray-100 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <span className="text-sm">{userProfile?.fullName || currentUser?.email}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center mt-4 text-gray-300 hover:text-white transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Log out
        </button>
      </div>
    </div>
  );
}