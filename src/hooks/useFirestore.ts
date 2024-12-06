import { 
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useFirestore(collectionName: string) {
  const collectionRef = collection(db, collectionName);

  const add = async (data: any) => {
    return addDoc(collectionRef, {
      ...data,
      createdAt: new Date().toISOString()
    });
  };

  const update = async (id: string, data: any) => {
    const docRef = doc(db, collectionName, id);
    return updateDoc(docRef, data);
  };

  const remove = async (id: string) => {
    const docRef = doc(db, collectionName, id);
    return deleteDoc(docRef);
  };

  const get = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (err) {
      console.error(`Error getting document from ${collectionName}:`, err);
      throw err;
    }
  };

  const getAll = async () => {
    try {
      const querySnapshot = await getDocs(collectionRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      console.error(`Error getting all documents from ${collectionName}:`, err);
      throw err;
    }
  };

  const getWhere = async (...queryConstraints: QueryConstraint[]) => {
    try {
      const q = query(collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      console.error(`Error querying ${collectionName}:`, err);
      throw err;
    }
  };

  return {
    add,
    update,
    remove,
    get,
    getAll,
    getWhere
  };
}