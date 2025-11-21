import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import MainLayout from "./layout/MainLayout";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import axios from "axios";
import { toast } from "react-toastify";


export default function App() {

   useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || accessToken === "null") return;

    const requestFcmToken = async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey: "BAzITeF7t3SkLMEwposrrKE4Eniy8U_HEBRWvcAKvMTvvLczTQDCdFt6SKenUkwjfxqY_4BOlwkMymr5G8tBBTo"
        });

        console.log("FCM TOKEN:", token);

        if (token) {
          // 백엔드로 token 전송
          await axios.post("/api/fcm/token", { token });
        }
      } catch (err) {
        console.error("FCM token error:", err);
      }
    };
    navigator.serviceWorker.ready.then(() => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken || accessToken === "null") return;   // 로그인 안 되어 있으면 FCM 등록 금지

      requestFcmToken();
    });


    // 포그라운드 알림 수신
     const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message:", payload);

      const title = payload.data?.title ?? "알림";
      const body = payload.data?.body ?? "";

      toast.info(`🔔 ${title} - ${body}`, {
        position: "top-right",
        autoClose: 3000,
      });
    });

   

    // 컴포넌트 unmount 시 이벤트 해제
    return () => unsubscribe();
  }, []);



  return (
      <Routes>
        <Route path="/" element={<AuthPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
  );
}
