import { Dayjs } from "dayjs";
import { useRef } from "react";
import calendarIcon from "../../../assets/sidebardatepicker/calendar.png";

interface HeaderProps {
  currentMonth: Dayjs;
  onDatePicked: (date: string) => void;
}

export default function Header({ currentMonth, onDatePicked }: HeaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="px-6 h-[90px] flex items-center justify-between border-b ">
      <h2 className="text-md font-normal font-poppins">{currentMonth.format("MMMM YYYY")}</h2>

      {/* Hidden native date picker */}
      <input
        type="date"
        ref={inputRef}
        className="hidden"
        onChange={(e) => {
          if (e.target.value) onDatePicked(e.target.value);
        }}
        placeholder="select date"
      />

      <button
        className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center cursor-pointer hover:ring-1 hover:ring-blue-500 transition-all"
        aria-label="Open calendar"
        onClick={() => inputRef.current?.showPicker()}
      >
        <img src={calendarIcon} className="w-5 h-5" alt="Calendar Icon" />
      </button>
    </div>
  );
}
