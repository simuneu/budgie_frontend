import { motion } from "framer-motion";
import type { Transaction } from "../types/Transaction";
import { CATEGORY_ICONS } from "../utils/categoryIcons";

interface Props {
  date: string | null;
  transactions: Transaction[];
  onCreate: (date: string) => void;
  onUpdate: (item: Transaction) => void;
  onDelete: (id: number) => void;
}

const CATEGORY_KR_TO_KEY: Record<string, string> = {
  식비: "FOOD",
  주거비: "HOUSING",
  교통: "TRANSPORT",
  문화생활: "CULTURE",
  생활비: "LIVING",
  건강: "HEALTH",
  의료: "MEDICAL",
  교육: "EDUCATION",
  경조사비: "EVENT",
  예적금: "SAVINGS",

  월급: "SALARY",
  용돈: "ALLOWANCE",
  부수입: "SIDE_INCOME",
  기타: "ETC",
};


export default function TransactionPanel({
  date,
  transactions,
  onCreate,
  onUpdate,
  onDelete,
}: Props) {
  if (!date) {
    return (
      <div className="p-6 bg-white/80 rounded-xl shadow-md text-center">
        <p className="text-gray-600">날짜를 선택해주세요.</p>
      </div>
    );
  }

  const expenseList = transactions.filter((t) => t.budgetType === "EXP");
  const incomeList = transactions.filter((t) => t.budgetType === "INCOME");

  return (
    <div className="p-6 bg-white/80 rounded-xl shadow-md h-[460px]  flex flex-col">
      {/* 날짜 헤더 */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{date} 내역</h2>

      {/* 스크롤 전체 박스 */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-8">

        {/* 지출 */}
        <section>
          <h3 className="text-lg font-semibold text-red-500 mb-2">지출</h3>

          {expenseList.length === 0 ? (
            <p className="text-gray-500 text-sm">지출 내역이 없어요.</p>
          ) : (
            <ul className="space-y-4">
              {expenseList.map((t) => {
                const categoryName = t.categoryName ?? "기타";
                const key = CATEGORY_KR_TO_KEY[categoryName] ?? "ETC";
                const icon = CATEGORY_ICONS[key];

                return (
                  <motion.li
                    key={t.transactionId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-white shadow flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{icon}</span>

                      <div>
                        <p className="font-semibold text-gray-800">
                          {categoryName}
                        </p>
                        <p className="text-gray-600">
                          {t.amount.toLocaleString()}원
                        </p>
                        {t.memo && (
                          <p className="text-gray-500 text-sm mt-1">{t.memo}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-3 text-sm">
                      <button
                        onClick={() => onUpdate(t)}
                        className="px-3 py-1 rounded-md border border-gray-400 text-gray-500 hover:bg-blue-50 transition"
                      >
                        수정
                      </button>

                      <button
                        onClick={() => onDelete(t.transactionId)}
                        className="px-3 py-1 rounded-md border border-red-400 text-red-500 hover:bg-red-50 transition"
                      >
                        삭제
                      </button>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </section>

        {/* 수입 */}
        <section>
          <h3 className="text-lg font-semibold text-blue-500 mb-2">수입</h3>

          {incomeList.length === 0 ? (
            <p className="text-gray-500 text-sm">수입 내역이 없어요.</p>
          ) : (
            <ul className="space-y-4">
              {incomeList.map((t) => {
                const categoryName = t.categoryName ?? "기타";
                const key = CATEGORY_KR_TO_KEY[categoryName] ?? "ETC";
                const icon = CATEGORY_ICONS[key];

                return (
                  <motion.li
                    key={t.transactionId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-white shadow flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{icon}</span>

                      <div>
                        <p className="font-semibold text-gray-800">
                          {categoryName}
                        </p>
                        <p className="text-gray-600">
                          {t.amount.toLocaleString()}원
                        </p>
                        {t.memo && (
                          <p className="text-gray-500 text-sm mt-1">
                            {t.memo}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-3 text-sm">
                      <button
                        onClick={() => onUpdate(t)}
                        className="px-3 py-1 rounded-md border border-gray-400 text-gray-500 hover:bg-blue-50 transition"
                      >
                        수정
                      </button>

                      <button
                        onClick={() => onDelete(t.transactionId)}
                        className="px-3 py-1 rounded-md border border-red-400 text-red-500 hover:bg-red-50 transition"
                      >
                        삭제
                      </button>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* 등록 버튼 */}
      <button
        className="mt-6 w-full bg-pink-400 text-white py-3 rounded-lg shadow-md hover:bg-pink-500 transition"
        onClick={() => onCreate(date)}
      >
        등록
      </button>
    </div>
  );
}
