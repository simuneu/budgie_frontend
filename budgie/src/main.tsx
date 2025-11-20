import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import axios from 'axios';
import { BrowserRouter } from "react-router-dom";
import App from './App';

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/firebase-messaging-sw.js")
    .then(() => {
      // console.log("SW registered");
    })
    .catch(err => console.log("SW registration failed", err));
}

