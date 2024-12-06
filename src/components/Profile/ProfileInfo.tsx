import React from 'react';

interface ProfileInfoProps {
  label: string;
  value: string;
}

export function ProfileInfoItem({ label, value }: ProfileInfoProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
      <p className="text-base text-gray-900">{value}</p>
    </div>
  );
}

export default function ProfileInfo() {
  return (
    <div className="mt-8">
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 mb-6">
        <span className="mr-2">●</span>
        Public
      </div>
      
      <ProfileInfoItem
        label="Full name"
        value="Connor Smith"
      />
      
      <ProfileInfoItem
        label="Company name"
        value="Smith Real Estate"
      />
      
      <ProfileInfoItem
        label="Industry"
        value="Real Estate Agent"
      />
      
      <ProfileInfoItem
        label="Location"
        value="Austin, Texas"
      />
      
      <ProfileInfoItem
        label="Career experience"
        value="6-10 years"
      />
      
      <ProfileInfoItem
        label="Social media"
        value="@connorsmith"
      />
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-1">About</h3>
        <p className="text-base text-gray-900">
          Experienced real estate agent specializing in luxury properties and investment opportunities.
          Passionate about helping clients find their dream homes and maximize their investments.
        </p>
      </div>
      
      <ProfileInfoItem
        label="Goals"
        value="Expand network, increase referrals, and grow social media presence"
      />
    </div>
  );
}