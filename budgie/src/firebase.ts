// firebase.ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBxEPLFZVfEA8l36zatDh6sbh4AFmlzvnI",
  authDomain: "budgie-e5ef3.firebaseapp.com",
  projectId: "budgie-e5ef3",
  storageBucket: "budgie-e5ef3.appspot.com",
  messagingSenderId: "811923786228",
  appId: "1:811923786228:web:12ba52ab49cf84aaa5d1a1",
  measurementId: "G-742192J19J"
};

export const app = initializeApp(firebaseConfig);

export async function getMessagingSafe() {
  const isSupportedEnv =
    window.location.protocol === "https:" ||
    window.location.hostname === "localhost";

  if (!isSupportedEnv) {
    // console.log("⚠️ FCM disabled (HTTP environment)");
    return null;
  }

  try {
    const { getMessaging } = await import("firebase/messaging");
    return getMessaging(app);
  } catch {
    // console.error("Messaging init error:", err);
    return null;
  }
}
