interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-xl font-bold mb-4 text-pink-600">
          ⚠️ 삭제 확인
        </h3>
        <p className="text-gray-700 mb-6">
          정말 이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}