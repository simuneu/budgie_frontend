import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import AuthPage from './page/AuthPage.tsx'
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthPage />

  </React.StrictMode>,
)
