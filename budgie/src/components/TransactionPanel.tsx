import { motion } from "framer-motion";
import type { Transaction } from "../types/Transaction";

interface Props {
  date: string | null;
  transactions: Transaction[];
  onCreate: (date: string) => void;
  onUpdate: (item: Transaction) => void;
  onDelete: (id: number) => void;
}

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

  return (
    <div className="p-6 bg-white/80 rounded-xl shadow-md">
      {/* 날짜 헤더 */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {date} 내역
      </h2>

      {/* 리스트 */}
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center mb-6">
          내역이 없어요. 추가해보세요!
        </p>
      ) : (
        <ul className="space-y-4">
          {transactions.map((t) => (
            <motion.li
              key={t.transactionId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-white shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">{t.categoryName}</p>
                <p className="text-gray-600">
                  {t.amount.toLocaleString()}원
                </p>
                {t.memo && (
                  <p className="text-gray-500 text-sm mt-1">
                    메모: {t.memo}
                  </p>
                )}
              </div>

              {/* 수정 / 삭제 버튼 */}
              <div className="flex space-x-4 text-xl">
                <button
                  onClick={() => onUpdate(t)}
                  className="text-blue-500 hover:text-blue-600"
                  title="수정"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(t.transactionId)}
                  className="text-red-500 hover:text-red-600"
                  title="삭제"
                >
                  🗑️
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

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
