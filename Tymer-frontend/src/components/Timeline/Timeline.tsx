import { useTasksStore } from "../../store/useTasksStore";
import OneTimeTaskCard from "../TaskCard/OneTime/ScheduledTaskCard";
import TimeSlot from "./TimeSlot";
import dayjs from "dayjs";
import { useRef,useState } from "react";
import { Task } from "../../store/useTasksStore";
import EditTaskForm from "../EditTask/EditTaskForm";
import { useUserStore } from "../../store/useUserStore";
import { useDateStore } from "../../store/useDateStore";
import { useLayoutEffect } from "react";

function normalize(time: string) {
  return dayjs(time, "hh:mm A").format("hh:mm A");
}

function toSortable(time: string) {
  return dayjs(`2025-01-01 ${time}`, "YYYY-MM-DD hh:mm A");
}

export default function Timeline({ active }: any) {
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [editTask, setEditTask] = useState<Task | null>(null);

  const { tasks } = useTasksStore();
  const updateTaskState = useTasksStore((s) => s.updateTaskState);
  const deleteTaskLocal = useTasksStore((s) => s.deleteTaskLocal);

  const hours = [
    "12:00 AM","01:00 AM","02:00 AM","03:00 AM","04:00 AM","05:00 AM",
    "06:00 AM","07:00 AM","08:00 AM","09:00 AM","10:00 AM","11:00 AM",
    "12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM",
    "06:00 PM","07:00 PM","08:00 PM","09:00 PM","10:00 PM","11:00 PM",
  ];

  const dynamicTimes = tasks
    .filter((t) => t.startTime)
    .map((t) => normalize(t.startTime!));

  const merged = Array.from(new Set([...hours, ...dynamicTimes]));

  const sortedTimes = merged.sort(
    (a, b) => toSortable(a).valueOf() - toSortable(b).valueOf()
  );

useLayoutEffect(() => {
  if (!active) return;
  if (!tasks.length) return;

  // 1. Get first scheduled task sorted by time
  const firstTask = [...tasks]
    .filter((t) => t.type === "scheduled" && t.startTime)
    .sort(
      (a, b) =>
        toSortable(normalize(a.startTime!)).valueOf() -
        toSortable(normalize(b.startTime!)).valueOf()
    )[0];

  if (!firstTask) return;

  const timeKey = normalize(firstTask.startTime!);

  // 2. Delay scroll until DOM refs are ready
  requestAnimationFrame(() => {
    const el = slotRefs.current[timeKey];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });
}, [active, tasks]);




  // FULL SCREEN EDIT MODE
if (editTask) {
  return (
    <EditTaskForm
      task={editTask}
      onClose={() => setEditTask(null)}
      onUpdated={async () => {
        const userId = useUserStore.getState().userId;
        const selectedDate = useDateStore.getState().selectedDate;

        if (!userId) return;

        await useTasksStore.getState().loadTasks(
          userId,
          selectedDate.format("YYYY-MM-DD")
        );

        setEditTask(null);
      }}
    />
  );
}


  return (
    <div className="bg-[#F3F4F6]  ">

            {/* TIME HEADING */}
      <div className="pl-6 py-2 text-gray-500 text-sm font-semibold tracking-wide">
        TIME
      </div>

      {sortedTimes.map((time) => {
        const timeTasks = tasks.filter(
          (t) => t.startTime && normalize(t.startTime!) === time
        );

        return (
          <div
            key={time}
            ref={(el) => (slotRefs.current[time] = el)}
          >
<TimeSlot time={time}>
  {timeTasks
    .filter((task) => task.type === "scheduled")
    .map((task) => (
      <OneTimeTaskCard
        key={task.id}
        task={task}
        onComplete={(id) => updateTaskState(id, "completed")}
        onMissed={(id) => updateTaskState(id, "missed")}
        onEdit={() => setEditTask(task)}
        onDelete={(id) => deleteTaskLocal(id)}
      />
    ))}
</TimeSlot>

          </div>
        );
      })}
    </div>
  );
}
