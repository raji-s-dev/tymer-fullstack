import axios from "axios";
import { API_BASE_URL } from "@/config/api";

// ---------------- CREATE TASK ----------------
export const createTask = async (
  payload: any
) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/tasks`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to create task:", err.response?.data || err.message);
    throw err;
  }
};

// ---------------- GET TASKS BY DATE ----------------
export async function getTasksByDate(userId: string, date: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/tasks/${userId}/day?date=${date}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching tasks by date:", err);
    return { tasks: [] };
  }
}

// ---------------- GET TASK COUNTS BY MONTH ----------------
export const getTaskCountsByMonth = async (userId: string, month: string) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/tasks/${userId}/month?month=${month}`
    );
    return res.data.counts || {};
  } catch (err) {
    console.error("Error fetching month task counts:", err);
    return {};
  }
};

// ---------------- RECORD TASK EVENT ----------------
export const recordTaskEvent = async (
  taskId: string,
  eventType: "completed" | "missed" | "started",
  instanceId?: string
) => {
  const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, instanceId: instanceId ?? null }),
  });

  if (!res.ok) throw new Error("Failed to record task event");
  return res.json();
};

// ---------------- DELETE TASK ----------------
export const deleteTask = async (taskId: string) => {
  const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
};

// ---------------- ON-DEMAND TASKS ----------------
export const startOnDemand = async (taskId: string) => {
  const res = await fetch(`${API_BASE_URL}/ondemand/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task_id: taskId }),
  });

  if (!res.ok) throw new Error("Failed to start on-demand task");
  return res.json();
};

export async function completeCooldown(taskId: string) {
  const res = await fetch(
    `${API_BASE_URL}/tasks/${taskId}/cooldown-complete`,
    { method: "POST" }
  );

  if (!res.ok) throw new Error("Failed to complete cooldown");
  return res.json();
}

// ---------------- EDIT TASK ----------------
export const editTask = async (taskId: string, payload: any) => {
  const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
};
