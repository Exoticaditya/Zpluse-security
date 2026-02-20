/**
 * Firebase Configuration
 * 
 * IMPORTANT: Firebase is OPTIONAL and used for file storage only.
 * Authentication is handled by backend JWT system.
 * 
 * If you don't need file storage, you can disable Firebase entirely
 * by setting VITE_USE_FIREBASE_STORAGE=false in .env
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase configuration
const isFirebaseConfigured = () => {
    return firebaseConfig.apiKey && 
           firebaseConfig.projectId && 
           firebaseConfig.apiKey !== 'your_api_key_here';
};

// Initialize Firebase only if properly configured
let app = null;
let db = null;
let storage = null;

if (isFirebaseConfigured()) {
    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        storage = getStorage(app);
        console.info('✅ Firebase initialized successfully (Storage mode)');
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error.message);
        console.warn('⚠️  Firebase features will be disabled');
    }
} else {
    console.warn('⚠️  Firebase not configured - storage features disabled');
    console.info('ℹ️  Authentication uses backend JWT (Firebase not required)');
}

export { db, storage };
export default app;
