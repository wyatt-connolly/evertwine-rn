import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
// Note: getReactNativePersistence might not be available in this Firebase version
// We'll use a simpler approach without persistence for now
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration - using the same project as the Flutter app
const firebaseConfig = {
  apiKey: "AIzaSyBM1Cwq71TQiBoOFlTLRbBc95EZpQ7UFA0",
  authDomain: "evertwine-qm8y7p.firebaseapp.com",
  projectId: "evertwine-qm8y7p",
  storageBucket: "evertwine-qm8y7p.appspot.com",
  messagingSenderId: "177107134327",
  appId: "1:177107134327:web:805df5fec75b3432e8e372",
  // measurementId: "G-XXXXXXXXXX", // Add your measurement ID if you have one
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
let auth: any;
try {
  auth = initializeAuth(app);
} catch (error) {
  // If already initialized, get the existing instance
  auth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Initialize Functions
const functions = getFunctions(app);

// Initialize Analytics (only for web and when supported)
let analytics: any = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log("Analytics not supported in this environment");
  }
}

// Connect to emulators in development
if (__DEV__) {
  // Uncomment these lines if you want to use Firebase emulators
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectStorageEmulator(storage, 'localhost', 9199);
  // connectFunctionsEmulator(functions, 'localhost', 5001);
}

export { auth, db, storage, functions, analytics };
export default app;
