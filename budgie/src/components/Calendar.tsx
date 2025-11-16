import { useState } from "react";

interface CalendarProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: string) => void;
}

export default function Calendar({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
}: CalendarProps) {
  const [selected, setSelected] = useState<string | null>(null);

  // 해당 월의 첫날 요일
  const firstDay = new Date(year, month - 1, 1).getDay();
  // 해당 월의 마지막 날짜
  const lastDate = new Date(year, month, 0).getDate();

  const dates: (number | null)[] = [];

  // 앞 빈칸
  for (let i = 0; i < firstDay; i++) dates.push(null);

  // 날짜 채우기
  for (let d = 1; d <= lastDate; d++) dates.push(d);

  const handleClick = (day: number | null) => {
    if (!day) return;

    const formatted = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    setSelected(formatted);
    onSelectDate(formatted);
  };

  return (
     <div className="bg-white/80 rounded-2xl shadow-lg p-4 md:p-6 h-full flex flex-col">

      {/*  달 이동 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevMonth}
          className="px-3 py-1 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          ◀
        </button>

        <h3 className="text-lg md:text-xl font-bold text-gray-800">
          {year}년 {month}월
        </h3>

        <button
          onClick={onNextMonth}
          className="px-3 py-1 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          ▶
        </button>
      </div>

      {/* 요일 */}
       <div className="grid grid-cols-7 text-center mb-2 text-gray-500 font-semibold text-xs md:text-sm">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
        {dates.map((day, idx) => {
          const isToday =
            day &&
            new Date().toDateString() ===
              new Date(year, month - 1, day).toDateString();

          const isSelected =
            selected ===
            `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
              2,
              "0"
            )}`;

          return (
            <div
              key={idx}
              onClick={() => handleClick(day)}
              className={`
                h-12 flex items-center justify-center rounded-xl cursor-pointer transition
                ${
                  day
                    ? "bg-white hover:bg-pink-100"
                    : "bg-transparent cursor-default"
                }
                ${isToday ? "border border-pink-400" : ""}
                ${isSelected ? "bg-pink-200 font-bold" : ""}
                 h-8 md:h-12
                text-xs md:text-base
              `}
            >
              {day ?? ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}
