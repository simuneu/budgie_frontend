interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header
      className="
        fixed top-0 left-0 right-0
        h-14
        bg-white  
        backdrop-blur
        flex items-center justify-between
        px-4 md:px-8
        shadow
        z-40
      "
    >
      {/* 왼쪽 영역 */}
      <div className="flex items-center gap-3">
        {/* 모바일 햄버거 */}
        <button
          onClick={onMenuClick}
          className="text-2xl font-bold md:hidden !text-gray-500"
        >
          ☰
        </button>

        {/* 타이틀 */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold text-gray-600">
            BUDGIE
        </h1>
      </div>

      {/* 오른쪽 영역 (데스크탑 전용) */}
      <div className="hidden md:flex items-center gap-4">
        🐥
      </div>

      {/* 모바일 균형용 오른쪽 여백 */}
      <div className="md:hidden w-6" />
    </header>
  );
}
