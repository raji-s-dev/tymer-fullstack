interface Props {
  number: number;
  fullDate: string;
  taskCount: number;
  isSelected: boolean;
  onSelect: () => void;
  refEl: (el: HTMLDivElement | null) => void;
}

export default function DateItem({
  number,
  taskCount,
  isSelected,
  onSelect,
  refEl,
}: Props) {
  return (
    <div
      ref={refEl}
      onClick={onSelect}
      className={`h-14 flex items-center justify-between px-8 border-b cursor-pointer
        ${isSelected ? "bg-sky-100" : "bg-white hover:bg-gray-50"}
      `}
    >
            <span
        className={`text-base font-medium font-inter ${
          isSelected ? "text-blue-500" : "text-gray-700"
        }`}
      >
        {String(number).padStart(2, "0")}
      </span>

      {taskCount > 0 && (
        <div
          className={`w-24 h-7 rounded-[10px] flex items-center justify-center text-sm font-medium font-inter
            ${
              isSelected
                ? "border border-blue-500 text-blue-500 bg-sky-100"
                : "bg-sky-100 text-gray-700"
            }
          `}
        >
          {taskCount} task
        </div>
      )}
    </div>
  );
}
