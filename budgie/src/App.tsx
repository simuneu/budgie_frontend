import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import MainLayout from "./layout/MainLayout";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AnalysisPage from "./pages/AnalysisPage";
import MyPage from "./pages/MyPage";
import { getMessagingSafe } from "./firebase";

export default function App() {
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || accessToken === "null") return;

    // 즉시 실행 async 함수
    (async () => {
      const messaging = await getMessagingSafe();
      if (!messaging) return;  // HTTP 환경에서는 messaging 사용 안 함

      const { getToken, onMessage } = await import("firebase/messaging");

      try {
        const token = await getToken(messaging, {
          vapidKey:
            "BAzITeF7t3SkLMEwposrrKE4Eniy8U_HEBRWvcAKvMTvvLczTQDCdFt6SKenUkwjfxqY_4BOlwkMymr5G8tBBTo",
        });

        if (token) {
          await axios.post("/api/fcm/token", { token });
        }
      } catch (err) {
        console.error("FCM token error:", err);
      }

      // foreground message
      const unsubscribe = onMessage(messaging, (payload) => {
        window.dispatchEvent(new Event("alert-update"));

        const title = payload.data?.title ?? "알림";
        const body = payload.data?.body ?? "";

        toast.info(`🔔 ${title} - ${body}`, {
          position: "top-right",
          autoClose: 3000,
        });
      });

      // cleanup
      return () => unsubscribe();
    })();
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
