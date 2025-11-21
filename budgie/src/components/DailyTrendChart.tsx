import {
  BarChart,
  Bar,
  LabelList,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface DailyExpense {
  day: number;
  totalAmount: number;
}

interface DailyTrendChartProps {
  data: DailyExpense[];
}

export default function DailyTrendChart({ data }: DailyTrendChartProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-2">일별 소비 패턴</h2>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}
        margin={{ top: 25, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
            dataKey="day"
            interval="auto" 
            tick={{ fontSize: 12 }}
            />

          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => [`${value.toLocaleString()}원`, "사용 금액"]}
            labelFormatter={(day: number) => `${day}일`}
            contentStyle={{ borderRadius: "8px", fontSize: "14px" }}
            />

          <Bar
            dataKey="totalAmount"
            fill="#ffc8d1ff"
            radius={[6, 6, 0, 0]}
          >
            {/* ✔ 막대 위에 텍스트 표시 */}
            <LabelList
              dataKey="totalAmount"
              position="top"
              formatter={(value: number) => value.toLocaleString()}
              style={{ fill: "#444", fontSize: 12, fontWeight: 500 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
