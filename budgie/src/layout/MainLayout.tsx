import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function MainLayout() {
   const [open, setOpen] = useState(false);

  return (
     <div
      className="
        min-h-screen 
        flex 
        bg-gradient-to-br 
        from-teal-200 via-pink-100 to-white 
        bg-[length:400%_400%] 
        animate-gradient-move
      "
    >
      {/* 데스크탑 사이드바 */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* 모바일 햄버거 버튼 */}
      {/* 사이드바 열려 있으면 숨김 */}
      {!open && (
        <button
          className="
            md:hidden 
            fixed top-4 left-4 
            z-50 
            bg-white/80 backdrop-blur 
            px-3 py-2 rounded-lg shadow
          "
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      )}


      {/* 모바일 슬라이드 사이드바 */}
      {open && (
        <div className="fixed inset-0 z-40">
          {/* 오버레이 */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* 슬라이드 패널 */}
          <div className="absolute top-0 left-0 w-60 h-full bg-white/90 backdrop-blur shadow-xl animate-slide-right">
            <Sidebar />

            {/* 닫기 버튼(X) */}
            <button
              className="absolute top-4 right-4 text-xl"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}


      {/* 메인 콘텐츠 */}
      <main className="flex-1 px-10 py-8 relative">
        <Outlet />
      </main>
    </div>
  );
}
