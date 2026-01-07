import { useState, useEffect } from "react";
import { useTasksStore } from "../../store/useTasksStore";
import { useDateStore } from "../../store/useDateStore";
import dayjs from "dayjs";
import menu from "../../assets/completedpanel/menu.png";

export default function CompletedPanel() {
  const tasks = useTasksStore((s) => s.tasks);
  const selectedDate = useDateStore((s) => s.selectedDate);

  const [view, setView] = useState<"completed" | "missed">("completed");
  const [menuOpen, setMenuOpen] = useState(false);

  // --- FILTER TASKS BASED ON HISTORY ---
  const completedTasks = tasks
    .map((t) => {
      const event = t.history?.find(
        (h) =>
          h.type === "completed" &&
          dayjs(h.timestamp).isSame(dayjs(selectedDate), "day")
      );
      if (event) return { ...t, event };
      return null;
    })
    .filter(Boolean) as (typeof tasks[number] & {
    event: { type: "completed"; timestamp: string };
  })[];

  const missedTasks = tasks
    .map((t) => {
      const event = t.history?.find(
        (h) =>
          h.type === "missed" &&
          dayjs(h.timestamp).isSame(dayjs(selectedDate), "day")
      );
      if (event) return { ...t, event };
      return null;
    })
    .filter(Boolean) as (typeof tasks[number] & {
    event: { type: "missed"; timestamp: string };
  })[];

  // --- AUTO-SELECT VIEW LOGIC ---
  useEffect(() => {
    if (missedTasks.length > 0 && completedTasks.length === 0) {
      setView("missed");
    } else {
      setView("completed");
    }
  }, [tasks, selectedDate]);

  const list = view === "completed" ? completedTasks : missedTasks;

  const borderColor = view === "completed" 
  ? "border-[#16A34A]/40" 
  : "border-[#A31616]/40";

  return (
    <div className="relative w-full h-full bg-white overflow-hidden flex flex-col">

      {/* ✅ HEADER */}
      <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10 ">
        <h3 className="text-lg font-normal text-black">
          {view === "completed" ? "Completed Tasks" : "Missed Tasks"}
        </h3>

        {/* Menu Button */}
        <button
        aria-label="menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="w-11 h-11 bg-sky-100 rounded-full flex items-center justify-center"
        >
          <img src={menu} className="w-4 h-4" alt="menu"/>
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div className="absolute right-4 top-20 bg-white shadow-md rounded-md border w-40 text-sm z-50">
            <button
              onClick={() => {
                setView("completed");
                setMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-100"
            >
              Completed Tasks
            </button>
            <button
              onClick={() => {
                setView("missed");
                setMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-100"
            >
              Missed Tasks
            </button>
          </div>
        )}
      </div>

      {/* ✅ TASK LIST */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-6 pb-10 space-y-2">

        {list.length === 0 ? (
          <p className="text-gray-500 text-sm font-normal " >
            {view === "completed"
              ? "No completed tasks for this date."
              : "No missed tasks for this date."}
          </p>
        ) : (
          list.map((task) => {
            const pill =
              task.type === "scheduled"
                ? "bg-purple-500"
                : task.type === "ondemandinstance"
                ? "bg-teal-400"
                : "bg-red-400";

            const label =
              task.type === "scheduled"
                ? "Scheduled Task"
                : task.type === "ondemandinstance"
                ? "On-demand"
                : "Count-up task";

            return (
              <div
                key={task.id}
                className={`w-full h-40 bg-white rounded-[10px] border ${borderColor} px-5 pt-4 relative`}
              >
                {/* ✅ TITLE */}
                <p className="text-gray-800 text-base font-medium mb-6">
                  {task.title}
                </p>

                {/* ✅ TIME */}
                <p className="text-black text-base font-normal mb-4">
                  {view === "completed"
                    ? `Completed at ${dayjs(task.event.timestamp).format(
                        "h:mm A"
                      )}`
                    : `Missed at ${dayjs(task.event.timestamp).format(
                        "h:mm A"
                      )}`}
                </p>

                {/* ✅ TASK TYPE PILL */}
                <div
                  className={`absolute left-5 bottom-5 h-9 px-6 rounded-[10px] flex items-center justify-center ${pill}`}
                >
                  <span className="text-white text-sm font-normal">
                    {label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
