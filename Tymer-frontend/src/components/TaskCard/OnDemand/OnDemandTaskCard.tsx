// OnDemandTaskCard.tsx
import { useState, useEffect } from "react";
import edit from "../../../assets/taskcard/edit.png";
import deleteicon from "../../../assets/taskcard/delete.png";
import { Task, useTasksStore } from "../../../store/useTasksStore";
import { deleteTask, completeCooldown } from "../../../services/taskapi";
import { ConfirmPopup } from "../OneTime/components/ConfirmPopup";
import { useUserStore } from "../../../store/useUserStore";
import { useDateStore } from "../../../store/useDateStore";
import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import start from "../../../assets/taskcard/start.png";

dayjs.extend(durationPlugin);

interface OnDemandProps {
  task: Task;
  onStart: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function OnDemandTaskCard({ task, onStart, onEdit, onDelete }: OnDemandProps) {
  const userId = useUserStore((s) => s.userId);
  const selectedDate = useDateStore((s) => s.selectedDate);
  const loadTasks = useTasksStore((s) => s.loadTasks);

  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // COOLDOWN TIMER
  const [remaining, setRemaining] = useState<string>("00:00");
  const parseValueUnit = (str?: string) => {
  if (!str) return { value: "0", unit: "" };
  const [value, unit] = str.split(" ");
  return { value, unit };
};

const formatUnit = (unit: string) => {
  if (!unit) return "";

  const u = unit.toLowerCase();

  if (u.startsWith("min")) return "mins";
  if (u.startsWith("hour")) return "hrs";

  return unit;
};



const { value: durationValue, unit: rawDurationUnit } = parseValueUnit(task.duration);
const { value: cooldownValue, unit: rawCooldownUnit } = parseValueUnit(task.cooldown);

const durationUnit = formatUnit(rawDurationUnit);
const cooldownUnit = formatUnit(rawCooldownUnit);

  useEffect(() => {
    if (task.state !== "cooldown" || !task.cooldownEnd) return;

    const interval = setInterval(() => {
      const now = dayjs();
      const end = dayjs(task.cooldownEnd);
      const diffMs = end.diff(now);

      // ---- COOLDOWN FINISHED ----
      if (diffMs <= 0) {
        setRemaining("00:00");

        // Call async function (cannot use await inside setInterval)
        (async () => {
          try {
            await completeCooldown(task.id);
            await loadTasks(userId!, selectedDate.format("YYYY-MM-DD"));
          } catch (err) {
            console.error("Cooldown completion failed", err);
          }
        })();

        clearInterval(interval);
        return;
      }

      const dur = dayjs.duration(diffMs);
      const mm = String(dur.minutes()).padStart(2, "0");
      const ss = String(dur.seconds()).padStart(2, "0");

      setRemaining(`${mm}:${ss}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [task.state, task.cooldownEnd]);

  // DELETE HANDLER
  const handleConfirmDelete = async () => {
    try {
      await deleteTask(task.id);
      await loadTasks(userId!, selectedDate.format("YYYY-MM-DD"));
      onDelete(task.id);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setShowDeletePopup(false);
    }
  };

  return (
  <div
    className={`relative w-[621px] ${
      task.state === "cooldown"
        ? "h-98 shadow-[0px_0px_4px_0px_rgba(30,144,255,1)]"
        : "h-[473px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)]"
    } bg-white rounded-[20px] outline outline-1 outline-gray-200 p-[48px]`}
  >
    {/* DELETE POPUP */}
    {showDeletePopup && (
      <ConfirmPopup
        message="Are you sure you want to delete this task permanently?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeletePopup(false)}
      />
    )}

    {/* ✅ HEADER */}
    <div className="flex justify-between items-start">
      <h2 className="text-lg font-medium text-gray-900">
        {task.title}
      </h2>

      <div className="bg-teal-400 text-white text-sm px-6 py-2 rounded-[10px] font-normal font-poppins  ">
        On-demand
      </div>
    </div>

    {/* ✅ DESCRIPTION */}
    <p className="mt-6 text-gray-600 text-base leading-5 w-[320px] text-justify">
      {task.description}
    </p>

    {/* ✅ STATE PILL */}
    <div
      className={`mt-10 w-28 h-11 rounded-[20px] flex items-center justify-center text-white text-base font-normal ${
        task.state === "cooldown" ? "bg-sky-400" : "bg-indigo-500"
      }`}
    >
      {task.state === "cooldown" ? "Cooldown" : "Available"}
    </div>

    {/* ✅ AVAILABLE STATE */}
    {task.state === "pending" && (
      <>
        <div className="flex gap-24 mt-8">
          <div>
            <p className="text-black text-base font-medium">
              Duration :
            </p>
            <div className="flex items-end gap-1 mt-2">
<span className="text-5xl font-medium text-black">
  {durationValue}
</span>
<span className="text-3xl font-medium text-black">
  {durationUnit}
</span>
            </div>
          </div>

          <div>
            <p className="text-black text-base font-medium">
              Cooldown :
            </p>
            <div className="flex items-end gap-1 mt-2">
<span className="text-5xl font-medium text-black">
  {cooldownValue}
</span>
<span className="text-3xl font-medium text-black">
  {cooldownUnit}
</span>
            </div>
          </div>
        </div>

        {/* ✅ START BUTTON */}
        <button
          onClick={() => onStart(task.id)}
          className="mt-8 bg-green-600 text-white w-28 h-12 rounded-[40px] flex items-center justify-center gap-2"
        >
          Start
          <img src={start} className="w-3 h-3" alt="start" />
        </button>
      </>
    )}

    {/* ✅ COOLDOWN STATE */}
    {task.state === "cooldown" && (
      <>
    
        <p className="mt-10 text-black text-base font-medium">
          Available in :
        </p>

        <p className="text-sky-400 text-5xl font-medium mt-2">
          {remaining}
        </p>
        
      </>
    )}

    {/* ✅ TOP RIGHT ICONS */}
    <div className="absolute right-10 top-24 flex flex-col gap-4">
      <div
        onClick={() => onEdit(task)}
        className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center cursor-pointer"
      >
        <img src={edit} className="w-4 h-4" alt="edit" />
      </div>

      <div
        onClick={() => setShowDeletePopup(true)}
        className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center cursor-pointer"
      >
        <img src={deleteicon} className="w-4 h-4" alt="delete" />
      </div>
    </div>
  </div>
);

}
