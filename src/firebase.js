
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-HMXZVwqR37fSW2Axe1NTKb3m8WnzNkk",
  authDomain: "surya-creations-auth.firebaseapp.com",
  projectId: "surya-creations-auth",
  storageBucket: "surya-creations-auth.firebasestorage.app",
  messagingSenderId: "876806449094",
  appId: "1:876806449094:web:8ea7bf73d00690fba334c7",
  measurementId: "G-PEXPYNHKXY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
