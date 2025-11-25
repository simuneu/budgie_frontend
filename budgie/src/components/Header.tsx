import axios from "../axiosConfig";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

interface Alert {
  alertId: number;
  message: string;
  read: boolean;
  createdAt?: string;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  // 🔥 알림 전체 가져오기
  const fetchAlerts = async () => {
    try {
      const res = await axios.get("/api/alert");
      setAlerts(res.data);
    } catch (err) {
      console.error("알림 목록 불러오기 실패:", err);
    }
  };

  // 🔥 미읽음 개수 가져오기
  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get("/api/alert/unread-count");
      setUnread(res.data);
    } catch (err) {
      console.error("미읽음 카운트 실패:", err);
    }
  };

  // 🔥 단건 읽음 처리
  const markAsRead = async (id: number) => {
    try {
      await axios.post(`/api/alert/${id}/read`);

      setAlerts((prev) =>
        prev.map((a) => (a.alertId === id ? { ...a, read: true } : a))
      );

      fetchUnreadCount();
      setOpen(false);
    } catch (err) {
      console.error("단건 읽음 실패:", err);
    }
  };

  // 🔥 전체 읽음 처리
  const markAllAsRead = async () => {
    try {
      await axios.put("/api/alert/read-all");

      setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
      setUnread(0);
    } catch (err) {
      console.error("전체 읽음 실패:", err);
    }
  };

  // 초기 로딩
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("로그인 안됨 → 알림 API 미호출");
      return;
    }

    fetchAlerts();
    fetchUnreadCount();
  }, []);

  // 패널 밖 클릭 시 닫기
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [open]);

  // 🔥🔥 FCM → Header 갱신 이벤트 수신 (방법 A 핵심)
  useEffect(() => {
    const handler = () => {
      console.log("🔄 alert-update 이벤트 감지 → Header 재로드");
      fetchAlerts();
      fetchUnreadCount();
    };

    window.addEventListener("alert-update", handler);

    return () => {
      window.removeEventListener("alert-update", handler);
    };
  }, []);

  return (
    <>
      <header
        className="
          fixed top-0 left-0 right-0
          h-14 bg-white backdrop-blur
          flex items-center 
          px-4 md:px-8
          shadow
          z-[9999]
        "
      >
        <div className="w-10 flex md:hidden">
          <button
            onClick={onMenuClick}
            className="text-2xl font-bold text-gray-500"
          >
            ☰
          </button>
        </div>

        <div className="flex-1 flex justify-center">
          <h1 className="text-lg font-semibold text-gray-600">BUDGIE</h1>
        </div>

        <div className="w-10 flex justify-end relative">
          <button
            className="text-2xl relative"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            🔔
          </button>

          {unread > 0 && (
            <span
              className="
                absolute -top-1 -right-1
                bg-red-500 text-white text-xs
                w-5 h-5 rounded-full
                flex items-center justify-center
              "
            >
              {unread}
            </span>
          )}
        </div>
      </header>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            className="
              fixed top-14 right-4
              w-56 max-h-72
              bg-white border shadow-lg rounded-xl
              p-3
              overflow-y-auto
              z-[99999]
            "
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-700">알림</h3>

              {alerts.length > 0 && unread > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  전체 읽음
                </button>
              )}
            </div>

            {alerts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                알림이 없어요
              </p>
            ) : (
              alerts.map((a) => (
                <div
                  key={a.alertId}
                  className={`
                    p-2 rounded-lg cursor-pointer transition-colors
                    text-sm
                    ${
                      a.read
                        ? "bg-gray-50 text-gray-400"
                        : "bg-pink-50 text-gray-600 hover:bg-pink-100"
                    }
                  `}
                  onClick={() => markAsRead(a.alertId)}
                >
                  {a.message}
                </div>
              ))
            )}
          </div>,
          document.body
        )}
    </>
  );
}
