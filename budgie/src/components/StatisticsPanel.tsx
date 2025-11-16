import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CATEGORY_LABELS } from "../utils/categoryLabel";

interface Props {
  year: number;
  month: number;
}

interface SummaryItem {
  [key: string]: string | number;  
  categoryName: string;
  totalAmount: number;
}

interface PieLabelEntry {
  categoryName: string;
  totalAmount: number;
}


  const renderLabel = (entry: PieLabelEntry) => {
  const name = CATEGORY_LABELS[entry.categoryName] ?? entry.categoryName;
  const amount = entry.totalAmount.toLocaleString();

  return `${name} (${amount}원)`;
};

const COLORS = [
    "#fba7bcff",
    "#bae9fbff",
    "#94ffa2ff",
    "#ffea95ff",
    "#ffcd9bff",
    "#e2d1ffff",
    "#c4dcffff",
    "#ffd0edff",
    "#ffbcbcff",
];

export default function StatisticsPanel({ year, month }: Props) {
  const [expenseSummary, setExpenseSummary] = useState<SummaryItem[]>([]);
  const [incomeSummary, setIncomeSummary] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      const exp = await axios.get("/api/transactions/summary/category", {
        params: { year, month },
        headers: { Authorization: `Bearer ${token}` },
      });

      const income = await axios.get(
        "/api/transactions/summary/category/income",
        {
          params: { year, month },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setExpenseSummary(exp.data || []);
      setIncomeSummary(income.data || []);
    } catch (e) {
      console.error(e);
      setExpenseSummary([]);
      setIncomeSummary([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [year, month]);

  if (loading) return <div className="mt-10 text-gray-600">통계 불러오는 중...</div>;

  return (
    <div className="mt-12 bg-white/80 rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {year}년 {month}월 소비/수입 통계
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

{/* 수입 통계 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-500 mb-3">수입 통계</h3>

          {incomeSummary.length === 0 ? (
            <p className="text-gray-500">수입 데이터 없음</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeSummary}
                  dataKey="totalAmount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={renderLabel}
                >
                  {incomeSummary.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    formatter={(value, name, props) => {
                        const korean = CATEGORY_LABELS[props.payload.categoryName] ?? props.payload.categoryName;
                        return [`${value.toLocaleString()}원`, korean];
                    }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 지출 통계 */}
        <div>
          <h3 className="text-lg font-semibold text-pink-500 mb-3">지출 통계</h3>

          {expenseSummary.length === 0 ? (
            <p className="text-gray-500">지출 데이터 없음</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseSummary}
                  dataKey="totalAmount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={renderLabel}
                >
                  {expenseSummary.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    formatter={(value, name, props) => {
                        const korean = CATEGORY_LABELS[props.payload.categoryName] ?? props.payload.categoryName;
                        return [`${value.toLocaleString()}원`, korean];
                    }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        
      </div>
    </div>
  );
}
