import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Event } from '../types/event';
import { useAuth } from '../contexts/AuthContext';

export function useEvents(userId?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const { currentUser } = useAuth();

  const fetchEvents = async () => {
    if (!userId && !currentUser) return;
    
    setLoading(true);
    try {
      const eventsRef = collection(db, 'events');
      const q = query(
        eventsRef,
        where('creatorId', '==', userId || currentUser?.uid),
        orderBy('eventDate', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const eventData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Event));
      
      setEvents(eventData);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (
    data: Omit<Event, 'id' | 'creatorId' | 'createdAt' | 'updatedAt' | 'status'>,
    files: File[]
  ) => {
    if (!currentUser) throw new Error('No authenticated user');

    setLoading(true);
    try {
      const imageUrls: string[] = [];

      // Upload images
      for (const file of files) {
        const storageRef = ref(storage, `events/${currentUser.uid}/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(uploadResult.ref);
        imageUrls.push(url);
      }

      // Create event document
      const eventData = {
        ...data,
        creatorId: currentUser.uid,
        imageUrls,
        status: 'upcoming',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'events'), eventData);
      
      // Refresh events list
      await fetchEvents();
      
      return docRef.id;
    } catch (err) {
      console.error('Error creating event:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userId, currentUser]);

  return {
    events,
    loading,
    error,
    createEvent,
    fetchEvents
  };
}