import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth'; // Using correct React Native initialization
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD3BA0gVh8OwxqghmCKlR00m_oq3aC4Ha8",
  authDomain: "social-connect-nimra.firebaseapp.com",
  projectId: "social-connect-nimra",
  storageBucket: "social-connect-nimra.firebasestorage.app",
  messagingSenderId: "115016987789",
  appId: "1:115016987789:web:2d25cda5cbdf3b951a1ec4"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;