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

const WEEK = ["월", "화", "수", "목", "금", "토", "일"];

interface WeeklyExpense {
  weekly: number; // 1 = 월, 7 = 일
  totalAmount: number;
}

interface WeeklyPatternChartProps {
  data: WeeklyExpense[];
}

export default function WeeklyPatternChart({ data }: WeeklyPatternChartProps) {
  // 1) 월~일(1~7) 기본 0원 세팅
  const base = Array.from({ length: 7 }, (_, i) => ({
    weekday: i + 1,
    totalAmount: 0,
  }));

  // 2) 실제 데이터 덮어쓰기
  data.forEach((item) => {
    const idx = item.weekly - 1;
    if (idx >= 0 && idx < 7) {
      base[idx].totalAmount = item.totalAmount;
    }
  });

  // 3) 차트용 데이터 변환
  const formatted = base.map((d) => ({
    name: WEEK[d.weekday - 1],
    amount: d.totalAmount,
  }));

   const maxDay = base.reduce((prev, cur) =>
    cur.totalAmount > prev.totalAmount ? cur : prev
  );

 
let message;

if (maxDay.totalAmount === 0) {
  message = "😊 이번 주는 아직 지출이 없어요!";
} else {
  const weekdayText = WEEK[maxDay.weekday - 1];
  message = `🤔 이번 주는 <b>${weekdayText}요일</b>에 가장 많이 썼어요`;
}

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-2">요일별 소비 패턴</h2>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={formatted}
          margin={{ top: 25, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
          />

          <YAxis tick={{ fontSize: 12 }} />

          <Tooltip
            formatter={(value: number) => [`${value.toLocaleString()}원`, "사용 금액"]}
            contentStyle={{ borderRadius: "8px", fontSize: "14px" }}
          />

          <Bar
            dataKey="amount"
            fill="#b6e6e2ff"
            radius={[6, 6, 0, 0]} 
          >
            <LabelList
              dataKey="amount"
              position="top"
              formatter={(v: number) => v.toLocaleString()}
              style={{ fill: "#444", fontSize: 12, fontWeight: 500 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
       <p
      className="mt-3 text-center text-gray-700 font-medium"
      dangerouslySetInnerHTML={{ __html: message }}
    ></p>
    </div>
  );
}