import "./axiosConfig"; 
import ReactDOM from 'react-dom/client'
import './App.css'
// import axios from 'axios';
import { BrowserRouter } from "react-router-dom";
import App from './App';

const _toLocaleString = Number.prototype.toLocaleString;

Number.prototype.toLocaleString = function (
  ...args: Parameters<number["toLocaleString"]>
): string {
  const num = Number(this);

  if (!Number.isFinite(num)) {
    return "0";
  }

  return _toLocaleString.apply(this, args);
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (e) => {

    const msg = e.data || e;

    if (msg?.type === "alert-update") {
      window.dispatchEvent(new Event("alert-update"));
    }
  });
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/firebase-messaging-sw.js").then((reg) => {

    if (reg.waiting) {
      reg.waiting.postMessage({ type: "SKIP_WAITING" });
    }

    reg.addEventListener("updatefound", () => {
      const newWorker = reg.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          newWorker.postMessage({ type: "SKIP_WAITING" });
          window.location.reload();
        }
      });
    });
  });
}


