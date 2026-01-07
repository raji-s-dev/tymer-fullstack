import { useEffect, useState } from "react";
import { Task } from "../../../store/useTasksStore";
import dayjs from "dayjs";
import edit from "../../../assets/taskcard/edit.png";
import deleteicon from "../../../assets/taskcard/delete.png";
import open from "../../../assets/countup/open.png";
import close from "../../../assets/countup/close.png";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
};

export default function CountupTaskCard({ task, onEdit, onDelete }: Props) {
  const [timeSince, setTimeSince] = useState("0s");
  const [isOpen, setIsOpen] = useState(false);

  /* ======================================================
     ⏱ LIVE TIMER
     ====================================================== */
  useEffect(() => {
    if (!task.completedDate || !task.completedTime) return;

    const baseDate = dayjs(task.completedDate);
    const [hh, mm, ss] = task.completedTime.split(":").map(Number);

    const completion = baseDate.hour(hh).minute(mm).second(ss || 0);

    const updateTimer = () => {
      const diffSeconds = dayjs().diff(completion, "second");
      setTimeSince(diffSeconds < 0 ? "0s" : formatElapsed(diffSeconds));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [task.completedDate, task.completedTime]);

  function formatElapsed(seconds: number): string {
    const units = [
      { label: "y", value: 31536000 },
      { label: "mo", value: 2592000 },
      { label: "w", value: 604800 },
      { label: "d", value: 86400 },
      { label: "h", value: 3600 },
      { label: "m", value: 60 },
      { label: "s", value: 1 },
    ];

    const parts: string[] = [];
    for (const u of units) {
      if (seconds >= u.value) {
        const count = Math.floor(seconds / u.value);
        seconds %= u.value;
        parts.push(`${count}${u.label}`);
      }
      if (parts.length === 3) break;
    }
    return parts.join(" ");
  }

  const formattedDate = task.completedDate
    ? new Date(task.completedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "--";

  const formattedTime12h = task.completedTime
    ? dayjs(`1970-01-01T${task.completedTime}`).format("hh:mm A")
    : "--";

  /* ======================================================
     🎬 RENDER
     ====================================================== */
  return (
    <AnimatePresence mode="wait">
      {!isOpen ? (
        /* ================= CLOSED CARD ================= */
        <motion.div
          key="closed"
          initial={{ opacity: 0, scaleY: 0.95 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0.9 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
          className="relative w-[621px] bg-white rounded-[20px] shadow outline outline-1 outline-gray-200 px-[49px] py-8"
        >
          <div className="text-gray-900 text-lg font-medium mb-6">
            {task.title}
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="absolute right-6 top-6 w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center"
          >
            <img alt="open" src={open} className="w-4 h-2.5" />
          </button>

          <div className="text-black text-base font-medium mb-2">
            Time Since Completion
          </div>

          <div className="text-blue-500 text-5xl font-medium">
            {timeSince}
          </div>
        </motion.div>
      ) : (
        /* ================= OPEN CARD ================= */
        <motion.div
          key="open"
          initial={{ opacity: 0, scaleY: 0.95 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0.9 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
          className="relative w-[621px] h-[524px] bg-white rounded-[20px] shadow outline outline-1 outline-gray-200"
        >
          <div className="absolute left-[49px] top-[33px] text-gray-900 text-lg font-medium">
            {task.title}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="absolute left-[535px] top-[72px] w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center"
          >
            <img alt="close" src={close} className="w-4 h-2.5" />
          </button>

          <div className="absolute left-[429px] top-[26px] w-36 h-9 bg-red-400 rounded-[10px] flex items-center justify-center">
            <span className="text-white text-sm">Count-up task</span>
          </div>

          {task.description && (
            <div className="absolute left-[49px] top-[92px] w-80 text-gray-600 text-base">
              {task.description}
            </div>
          )}

          
      {/* COMPLETED */}
      <div className="absolute left-[49px] top-[199px] w-28 h-11 bg-emerald-500 rounded-[20px] flex items-center justify-center">
        <span className="text-white text-base">Completed</span>
      </div>

      {/* DATE & TIME */}
      <div className="absolute left-[49px] top-[261px] text-black text-base font-medium">
        Last Completed:
      </div>

      <div className="absolute left-[49px] top-[295px] text-black text-3xl font-medium">
        {formattedDate}
      </div>

      <div className="absolute left-[251px] top-[293px] text-black text-3xl">-</div>

      <div className="absolute left-[278px] top-[293px] text-black text-3xl font-medium">
        {formattedTime12h.split(" ")[0]}
      </div>

      <div className="absolute left-[368px] top-[300px] text-black text-xl font-medium">
        {formattedTime12h.split(" ")[1]}
      </div>


          <div className="absolute left-[49px] top-[368px] text-black text-base font-medium">
            Time Since Completion
          </div>

          <div className="absolute left-[49px] top-[405px] text-blue-500 text-5xl font-medium">
            {timeSince}
          </div>

          <button
            onClick={() => onEdit?.(task)}
            className="absolute left-[535px] top-[123px] w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center"
          >
            <img alt="edit" src={edit} className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete?.(task.id)}
            className="absolute left-[535px] top-[174px] w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center"
          >
            <img alt="delete" src={deleteicon} className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
