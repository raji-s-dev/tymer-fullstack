import { startOnDemand } from "../../services/taskapi";
import { useTasksStore } from "../../store/useTasksStore";
import { useUserStore } from "../../store/useUserStore";
import { useDateStore } from "../../store/useDateStore";
import OnDemandTaskCard from "./../TaskCard/OnDemand/OnDemandTaskCard";
import OnDemandTaskCardState from "../TaskCard/OnDemand/OnDemandTaskCardState";
import { recordTaskEvent ,deleteTask } from "../../services/taskapi";
import { Task } from "../../store/useTasksStore";
import { useState } from "react";
import EditTaskForm from "../EditTask/EditTaskForm";
import notask from "../../assets/ondemand/notask.jpg";


export default function OnDemandList() {
  const tasks = useTasksStore((s) => s.tasks);
  const updateState = useTasksStore((s) => s.updateTaskState);
  const loadTasks = useTasksStore((s) => s.loadTasks);

  const userId = useUserStore((s) => s.userId);
  const selectedDate = useDateStore((s) => s.selectedDate);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const handleStart = async (taskId: string) => {
    try {
      // 1️⃣ Start the task on the server
      const res = await startOnDemand(taskId);
      console.log("Instance created:", res);

      // 2️⃣ Update the original on-demand task state to active locally
      updateState(taskId, "active");

      await loadTasks(userId!, selectedDate.format("YYYY-MM-DD")); // refresh from backend

      // 3️⃣ Reload tasks from the server (optional)
      await loadTasks(userId!, selectedDate.format("YYYY-MM-DD"));
    } catch (err) {
      console.error("Start error:", err);
    }
  };

  
  const handleDelete = async (taskId: string) => {
  try {
    await deleteTask(taskId);
    await loadTasks(userId!, selectedDate.format("YYYY-MM-DD"));
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

// FULL-SCREEN EDIT MODE
if (editTask) {
  return (
    <EditTaskForm
      task={editTask}
      onClose={() => setEditTask(null)}
      onUpdated={async () => {
        if (!userId) return;
        await loadTasks(userId, selectedDate.format("YYYY-MM-DD"));
        setEditTask(null);
      }}
    />
  );
}

return (
  <div
    className="
      grid
      gap-6
      p-6
      justify-start
      [grid-template-columns:repeat(auto-fill,621px)]
    "
  >
    {(() => {
      const visibleTasks = tasks.filter(
        (t) =>
          (t.type === "ondemand" && t.state !== "active") ||
          (t.type === "ondemandinstance" && t.state === "pending")
      );

      if (visibleTasks.length === 0) {
        return (
          <div className="text-center text-gray-500 py-6 col-span-full">
            <img
              src={notask}
              alt="No Tasks"
              className="mx-auto mt-16 w-64 h-64 object-contain "
            />
            <h1>No On-Demand Tasks Available</h1>
          </div>
        );
      }

      const instanceTasks = visibleTasks.filter(
        (t) => t.type === "ondemandinstance"
      );

      const normalTasks = visibleTasks.filter(
        (t) => t.type === "ondemand"
      );

      return [...instanceTasks, ...normalTasks].map((task) =>
        task.type === "ondemand" ? (
          <OnDemandTaskCard
            key={task.id}
            task={task}
            onStart={handleStart}
            onEdit={() => setEditTask(task)}
            onDelete={handleDelete}
          />
        ) : (
          <OnDemandTaskCardState
            key={task.id}
            task={task}
            onComplete={async (instanceId) => {
              await recordTaskEvent(instanceId, "completed");
              await loadTasks(
                userId!,
                selectedDate.format("YYYY-MM-DD")
              );
            }}
            onMissed={async (instanceId) => {
              await recordTaskEvent(instanceId, "missed");
              await loadTasks(
                userId!,
                selectedDate.format("YYYY-MM-DD")
              );
            }}
            onDelete={() => {}}
          />
        )
      );
    })()}
  </div>
);


}
