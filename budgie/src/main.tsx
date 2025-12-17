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

// axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "";
// axios.defaults.withCredentials = true;

// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // accessToken 만료 → refresh 필요
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem("refreshToken");
//         if (!refreshToken) {
//           throw new Error("No refresh token");
//         }

//         // refresh API 호출
//         const res = await axios.post("/auth/refresh", {
//           refreshToken,
//         });

//         // 새 액세스토큰 저장
//         localStorage.setItem("accessToken", res.data.accessToken);

//         // 헤더 추가 후 원래 요청 재시도
//         originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

//         return axios(originalRequest);

//       } catch {

//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");

//         window.location.href = "/"; // 로그인 페이지로 이동
//       }
//     }

//     return Promise.reject(error);
//   }
// );


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


