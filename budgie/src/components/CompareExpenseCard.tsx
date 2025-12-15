interface CompareExpense {
  current?: number;
  previous?: number;
  difference?: number;
  percent?: number;
}

interface CompareExpenseCardProps {
  data?: CompareExpense | null;
}

export default function CompareExpenseCard({ data }: CompareExpenseCardProps) {
  if (!data) return null;

    const {
    current = 0,
    previous = 0,
    difference = 0,
    percent = 0,
  } = data;

const isIncrease = difference > 0;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-2">지난달 대비 소비 변화</h2>

      <div className="flex flex-col gap-2">
        <p>
          이번 달 소비: <strong>{current.toLocaleString()}
원</strong>
        </p>
        <p>
          지난달 소비: <strong>{previous.toLocaleString()}
원</strong>
        </p>

        <p
          className={
            isIncrease
              ? "text-red-500 font-semibold"
              : "text-blue-500 font-semibold"
          }
        >
           {isIncrease ? "▲" : "▼"} {Math.abs(percent)}%

        </p>
      </div>
    </div>
  );
}
