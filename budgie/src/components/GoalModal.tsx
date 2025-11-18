import { useState } from "react";

interface GoalModalProps {
  onClose: () => void;
  onSave: (amount: number) => void;
  existingGoal?: { goalAmount: number } | null; 
}

export default function GoalModal({ onClose, onSave, existingGoal }: GoalModalProps) {
  const [amount, setAmount] = useState<number>(existingGoal?.goalAmount ?? 0);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md p-8 rounded-2xl shadow-xl animate-fadeIn">

        {/* 제목 */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
           {existingGoal ? "🐥 목표 금액 수정" : "🐥 이번 달 목표 금액 설정"}
        </h2>

        <p className="text-gray-600 mb-6">
          이번 달 사용할 예산을 입력해주세요.
        </p>

        {/* 입력창 */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="예: 400000"
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 
                     focus:ring-pink-300 focus:outline-none mb-6"
        />

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border text-gray-600 
                       hover:bg-gray-100"
          >
            취소
          </button>

          <button
            onClick={() => onSave(Number(amount))}
            className="px-5 py-2 rounded-lg bg-pink-400 text-white font-semibold 
                       hover:bg-pink-500 shadow"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
