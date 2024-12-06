export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  companyName: string;
  industry: string;
  customIndustry?: string;
  careerExperience: string;
  location: string;
  socialMediaPlatform: string;
  socialMediaHandle: string;
  bio: string;
  goals: string;
  profilePhotoUrl?: string;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProfileFormData = Omit<UserProfile, 'uid' | 'email' | 'createdAt' | 'updatedAt' | 'isProfileComplete'>;