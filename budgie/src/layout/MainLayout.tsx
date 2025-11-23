import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="
        min-h-screen 
        bg-gradient-to-br 
        from-teal-200 via-pink-100 to-white
        bg-[length:400%_400%]
        animate-gradient-move
        relative
      "
    >
      {/* 상단 헤더: 모바일/데탑 공통 */}
      <Header onMenuClick={() => setOpen(true)} />

      <div className="flex pt-14 md:pt-16">
        {/* 데스크탑 사이드바 */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 px-4 md:px-10 py-8">
          <Outlet />
        </main>
      </div>

      {/* 모바일 슬라이드 사이드바 */}
      {open && (
        <div className="fixed inset-0 z-20">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute top-0 left-0 w-60 h-full bg-white animate-slide-right backdrop-blur shadow-xl">
            <Sidebar />
            <button
              className="absolute top-4 right-4 text-xl"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
