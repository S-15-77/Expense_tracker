// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEwjHvet2qrqZG7npfDXzBLhR_9oB8yUo",
  authDomain: "expense-tracker-3def3.firebaseapp.com",
  projectId: "expense-tracker-3def3",
  storageBucket: "expense-tracker-3def3.firebasestorage.app",
  messagingSenderId: "832389353112",
  appId: "1:832389353112:web:1c4e189a4e974ecc9e8aed",
  measurementId: "G-1E1CMV1DSH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };