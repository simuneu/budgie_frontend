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
        <div className="hidden md:block w-60 ml-6 flex-shrink-0">
           <Sidebar onClose={() => {}} />
        </div>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 px-4 md:px-10 py-8">
          <Outlet />
        </main>
      </div>

      {/* 모바일 슬라이드 사이드바 */}
      {open && (
        <div className="fixed inset-0 z-[2000]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute top-14 left-0 w-60 h-[calc(100vh-3.5rem)] bg-white shadow-xl animate-slide-right">
            <Sidebar onClose={() => setOpen(false)} />
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
