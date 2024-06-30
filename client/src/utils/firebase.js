import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBPw-jnOu3E3ltS7EFspghgVOJH9Ox_HAU",
  authDomain: "examsaathi-9d293.firebaseapp.com",
  projectId: "examsaathi-9d293",
  storageBucket: "examsaathi-9d293.appspot.com",
  messagingSenderId: "230794409225",
  appId: "1:230794409225:web:f35b6ea95f08097fc6cfd8",
  measurementId: "G-RXQW2FJJEP",
};
// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

