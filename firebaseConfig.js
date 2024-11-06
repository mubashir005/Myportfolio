// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbYsX2ljqEvroBEABD-qf8NIo6_kND_6s",
  authDomain: "myportfolio-dcdbd.firebaseapp.com",
  projectId: "myportfolio-dcdbd",
  storageBucket: "myportfolio-dcdbd.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "532110458721",
  appId: "1:532110458721:web:e1a08896cb2a46b4b94f20",
  measurementId: "G-MVDH9VC9BL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
