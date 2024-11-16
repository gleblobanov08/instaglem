import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Import the functions you need from the SDKs you need
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAQzUnHYDg0Xg5OhXivsqRm3AeAY5JbOEg",
  authDomain: "instaglem-8b4f0.firebaseapp.com",
  databaseURL: "https://instaglem-8b4f0-default-rtdb.firebaseio.com",
  projectId: "instaglem-8b4f0",
  storageBucket: "instaglem-8b4f0.appspot.com",
  messagingSenderId: "600129860685",
  appId: "1:600129860685:web:5e26cf3fcf812191695804"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, onAuthStateChanged };