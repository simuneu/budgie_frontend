import { useEffect, useState } from "react";
import axios from "axios";
import { CATEGORY_ICONS } from "../utils/categoryIcons";
import { CATEGORY_LABELS } from "../utils/categoryLabel";
import type { Transaction } from "../types/Transaction";
import { toast } from "react-toastify";

interface Props {
  date: string;
  onClose: () => void;
  onSave: () => void;
  transaction?: Transaction;
}

interface Category {
  categoryId: number;
  name: string;
  budgetType: string;
}

export default function AddTransactionModal({ date, onClose, onSave, transaction }: Props) {
  const isEditMode = !!transaction;
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (transaction) {
      setAmount(String(transaction.amount));
      setMemo(transaction.memo ?? "");
      setCategoryId(transaction.categoryId);
    }
  }, [transaction]);

  const handleSubmit = async () => {

    const token = localStorage.getItem("accessToken");

    if (!date) {
      toast.error("날짜가 선택되지 않았습니다.");
      return;
    }

    if (!categoryId || !amount) {
      toast.error("카테고리와 금액은 필수입니다.");
      return;
    }

      const cleanAmount = Number(amount.replace(/,/g, ""));
      if (isNaN(cleanAmount)) {
        toast.error("금액 형식이 올바르지 않습니다.");
        return;
      }

    const payload = {
      transactionDate: date,
      amount: cleanAmount,
      memo,
      categoryId,
    };

    try {
      if (isEditMode) {
        await axios.put(`/transactions/${transaction!.transactionId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/transactions", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success(isEditMode ? "수정되었습니다!" : "등록되었습니다!");
      onSave();
      onClose();

    } catch {
      toast.error("요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const loadCategories = async () => {
    const token = localStorage.getItem("accessToken");

    const res = await axios.get("/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = res.data?.data ?? res.data;
    setCategories(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? "내역 수정" : "소비 지출 등록"}
        </h2>

        <p className="text-gray-600 mb-2">날짜: {date}</p>

        {/* 지출 카테고리 */}
        <label className="block mb-2 text-gray-700 font-semibold">지출 카테고리</label>
        <select
          className="w-full border rounded p-2 mb-4"
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(Number(e.target.value))}
        >
          <option value="">지출 카테고리 선택</option>
          {categories
            .filter((c) => c.budgetType === "EXP")
            .map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {CATEGORY_ICONS[c.name]} {CATEGORY_LABELS[c.name]}
              </option>
            ))}
        </select>

        {/* 수입 카테고리 */}
        <label className="block mb-2 text-gray-700 font-semibold mt-4">수입 카테고리</label>
        <select
          className="w-full border rounded p-2 mb-4"
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(Number(e.target.value))}
        >
          <option value="">수입 카테고리 선택</option>
          {categories
            .filter((c) => c.budgetType === "INCOME")
            .map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {CATEGORY_ICONS[c.name]} {CATEGORY_LABELS[c.name]}
              </option>
            ))}
        </select>

        {/* 금액 */}
        <label className="block mb-2 text-gray-700">금액</label>
        <input
          type="number"
          className="w-full border rounded p-2 mb-3"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="예: 15000"
        />

        {/* 메모 */}
        <label className="block mb-2 text-gray-700">메모(선택)</label>
        <input
          className="w-full border rounded p-2 mb-4"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모 입력"
        />

        <div className="flex justify-end space-x-3">
          <button className="px-4 py-2 rounded bg-gray-300" onClick={onClose}>
            취소
          </button>

          <button className="px-4 py-2 rounded bg-pink-500 text-white" onClick={handleSubmit}>
            {isEditMode ? "수정" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
