import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { FormField } from '../FormField';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { AlertCircle } from 'lucide-react';
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

interface ProfileSetupData {
  companyName: string;
  industry: string;
  customIndustry: string;
  careerExperience: string;
  location: string;
  socialMediaPlatform: string;
  socialMediaHandle: string;
  bio: string;
  goals: string;
  profilePhoto: File | null;
}

export default function ProfileSetup() {
  const [formData, setFormData] = useState<ProfileSetupData>({
    companyName: '',
    industry: '',
    customIndustry: '',
    careerExperience: '',
    location: '',
    socialMediaPlatform: '',
    socialMediaHandle: '',
    bio: '',
    goals: '',
    profilePhoto: null
  });

  const [errors, setErrors] = useState<Partial<ProfileSetupData>>({});
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof ProfileSetupData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        profilePhoto: e.target.files![0]
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<ProfileSetupData> = {};
    
    if (!formData.companyName) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }
    if (formData.industry === 'Other' && !formData.customIndustry) {
      newErrors.customIndustry = 'Please specify your industry';
    }
    if (!formData.careerExperience) {
      newErrors.careerExperience = 'Career experience is required';
    }
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    if (!formData.socialMediaPlatform) {
      newErrors.socialMediaPlatform = 'Social media platform is required';
    }
    if (!formData.socialMediaHandle) {
      newErrors.socialMediaHandle = 'Social media handle is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm() || !currentUser) return;
  setLoading(true);
  setError('');
  
  // Ensure submit button is not disabled after completion
  try {
    let profilePhotoUrl = '';

    if (formData.profilePhoto) {
      const photoRef = ref(storage, `profile-photos/${currentUser.uid}`);
      const uploadResult = await uploadBytes(photoRef, formData.profilePhoto);
      profilePhotoUrl = await getDownloadURL(uploadResult.ref);
    }

    const userProfile = {
      uid: currentUser.uid,
      email: currentUser.email,
      fullName: currentUser.displayName,
      companyName: formData.companyName,
      industry: formData.industry === 'Other' ? formData.customIndustry : formData.industry,
      careerExperience: formData.careerExperience,
      location: formData.location,
      socialMediaPlatform: formData.socialMediaPlatform,
      socialMediaHandle: formData.socialMediaHandle,
      bio: formData.bio,
      goals: formData.goals,
      profilePhotoUrl,
      isProfileComplete: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(userRef, userProfile);

    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        unsubscribe();
        navigate('/'); // Navigate to dashboard after profile is confirmed in DB
      }
    });

  } catch (err) {
    console.error('Profile setup error:', err);
    setError('Failed to complete profile setup. Please try again.');
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#1d4e74] flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold text-white mb-8">REinfluence</h1>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-semibold text-[#1d4e74] mb-2 text-center">Complete your profile</h2>
        <p className="text-gray-600 text-center mb-6">Tell us more about yourself to get started</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Company name" error={errors.companyName} required>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter company name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
            />
          </FormField>

          <FormField label="Industry" error={errors.industry} required>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
            >
              <option value="">Select industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </FormField>

          {formData.industry === 'Other' && (
            <FormField label="Specify industry" error={errors.customIndustry} required>
              <input
                type="text"
                name="customIndustry"
                value={formData.customIndustry}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter your industry"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
              />
            </FormField>
          )}

          <FormField label="Career experience" error={errors.careerExperience} required>
            <select
              name="careerExperience"
              value={formData.careerExperience}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
            >
              <option value="">Select career experience</option>
              {experiences.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Location" error={errors.location} required>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter your location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
            />
          </FormField>

          <FormField label="Social media platform" error={errors.socialMediaPlatform} required>
            <select
              name="socialMediaPlatform"
              value={formData.socialMediaPlatform}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
            >
              <option value="">Select platform</option>
              {socialPlatforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Social media handle" error={errors.socialMediaHandle} required>
            <input
              type="text"
              name="socialMediaHandle"
              value={formData.socialMediaHandle}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter your handle (e.g. @username)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
            />
          </FormField>

          <FormField label="Bio">
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={loading}
              rows={3}
              placeholder="Tell us about yourself"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
            />
          </FormField>

          <FormField label="Goals">
            <input
              type="text"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              disabled={loading}
              placeholder="What are your goals?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
            />
          </FormField>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Profile photo (optional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#1d4e74] transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-[#1d4e74] hover:text-[#163a57] focus-within:outline-none">
                    <span>Upload a photo</span>
                    <input
                      type="file"
                      name="profilePhoto"
                      onChange={handleFileChange}
                      disabled={loading}
                      className="sr-only"
                      accept="image/*"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1d4e74] text-white py-2 px-4 rounded-md hover:bg-[#163a57] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d4e74] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Completing setup...' : 'Complete setup'}
          </button>
        </form>
      </div>
    </div>
  );
}