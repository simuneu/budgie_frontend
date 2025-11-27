import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";

interface UserInfo {
  userId: number;
  email: string;
  nickname: string;
}


export default function Sidebar() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const fetchMyInfo = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error("유저 정보 불러오기 실패", err);
    }
  };

  useEffect(() => {
  fetchMyInfo();

  const handleStorage = (e: StorageEvent) => {
    if (e.key === "nicknameChanged") {
      fetchMyInfo();
    }
  };

  const handleCustomEvent = () => {
    fetchMyInfo();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener("nicknameChanged", handleCustomEvent);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("nicknameChanged", handleCustomEvent);
  };
}, []);

  
  
  const handleLogout = async () => {
    try {
      await axios.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // 토큰 삭제
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      toast.success("로그아웃 되었습니다.");

      setShowLogoutModal(false);

      // 로그인 페이지로 이동
      navigate("/");
    } catch{
      toast.error("로그아웃 실패");
    }
  };

  return (
    <div className="
       /* 모바일 기본 스타일 */
        w-60 
        bg-white 
        backdrop-blur 
        shadow-lg 
        min-h-screen 
        px-6 py-8 
        relative 
        z-30
        
        /* 데스크탑 전용 스타일 */
        md:bg-white/70
        md:rounded-2xl       
        md:shadow-xl         
        md:sticky md:top-6   
        md:h-[calc(100vh-3rem)] 
        md:ml-6             
        md:mr-6              
        md:top-14
        md:mb-14
    ">
      <div className="mb-6 flex flex-col items-center text-center gap-2">
        {/* 병아리 프로필 */}
        <div
          className="
            w-14 h-14
            rounded-full 
            bg-yellow-200 
            flex items-center justify-center
            text-3xl
            shadow
          "
        >
          🐣
        </div>

        {/* 사용자 정보 */}
         {/* 닉네임 */}
        <p className="font-medium">
          {user ? user.nickname : "로딩중..."}
        </p>
        {/* 이메일 */}
        <p className="text-gray-600 text-sm">
          {user ? user.email : ""}
        </p>

      </div>

      {/* 네비게이션 */}
      <nav className="flex flex-col gap-2 items-center text-center">
        <Link to="/app/dashboard" className="hover:text-blue-500">
          대시보드
        </Link>

        <Link to="/app/analysis" className="hover:text-blue-500">
          소비 분석
        </Link>

        <Link to="/app/mypage" className="hover:text-blue-500">
          마이페이지
        </Link>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="mt-6 text-pink-500 hover:text-pink-600"
        >
          로그아웃
        </button>
      </nav>

      {/*로그아웃 모달 */}
      {showLogoutModal && (
        <ConfirmModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  );
}
