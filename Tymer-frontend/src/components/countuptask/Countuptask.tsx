import CountupTaskCard from "../TaskCard/Countup/CountupTaskCard";
import { useTasksStore } from "../../store/useTasksStore";
import { deleteTask } from "../../services/taskapi";
import { useState } from "react";
import { ConfirmPopup } from "../TaskCard/OneTime/components/ConfirmPopup";
import EditTaskForm from "../EditTask/EditTaskForm";
import type { Task } from "../../store/useTasksStore";
import { useUserStore } from "../../store/useUserStore";
import nocount from "../../assets/countup/nocounttask.jpg";

export default function Countuptask() {
  const tasks = useTasksStore((s) => s.tasks);
  const deleteTaskLocal = useTasksStore((s) => s.deleteTaskLocal);

  const loadTasks = useTasksStore((s) => s.loadTasks);
const userId = useUserStore((s) => s.userId);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteTask(deleteId);
      deleteTaskLocal(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  // -------------------------------------------------------
  // FULL-SCREEN EDIT MODE
  // -------------------------------------------------------
  if (editTask) {
    return (
      <EditTaskForm
        task={editTask}
        onClose={() => setEditTask(null)}
onUpdated={() => {
  if (!userId) return; // <-- fix

  loadTasks(userId, new Date().toISOString().split("T")[0]);
  setEditTask(null);
}}
      />
    );
  }
// -------------------------------------------------------
// DEFAULT VIEW — TASK LIST
// -------------------------------------------------------
return (
  <>
      <div
    className="
      grid
      gap-6
      p-6
      justify-start
      [grid-template-columns:repeat(auto-fill,621px)]
    "
  >

      {/* ✅ If NO count-up tasks → show message */}
      {tasks.filter((t) => t.type === "countup").length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          

                  <img src={nocount} alt="No Tasks" className="mx-auto mt-16 w-64 h-64 object-contain" />
        <h1>No Count-up Tasks Available</h1>
        
        </div>
      ) : (
        tasks
          .filter((t) => t.type === "countup")
          .map((task) => (
            <CountupTaskCard
              key={task.id}
              task={task}
              onEdit={(t) => setEditTask(t)}
              onDelete={() => setDeleteId(task.id)}
            />
          ))
      )}
    </div>

    {deleteId && (
      <ConfirmPopup
        message="Are you sure you want to delete this Count-up task?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    )}
  </>
);
}