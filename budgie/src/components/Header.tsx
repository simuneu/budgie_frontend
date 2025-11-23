import axios from "axios";
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

  // 알림 불러오기
  const fetchAlerts = async () => {
    try {
      const res = await axios.get("/api/alert");
      setAlerts(res.data);
      setUnread(res.data.filter((a: Alert) => !a.read).length);
    } catch (err) {
      console.error(err);
    }
  };

  // 읽음 처리
  const markAsRead = async (id: number) => {
    try {
      await axios.post(`/api/alert/${id}/read`);
      fetchAlerts();
      setOpen(false); // 읽으면 닫히게
    } catch (err) {
      console.error(err);
    }
  };

  // 처음 로드시 알림 불러오기 (로그인 상태만)
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken || accessToken === "null" || accessToken === "undefined") {
      console.log("로그인 안됨 → 알림 API 호출하지 않음");
      return;
    }

    fetchAlerts();
  }, []);

  // 커튼 밖 클릭 시 닫기
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("click", handleClick);
    }
    return () => window.removeEventListener("click", handleClick);
  }, [open]);

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
        {/* 좌측 버튼 */}
        <div className="w-10 flex md:hidden">
          <button onClick={onMenuClick} className="text-2xl font-bold text-gray-500">
            ☰
          </button>
        </div>

        {/* 중앙 로고 */}
        <div className="flex-1 flex justify-center">
          <h1 className="text-lg font-semibold text-gray-600">BUDGIE</h1>
        </div>

        {/* 오른쪽 알림 */}
        <div className="w-10 flex justify-end relative">
          <button
            className="text-2xl relative"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
          >
            🔔
          </button>

          {/* 읽지 않은 개수 */}
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

      {/* 🔥 Portal 사용해서 Header 밖에 렌더링되도록 고정 */}
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
            <h3 className="font-semibold text-gray-700 mb-2">알림</h3>

            {alerts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">알림이 없어요</p>
            ) : (
              alerts.map((a) => (
                <div
                  key={a.alertId}
                  className={`
                   p-2 rounded-lg cursor-pointer transition-colors
                    text-sm font-normal leading-snug
                    ${a.read ? "bg-gray-50 text-gray-400" : "bg-pink-50 text-gray-600 hover:bg-pink-100"}
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
