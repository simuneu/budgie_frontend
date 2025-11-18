import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import GoalModal from "../components/GoalModal";
import Calendar from "../components/Calendar";
import TransactionPanel from "../components/TransactionPanel";
import type { Transaction } from "../types/Transaction";
import AddTransactionModal from "../components/AddTransactionModal";
import StatisticsPanel from "../components/StatisticsPanel";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

interface RecordedDay {
  day: number;
  totalAmount: number;
}

interface GoalResponse {
  year: number;
  month: number;
  goalAmount: number;
}

export default function Dashboard() {
  const [recordedDays, setRecordedDays] = useState<RecordedDay[]>([]);

  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const [goal, setGoal] = useState<GoalResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [monthlyExpense, setMonthlyExpense] = useState(0);

  const remaining = goal ? goal.goalAmount - monthlyExpense : 0;

  const [showAddModal, setShowAddModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // API: 목표 조회
  const fetchGoal = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get("/api/budget/goal", {
        params: { year, month },
        headers: { Authorization: `Bearer ${token}` },
      });

      setGoal(res.data || null);
    } catch {
      setGoal(null);
    } finally {
      setLoading(false);
    }
  };

  //목표 수정
  const updateGoal = async (amount: number) => {
  try {
    const token = localStorage.getItem("accessToken");

    await axios.put(
      `/api/budget/goal/${year}/${month}`,
      { goalAmount: amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("목표가 수정되었습니다!");
    setShowModal(false);

    fetchGoal();
    fetchMonthlySummary();
  } catch {
    toast.error("목표 수정 실패");
  }
};

  // API: 월 소비 합계 조회
  const fetchMonthlySummary = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get("/api/transactions/summary", {
        params: { year, month },
        headers: { Authorization: `Bearer ${token}` },
      });

      setMonthlyExpense(res.data.totalExpense ?? 0);
    } catch {
      setMonthlyExpense(0);
    }
  };

  // 목표 저장
  const saveGoal = async (amount: number) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        "/api/budget/goal",
        { year, month, goalAmount: amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("목표가 저장되었습니다!");
      setShowModal(false);

      fetchGoal();
      fetchMonthlySummary();
    } catch {
      toast.error("목표 저장 실패");
    }
  };

  useEffect(() => {
  const token = localStorage.getItem("accessToken");

  axios
    .get(`/api/transactions/days`, {
      params: { year, month },
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setRecordedDays(res.data))
    .catch(() => setRecordedDays([]));
}, [year, month]);

  // 초기 로드 + 연/월 변경 시 재조회
  useEffect(() => {
    fetchGoal();
    fetchMonthlySummary();
  }, [year, month]);

  //오늘 내역
  useEffect(() => {
    fetchTransactionsByDate(todayString);
  }, []);

  const refreshRecordedDays = () => {
  const token = localStorage.getItem("accessToken");
  axios
    .get("/api/transactions/days", {
      params: { year, month },
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setRecordedDays(res.data))
    .catch(() => setRecordedDays([]));
};

  const handleDelete = async (id: number) => {
     setItemToDelete(id);
   };

  const confirmDelete = async () => {
    if (itemToDelete === null) return;

    const id = itemToDelete;
     setItemToDelete(null);
    
    const token = localStorage.getItem("accessToken");

    try {
      await axios.delete(`/api/transactions/${id}`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
      });

       toast.success("삭제되었습니다!");

      // 삭제 후 다시 조회
      if (selectedDate) 
      fetchTransactionsByDate(selectedDate);
      fetchMonthlySummary();
      refreshRecordedDays();
     } catch (e) {
       console.error(e);
       toast.error("삭제 실패");
    }
   };

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [selectedDate, setSelectedDate] = useState<string | null>(todayString);
  
  const fetchTransactionsByDate = async (date: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const [yearStr, monthStr, dayStr] = date.split("-");

      const res = await axios.get("/api/transactions", {
        params: {
          year: Number(yearStr),
          month: Number(monthStr),
          day: Number(dayStr),
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions(res.data || []);
    } catch (e) {
      console.error(e);
      setTransactions([]);
    }
  };

  const [editItem, setEditItem] = useState<Transaction | null>(null);

  // UI: 로딩 중
  if (loading)
    return <div className="p-10 text-xl">불러오는 중...</div>;

  // UI: 목표 없음 → 입력 유도
  if (!goal) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-teal-200 via-pink-100 to-white bg-[length:400%_400%] animate-gradient-move p-6">

        {/* 오버레이 */}
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          {showModal ? (
            <GoalModal
            existingGoal={goal}
            onClose={() => setShowModal(false)}
            onSave={(amount) => {
              if (goal) updateGoal(amount);
              else saveGoal(amount);
           }}
            />
          ) : (
            <div className="bg-white/80 px-10 py-8 rounded-2xl shadow-xl text-center">
              <h2 className="text-2xl font-bold mb-4">이번 달 목표가 없어요! 🐥</h2>
              <p className="text-gray-600 mb-4">예산을 먼저 설정해주세요.</p>

              <button
                className="px-6 py-3 bg-pink-400 text-white rounded-lg shadow hover:bg-pink-500 transition"
                onClick={() => setShowModal(true)}
              >
                목표 설정하기
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // UI: 목표 있음 → 대시보드 화면
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto bg-white/80 rounded-2xl shadow-xl p-8">

        {/* 소비 요약 */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          {year}년 {month}월 현황
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white/80  p-5 rounded-xl shadow relative">
            <p className="text-gray-600">월 목표 금액</p>
            <p className="text-2xl font-bold">{goal.goalAmount.toLocaleString()} 원</p>
             <button
                className="absolute top-3 right-3 text-sm text-pink-500 hover:text-teal-600"
                onClick={() => setShowModal(true)}
              >
                수정
              </button>
          </div>

          <div className="bg-white/80  p-5 rounded-xl shadow">
            <p className="text-gray-600">이번 달 소비 금액</p>
            <p className="text-2xl font-bold text-pink-500">
              {monthlyExpense.toLocaleString()} 원
            </p>
          </div>

          <div className="bg-white/80  p-5 rounded-xl shadow">
            <p className="text-gray-600">남은 금액</p>
            <p className="text-2xl font-bold text-teal-500">
              {remaining.toLocaleString()} 원
            </p>
          </div>
        </div>

        {/* 달력 */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* LEFT: 달력 */}
          <div className="w-full">
            <Calendar
              year={year}
              month={month}
              recordedDays={recordedDays}
              onPrevMonth={() => {
                if (month === 1) {
                  setYear(year - 1);
                  setMonth(12);
                } else {
                  setMonth(month - 1);
                }
                 setSelectedDate(null);
              }}
              onNextMonth={() => {
                if (month === 12) {
                  setYear(year + 1);
                  setMonth(1);
                } else {
                  setMonth(month + 1);
                }
              }}
              onSelectDate={(date) => {
                setSelectedDate(date);
                fetchTransactionsByDate(date);
              }}
            />
          </div>

          {/* RIGHT: 선택된 날짜의 소비 내역 패널 */}
          <TransactionPanel
            date={selectedDate}
            transactions={transactions}
            onCreate={() => {if (!selectedDate) return;setShowAddModal(true);}}
            onUpdate={(item) => {setEditItem(item); setShowAddModal(true);}}
            onDelete={handleDelete}
          />
        </div>
        <div className="mt-10">
          <StatisticsPanel year={year} month={month} />
        </div>

        {showModal && (
          <GoalModal
            existingGoal={goal}
            onClose={() => setShowModal(false)}
            onSave={(amount) => {
              if (goal) updateGoal(amount);
              else saveGoal(amount);
            }}
          />
        )}
        {itemToDelete !== null && (
            <DeleteConfirmModal 
                onClose={() => setItemToDelete(null)} // '취소' 버튼 또는 배경 클릭 시
                onConfirm={confirmDelete} // '삭제' 버튼 클릭 시 confirmDelete 실행
            />
        )}

      </div>
    </div>
  );
}
