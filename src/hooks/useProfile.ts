import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { ProfileFormData, UserProfile } from '../types/user';

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (userId: string, data: ProfileFormData, photoFile?: File) => {
    setLoading(true);
    setError(null);

    try {
      let photoUrl = data.profilePhotoUrl;

      if (photoFile) {
        const storageRef = ref(storage, `profile-photos/${userId}`);
        const uploadResult = await uploadBytes(storageRef, photoFile);
        photoUrl = await getDownloadURL(uploadResult.ref);
      }

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...data,
        profilePhotoUrl: photoUrl,
        isProfileComplete: true,
        updatedAt: new Date().toISOString()
      });

      return true;
    } catch (err) {
      setError('Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
    error
  };
}