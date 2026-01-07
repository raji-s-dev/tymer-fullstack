
import { createPortal } from "react-dom";

interface ConfirmPopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmPopup({ message, onConfirm, onCancel }: ConfirmPopupProps) {
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
        <p className="text-gray-800 text-sm">{message}</p>

        <div className="flex justify-end gap-3 mt-5">
          <button   
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
