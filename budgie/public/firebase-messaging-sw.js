self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

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
});

const messaging = firebase.messaging();

self.addEventListener("push", (event) => {

  if (!event.data) {
    return;
  }

  const payload = event.data.json();
  const title = payload.title || "알림";
  const body = payload.body || "";

  event.waitUntil(
    self.registration.showNotification(title, { body })
  );

  // 모든 클라이언트에 alert-update 전달
  event.waitUntil(
    self.clients.matchAll({ includeUncontrolled: true, type: "window" })
      .then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "alert-update" });
        });
      })
  );
});

messaging.onBackgroundMessage((payload) => {

  const title = payload.data?.title || "알림";
  const body = payload.data?.body || "";

  self.registration.showNotification(title, { body });

  self.clients.matchAll({ includeUncontrolled: true, type: "window" })
    .then((clients) => {

      clients.forEach((client) => {

        client.postMessage({ type: "alert-update" });
      });
    });
});
