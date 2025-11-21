import { useEffect, useState } from "react";
import { useStatistics } from "../utils/useStatisticd";
import DailyTrendChart from "../components/DailyTrendChart";
import WeeklyPatternChart from "../components/WeeklyPatternChart";
import TopCategoryCard from "../components/TopCategoryCard";
import CompareExpenseCard from "../components/CompareExpenseCard";

export interface DailyExpense {
  day: number;
  totalAmount: number;
}

export interface WeeklyExpense {
  weekday: number;
  totalAmount: number;
}

export interface Top3Category {
  categoryName: string;
  totalAmount: number;
}

export interface CompareExpense {
  current: number;
  previous: number;
  difference: number;
  percent: number;
}

export default function AnalysisPage() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const [daily, setDaily] = useState<DailyExpense[]>([]);
  const [weekly, setWeekly] = useState<WeeklyExpense[]>([]);
  const [top3, setTop3] = useState<Top3Category[]>([]);
  const [compare, setCompare] = useState<CompareExpense | null>(null);

  const { getDailyExpense, getWeeklyExpense, getTop3, getCompare } = useStatistics();

  useEffect(() => {
    const fetchAll = async () => {
      const [d, w, t3, comp] = await Promise.all([
        getDailyExpense(year, month),
        getWeeklyExpense(year, month),
        getTop3(year, month),
        getCompare(year, month),
      ]);

      // 오늘 포함 지난 7일
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);

        return {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        };
      }).reverse();

      const filledDaily: DailyExpense[] = last7Days.map((info) => {
        const match = d.find(
          (item: DailyExpense) =>
            item.day === info.day &&
            month === info.month &&
            year === info.year
        );

        return {
          day: info.day,
          totalAmount: match ? match.totalAmount : 0,
        };
      });

      setDaily(filledDaily);
      setWeekly(w);
      setTop3(t3);
      setCompare(comp);
    };

    fetchAll();
  }, [year, month]);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto bg-white/80 rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold mb-6 text-gray-800">소비 분석</h1>

        {/* 분석 카드 4개 */}
        <div className="flex flex-col gap-6">

          <DailyTrendChart data={daily} />

          <WeeklyPatternChart data={weekly} />

          <TopCategoryCard data={top3} />

          {compare && <CompareExpenseCard data={compare} />}

        </div>

      </div>
    </div>
  );
}
