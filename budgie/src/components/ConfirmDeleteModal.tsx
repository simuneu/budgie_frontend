interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({ onConfirm, onCancel }:Props) {
  
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-xl shadow-xl w-72 text-center">
        <h3 className="text-lg font-semibold mb-3">정말 탈퇴하시겠습니까?</h3>
        <p className="text-sm text-gray-600 mb-4">
          탈퇴 후 7일간 복구할 수 있으며<br />
          모든 데이터는 복원되지 않습니다.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-pink-500 text-white"
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
}
