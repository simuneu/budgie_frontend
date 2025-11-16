export default function Sidebar() {
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
      <h2 className="text-xl font-semibold mb-4">Budgie</h2>

      <div className="mb-6">
        <p className="font-medium">사용자</p>
        <p className="text-gray-600 text-sm">user@example.com</p>
      </div>

      <nav className="flex flex-col gap-2">
        <a href="/dashboard" className="hover:text-blue-500">대시보드</a>
        <a href="/mypage" className="hover:text-blue-500">마이페이지</a>
      </nav>
    </div>
  );
}
