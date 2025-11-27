import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CATEGORY_LABELS } from "../utils/categoryLabel";

interface Props {
  year: number;
  month: number;
}

interface SummaryItem {
  categoryName: string;
  totalAmount: number;
  [key: string]: string | number;
}

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

      const exp = await axios.get("/transactions/summary/category", {
        params: { year, month },
        headers: { Authorization: `Bearer ${token}` },
      });

      const income = await axios.get(
        "/transactions/summary/category/income",
        {
          params: { year, month },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setExpenseSummary(exp.data || []);
      setIncomeSummary(income.data || []);
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error("통계 데이터 불러오기 실패:", e);
      }
      setExpenseSummary([]);
      setIncomeSummary([]);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [year, month]);

  if (loading) return <div className="mt-10 text-gray-600">통계 불러오는 중...</div>;

  /** 커스텀 Legend */
  const renderLegend = (data: SummaryItem[]) => (
    <ul className="space-y-2 mt-4">
      {data.map((item, index) => (
        <li key={index} className="flex items-center gap-3">
          <span
            className="w-3 h-3 rounded-sm inline-block"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          ></span>

          <span className="text-gray-700 text-sm font-medium">
            {CATEGORY_LABELS[item.categoryName] ?? item.categoryName}
          </span>

          <span className="text-gray-500 text-sm">
            {item.totalAmount.toLocaleString()}원
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mt-12 bg-white/80 rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {year}년 {month}월 수입/지출 통계
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* 수입 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-500 mb-3">수입 통계</h3>

          {incomeSummary.length === 0 ? (
            <p className="text-gray-500">수입 데이터 없음</p>
          ) : (
            <>
              <div className="w-full h-[300px] md:h-[260px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={incomeSummary}
                      dataKey="totalAmount"
                      nameKey="categoryName"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {incomeSummary.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value, _name, props) => {
                        const korean =
                          CATEGORY_LABELS[props.payload.categoryName] ??
                          props.payload.categoryName;
                        return [`${value.toLocaleString()}원`, korean];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* 커스텀 Legend */}
              {renderLegend(incomeSummary)}
            </>
          )}
        </div>

        {/* 지출 */}
        <div>
          <h3 className="text-lg font-semibold text-pink-500 mb-3">지출 통계</h3>

          {expenseSummary.length === 0 ? (
            <p className="text-gray-500">지출 데이터 없음</p>
          ) : (
            <>
              <div className="w-full h-[300px] md:h-[260px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={expenseSummary}
                      dataKey="totalAmount"
                      nameKey="categoryName"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {expenseSummary.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value, _name, props) => {
                        const korean =
                          CATEGORY_LABELS[props.payload.categoryName] ??
                          props.payload.categoryName;
                        return [`${value.toLocaleString()}원`, korean];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* 커스텀 Legend */}
              {renderLegend(expenseSummary)}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
