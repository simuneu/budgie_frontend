import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBxEPLFZVfEA8l36zatDh6sbh4AFmlzvnI",
  authDomain: "budgie-e5ef3.firebaseapp.com",
  projectId: "budgie-e5ef3",
  storageBucket: "budgie-e5ef3.appspot.com",
  messagingSenderId: "811923786228",
  appId: "1:811923786228:web:12ba52ab49cf84aaa5d1a1",
  measurementId: "G-742192J19J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);