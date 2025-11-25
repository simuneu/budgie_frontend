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
import AnalysisPage from "./pages/AnalysisPage";
import MyPage from "./pages/MyPage";


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

      // 1) Header에게 알림 업데이트 이벤트 전달
      window.dispatchEvent(new Event("alert-update"));

      // 2) 토스트 알림 보여주기
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
          path="/app"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analysis" element={<AnalysisPage />} />
        <Route path="mypage" element={<MyPage />} /> 
        </Route>
      </Routes>
  );
}
