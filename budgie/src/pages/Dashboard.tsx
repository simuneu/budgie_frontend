import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface GoalResponse {
  year: number;
  month: number;
  goalAmount: number;
}

export default function Dashboard() {
  const [goal, setGoal] = useState<GoalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  useEffect(() => {
    fetchGoal();
  }, []);

  // 🔹 이번달 목표 조회
  const fetchGoal = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get("/api/budget/goal", {
        params: { year, month },
        headers: { Authorization: `Bearer ${token}` },
      });

      setGoal(res.data);
    } catch {
      setGoal(null);
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중
  if (loading) return <div className="p-10">불러오는 중...</div>;

  // 목표가 없을 때 → 목표 입력 페이지로 이동하거나 모달 띄울 예정
  if (!goal) {
    return (
      <div className="p-10">
        <h2 className="text-3xl font-bold mb-4">이번 달 목표가 아직 없어요</h2>
        <p className="text-gray-600">예산을 설정해볼까요?</p>

        {/* 나중에 모달 or 목표 입력 페이지 연결 */}
        <button
          className="mt-4 px-6 py-3 bg-pink-400 text-white rounded-lg shadow-md hover:bg-pink-500"
          onClick={() => toast.info("목표 입력 모달 만들 예정!")}
        >
          목표 설정하기
        </button>
      </div>
    );
  }

  // 목표가 있을 때 → 실제 대시보드
  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold mb-6">
        {year}년 {month}월 소비 요약
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 목표 금액 */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500">월 목표 금액</p>
          <p className="text-2xl font-bold">{goal.goalAmount.toLocaleString()} 원</p>
        </div>

        {/* 총 소비 (뒤에서 API 연결할 예정) */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500">이번 달 소비 금액</p>
          <p className="text-2xl font-bold text-pink-500">0 원</p>
        </div>

        {/* 남은 금액 */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500">남은 금액</p>
          <p className="text-2xl font-bold text-teal-500">
            {goal.goalAmount.toLocaleString()} 원
          </p>
        </div>
      </div>

      {/* 최근 내역 — API 만들면 연결 */}
      <h3 className="text-xl font-semibold mt-10 mb-4">최근 소비 내역</h3>
      <div className="bg-white p-6 rounded-xl shadow-md text-gray-600">
        최근 소비 내역 불러올 예정...
      </div>
    </div>
  );
}
