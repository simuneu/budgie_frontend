importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBxEPLFZVfEA8l36zatDh6sbh4AFmlzvnI",
  authDomain: "budgie-e5ef3.firebaseapp.com",
  projectId: "budgie-e5ef3",
  storageBucket: "budgie-e5ef3.appspot.com",
  messagingSenderId: "811923786228",
  appId: "1:811923786228:web:12ba52ab49cf84aaa5d1a1",
  measurementId: "G-742192J19J"
})

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = `🔔 ${payload.data?.title || "알림"}`;
  const body = `🔔 ${payload.data?.body || ""}`;

  self.registration.showNotification(title, { body });
});