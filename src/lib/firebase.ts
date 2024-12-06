import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAqB0soEIyLP8LvqH7enG9Z5IyfR8WLKFI",
  authDomain: "reinfluence-iter0.firebaseapp.com",
  projectId: "reinfluence-iter0",
  storageBucket: "reinfluence-iter0.appspot.com",
  messagingSenderId: "605323705896",
  appId: "1:605323705896:web:9e759a6eb84803ade17f1d",
  measurementId: "G-QZ8YSFW5VG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth, Firestore, and Storage instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;