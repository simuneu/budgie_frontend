import ReactDOM from "react-dom";
interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ onConfirm, onCancel }:Props) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
        <p className=" mb-4">정말 로그아웃 하시겠습니까?</p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-pink-400 text-white"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}
