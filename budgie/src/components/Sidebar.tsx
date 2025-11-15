export default function Sidebar() {
  return (
    <div className="w-60 bg-white border-r p-4">
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
