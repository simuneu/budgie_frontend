import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
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
      {/* 사이드바 */}
        <Sidebar />

      {/* 메인 섹션 */}
      <main className="flex-1 px-10 py-8 relative">
        <Outlet />
      </main>
    </div>
  );
}
