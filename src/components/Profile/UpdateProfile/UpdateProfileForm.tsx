import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { FormField } from '../../FormField';

interface ProfileFormData {
  fullName: string;
  userBio: string;
  companyName: string;
  location: string;
  industry: string;
  careerExperience: string;
  socialMedia: string;
  socialMediaHandle: string;
  goals: string;
  privacy: 'private' | 'public';
  profilePhoto: File | null;
}

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

const experiences = [
  '0-2 years',
  '3-5 years',
  '6-10 years',
  '10+ years'
];

const socialPlatforms = [
  'Instagram',
  'Twitter',
  'LinkedIn',
  'TikTok',
  'YouTube'
];

export default function UpdateProfileForm() {
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    userBio: '',
    companyName: '',
    location: '',
    industry: '',
    careerExperience: '',
    socialMedia: '',
    socialMediaHandle: '',
    goals: '',
    privacy: 'public',
    profilePhoto: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        profilePhoto: e.target.files![0]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
      <div className="space-y-6">
        <FormField label="Full name">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
          />
        </FormField>

        <FormField label="User bio">
          <textarea
            name="userBio"
            value={formData.userBio}
            onChange={handleChange}
            rows={3}
            placeholder="Enter user bio"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
          />
        </FormField>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Profile photo</h3>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#1d4e74] transition-colors">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-[#1d4e74] hover:text-[#163a57] focus-within:outline-none">
                  <span>Choose a new photo</span>
                  <input
                    type="file"
                    name="profilePhoto"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
            </div>
          </div>
        </div>

        <FormField label="Company name">
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
          />
        </FormField>

        <FormField label="Location">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Search by name or address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
          />
        </FormField>

        <FormField label="Industry (required)">
          <select
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
          >
            <option value="">Select industry</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Career experience (required)">
          <select
            name="careerExperience"
            value={formData.careerExperience}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
          >
            <option value="">Select career experience</option>
            {experiences.map(exp => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Social media (required)">
          <select
            name="socialMedia"
            value={formData.socialMedia}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
          >
            <option value="">Select social media</option>
            {socialPlatforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Social media handle">
          <input
            type="text"
            name="socialMediaHandle"
            value={formData.socialMediaHandle}
            onChange={handleChange}
            placeholder="Enter social media handle"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
          />
        </FormField>

        <FormField label="Goals">
          <input
            type="text"
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            placeholder="Enter goals"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
          />
        </FormField>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Privacy</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="privacy"
                value="private"
                checked={formData.privacy === 'private'}
                onChange={handleChange}
                className="h-4 w-4 text-[#1d4e74] focus:ring-[#1d4e74]"
              />
              <div className="ml-3">
                <label className="text-sm font-medium text-gray-900">Private</label>
                <p className="text-sm text-gray-500">Your profile is only visible to you and your exclusive partners</p>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="privacy"
                value="public"
                checked={formData.privacy === 'public'}
                onChange={handleChange}
                className="h-4 w-4 text-[#1d4e74] focus:ring-[#1d4e74]"
              />
              <div className="ml-3">
                <label className="text-sm font-medium text-gray-900">Public</label>
                <p className="text-sm text-gray-500">Your profile is public to all users and will be visible on the discover page</p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#1d4e74] text-white py-2 px-4 rounded-md hover:bg-[#163a57] transition-colors duration-200"
        >
          Update
        </button>
      </div>
    </form>
  );
}