// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0l1xfhs4PL_BsbuUyyeijhG0cKh8TGx8",
  authDomain: "moveease-2e1d1.firebaseapp.com",
  projectId: "moveease-2e1d1",
  storageBucket: "moveease-2e1d1.firebasestorage.app",
  messagingSenderId: "1036364971967",
  appId: "1:1036364971967:web:af94690a0c7e985a186b0a"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

export { app, auth, db };
