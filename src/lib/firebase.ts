import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnVfoN_UGQTd_AGb5Ol5yF0fWiquUbUm8",
  authDomain: "artcard-5c958.firebaseapp.com",
  projectId: "artcard-5c958",
  storageBucket: "artcard-5c958.firebasestorage.app",
  messagingSenderId: "291167753109",
  appId: "1:291167753109:web:b63219b0272f7ca1df5c9c",
  measurementId: "G-4639N5NV7Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, signInWithPopup, signOut, onAuthStateChanged, collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc };
export type { User };
