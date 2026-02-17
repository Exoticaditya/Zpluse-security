import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAV4OZrDPTvBUk8SRs8RAsC6fzU8JnMpQk",
    authDomain: "zplusesecurity.firebaseapp.com",
    projectId: "zplusesecurity",
    storageBucket: "zplusesecurity.firebasestorage.app",
    messagingSenderId: "924842476805",
    appId: "1:924842476805:web:2794516aeb0e502c74e36c",
    measurementId: "G-M7H4YGD8DZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
