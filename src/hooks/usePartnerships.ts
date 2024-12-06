import { useState } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { PartnershipRequest, Partnership } from '../types/partnership';
import { useAuth } from '../contexts/AuthContext';

export function usePartnerships() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const requestPartnership = async (
    type: 'campaign' | 'event',
    itemId: string,
    creatorId: string,
    data: {
      content?: string;
      tags?: string[];
      photo?: File;
      agreeToPay?: boolean;
    }
  ) => {
    if (!currentUser) throw new Error('No authenticated user');

    setLoading(true);
    try {
      let photoUrl;
      if (data.photo) {
        const photoRef = ref(storage, `partnership-requests/${currentUser.uid}/${Date.now()}_${data.photo.name}`);
        const uploadResult = await uploadBytes(photoRef, data.photo);
        photoUrl = await getDownloadURL(uploadResult.ref);
      }

      const requestData = {
        requesterId: currentUser.uid,
        creatorId,
        type,
        [type === 'campaign' ? 'campaignId' : 'eventId']: itemId,
        status: 'pending',
        content: data.content || null,
        tags: data.tags || [],
        photoUrl: photoUrl || null,
        agreeToPay: data.agreeToPay || false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'partnership_requests'), requestData);
    } catch (err) {
      console.error('Error requesting partnership:', err);
      throw new Error('Failed to submit partnership request');
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (requestId: string) => {
    if (!currentUser) throw new Error('No authenticated user');

    setLoading(true);
    try {
      // Update request status
      const requestRef = doc(db, 'partnership_requests', requestId);
      await updateDoc(requestRef, {
        status: 'approved',
        updatedAt: serverTimestamp()
      });

      // Get request data
      const requestSnapshot = await getDocs(
        query(collection(db, 'partnership_requests'), where('id', '==', requestId))
      );
      const requestData = requestSnapshot.docs[0].data() as PartnershipRequest;

      // Create partnership
      const partnershipData = {
        partnerId: requestData.requesterId,
        creatorId: requestData.creatorId,
        type: requestData.type,
        [requestData.type === 'campaign' ? 'campaignId' : 'eventId']: 
          requestData.type === 'campaign' ? requestData.campaignId : requestData.eventId,
        status: 'active',
        paymentStatus: requestData.agreeToPay ? 'pending' : 'not_required',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'partnerships'), partnershipData);
    } catch (err) {
      console.error('Error approving partnership request:', err);
      throw new Error('Failed to approve partnership request');
    } finally {
      setLoading(false);
    }
  };

  const denyRequest = async (requestId: string) => {
    if (!currentUser) throw new Error('No authenticated user');

    setLoading(true);
    try {
      const requestRef = doc(db, 'partnership_requests', requestId);
      await updateDoc(requestRef, {
        status: 'denied',
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error denying partnership request:', err);
      throw new Error('Failed to deny partnership request');
    } finally {
      setLoading(false);
    }
  };

  const getPartnershipRequests = async (type?: 'sent' | 'received') => {
    if (!currentUser) throw new Error('No authenticated user');

    setLoading(true);
    try {
      let q;
      if (type === 'sent') {
        q = query(
          collection(db, 'partnership_requests'),
          where('requesterId', '==', currentUser.uid)
        );
      } else if (type === 'received') {
        q = query(
          collection(db, 'partnership_requests'),
          where('creatorId', '==', currentUser.uid)
        );
      } else {
        q = query(
          collection(db, 'partnership_requests'),
          where('requesterId', '==', currentUser.uid)
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PartnershipRequest[];
    } catch (err) {
      console.error('Error fetching partnership requests:', err);
      throw new Error('Failed to fetch partnership requests');
    } finally {
      setLoading(false);
    }
  };

  const getPartnerships = async (type?: 'partner' | 'creator') => {
    if (!currentUser) throw new Error('No authenticated user');

    setLoading(true);
    try {
      let q;
      if (type === 'partner') {
        q = query(
          collection(db, 'partnerships'),
          where('partnerId', '==', currentUser.uid)
        );
      } else if (type === 'creator') {
        q = query(
          collection(db, 'partnerships'),
          where('creatorId', '==', currentUser.uid)
        );
      } else {
        q = query(
          collection(db, 'partnerships'),
          where('partnerId', '==', currentUser.uid)
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Partnership[];
    } catch (err) {
      console.error('Error fetching partnerships:', err);
      throw new Error('Failed to fetch partnerships');
    } finally {
      setLoading(false);
    }
  };

  return {
    requestPartnership,
    approveRequest,
    denyRequest,
    getPartnershipRequests,
    getPartnerships,
    loading,
    error
  };
}