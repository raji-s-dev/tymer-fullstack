// useTasksStore.ts
import { create } from "zustand";
import { getTasksByDate, getTaskCountsByMonth } from "../services/taskapi";


export interface Task {
  id: string;
  instanceId?: string;   // 🔥 FIXES THE ISSUE
  metadataId?: string;   // optional but useful
  
  title: string;
  description?: string;

  type: "ondemand" | "ondemandinstance" | "scheduled" | "countup";

  // for scheduled tasks
  startTime?: string | null;
  endTime?: string | null;
  googleEventId?: string | null;
  
  // for ondemand
  duration?: string;
  cooldown?: string;
  cooldownEnd?: string | null;
  lastCompletedAt?: string | null;

    // for countup
  completedDate?: string;
  completedTime?: string;

  state:
    | "pending"
    | "active"
    | "completed"
    | "missed"
    | "action-required"
    | "available"
    | "cooldown";
    
  // add history field
  history?: {
    type: "completed" | "missed";
    timestamp: string;
  }[];
}


interface TaskStore {
  tasks: Task[];
  taskCounts: Record<string, number>;

  loadTasks: (userId: string, date: string) => Promise<void>;
  loadTaskCounts: (userId: string, month: string) => Promise<void>;

  updateTaskState: (id: string, state: Task["state"]) => void;
  deleteTaskLocal: (id: string) => void;
}

export const useTasksStore = create<TaskStore>((set) => ({
  tasks: [],
  taskCounts: {},

  loadTasks: async (userId, date) => {
    try {
      const res = await getTasksByDate(userId, date);
      set({ tasks: res.tasks || [] });
    } catch {
      set({ tasks: [] });
    }
  },

  loadTaskCounts: async (userId, month) => {
    try {
      const counts = await getTaskCountsByMonth(userId, month);
      set({ taskCounts: counts });
    } catch {
      set({ taskCounts: {} });
    }
  },

updateTaskState: (taskId, newState) =>
  set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            state: newState,
            // remove completedAt/missedAt
          }
        : t
    ),
  })),

  deleteTaskLocal: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    })),
}));
