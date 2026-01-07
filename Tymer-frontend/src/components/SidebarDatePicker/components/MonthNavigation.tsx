import prevIcon from "../../../assets/sidebardatepicker/prev.png";
import nextIcon from "../../../assets/sidebardatepicker/next.png";

export default function MonthNavigation({ onPrev, onNext }: any) {
  return (
    <div className="h-14 border-t grid grid-cols-2">
      <button
        onClick={onPrev}
        className="flex items-center justify-center gap-2 text-xs text-gray-500 font-poppins border-r hover:bg-sky-100 transition-colors cursor-pointer "
      >
        <img src={prevIcon} className="w-2 h-3" alt="prev"/>
        Prev Month
      </button>

      <button
        onClick={onNext}
        className="flex items-center justify-center gap-2 text-xs text-gray-500 font-poppins hover:bg-sky-100 transition-colors cursor-pointer"
      
      >
        Next Month
         <img src={nextIcon} className="w-2 h-3" alt="next"/>
      </button>
    </div>
  );
}
