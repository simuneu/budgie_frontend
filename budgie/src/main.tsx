import ReactDOM from 'react-dom/client'
import './App.css'
import axios from 'axios';
import { BrowserRouter } from "react-router-dom";
import App from './App';

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (e) => {
    console.log("SW → main listener", e.data);

    const msg = e.data || e;

    if (msg?.type === "alert-update") {
      console.log("dispatch alert-update !");
      window.dispatchEvent(new Event("alert-update"));
    }
  });
}

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "";
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then(() => console.log("SW registered"))
    .catch((err) => console.log("SW registration failed", err));
}

