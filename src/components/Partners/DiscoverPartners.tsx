import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Dashboard/Sidebar';
import { Search, ChevronDown, User } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import LoadingScreen from '../LoadingScreen';

const industries = [
  'Title Agent',
  'Closing Attorney',
  'Real Estate Agent',
  'Mortgage Banker',
  'Home Inspector',
  'Appraiser',
  'Surveyor',
  'Pest Control Inspector',
  'Home Warranty Provider',
  'Settlement Agent',
  'Interior Designer',
  'Other'
];

function PartnerCard({ partner }: { partner: any }) {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-6 flex gap-6 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/partners/${partner.uid}`)}
    >
      {partner.profilePhotoUrl ? (
        <img
          src={partner.profilePhotoUrl}
          alt={partner.fullName}
          className="w-32 h-32 object-cover rounded-lg"
        />
      ) : (
        <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center">
          <User className="w-16 h-16 text-gray-400" />
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{partner.fullName}</h3>
        <p className="text-gray-600">{partner.companyName}</p>
        <p className="text-gray-500 text-sm mb-2">{partner.industry}</p>
        <p className="text-gray-600 mb-4">{partner.bio || 'No bio available'}</p>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Goals</h4>
          <p className="text-gray-600">{partner.goals}</p>
        </div>
      </div>
    </div>
  );
}

export default function DiscoverPartners() {
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const { users, loading, error } = useUsers();

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchQuery === '' || 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.industry.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesIndustry = selectedIndustry === '' || 
        user.industry === selectedIndustry;

      const matchesLocation = locationFilter === '' || 
        user.location.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesExperience = experienceFilter === '' || 
        user.careerExperience === experienceFilter;

      return matchesSearch && matchesIndustry && matchesLocation && matchesExperience;
    });
  }, [users, searchQuery, selectedIndustry, locationFilter, experienceFilter]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="text-red-600">Error loading partners: {error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Discover team partners</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, company, or industry"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            {/* Industry filter */}
            <div className="relative">
              <select 
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
              >
                <option value="">Filter by industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            {/* Location filter */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Experience filter */}
          <div className="flex justify-between items-center mb-8">
            <div className="relative w-64">
              <select 
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
              >
                <option value="">Filter by experience</option>
                <option value="0-2 years">0-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="6-10 years">6-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6 text-gray-600">
            Found {filteredUsers.length} potential partners
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 gap-6">
            {filteredUsers.map(partner => (
              <PartnerCard key={partner.uid} partner={partner} />
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No partners found matching your criteria
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}