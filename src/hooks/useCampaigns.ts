import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Campaign } from '../types/campaign';
import { useAuth } from '../contexts/AuthContext';

export function useCampaigns(userId?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const { currentUser } = useAuth();

  const fetchCampaigns = async () => {
    if (!userId && !currentUser) return;
    
    setLoading(true);
    try {
      const campaignsRef = collection(db, 'campaigns');
      const q = query(
        campaignsRef,
        where('creatorId', '==', userId || currentUser?.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const campaignData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Campaign));
      
      setCampaigns(campaignData);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (
    data: Omit<Campaign, 'id' | 'creatorId' | 'createdAt' | 'updatedAt' | 'status'>,
    files: File[]
  ) => {
    if (!currentUser) throw new Error('No authenticated user');

    setLoading(true);
    try {
      const imageUrls: string[] = [];

      // Upload images
      for (const file of files) {
        const storageRef = ref(storage, `campaigns/${currentUser.uid}/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(uploadResult.ref);
        imageUrls.push(url);
      }

      // Create campaign document
      const campaignData = {
        ...data,
        creatorId: currentUser.uid,
        imageUrls,
        status: 'draft',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'campaigns'), campaignData);
      
      // Refresh campaigns list
      await fetchCampaigns();
      
      return docRef.id;
    } catch (err) {
      console.error('Error creating campaign:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [userId, currentUser]);

  return {
    campaigns,
    loading,
    error,
    createCampaign,
    fetchCampaigns
  };
}