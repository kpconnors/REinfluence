import { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types/user';
import { useAuth } from '../contexts/AuthContext';

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchUsers = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      // Query all users except the current user
      const q = query(usersRef, where('uid', '!=', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const userData = querySnapshot.docs
        .map(doc => doc.data() as UserProfile)
        .filter(user => user.isProfileComplete); // Only show users with complete profiles
      
      setUsers(userData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  return {
    users,
    loading,
    error,
    fetchUsers
  };
}