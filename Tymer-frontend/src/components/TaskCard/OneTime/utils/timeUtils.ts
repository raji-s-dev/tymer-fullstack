export type ComputedState =
  | "pending"
  | "active"
  | "action-required"
  | "completed"
  | "missed"
  | "upcoming"; // added

export function getComputedState(task: any): ComputedState {
  const now = new Date();
  const start = new Date(task.startTime!);
  const end = new Date(task.endTime!);

  if (task.state === "completed") return "completed";
  if (task.state === "missed") return "missed";

    const isToday =
    now.getFullYear() === start.getFullYear() &&
    now.getMonth() === start.getMonth() &&
    now.getDate() === start.getDate();

  // 🔹 Today task but start time not reached
  if (isToday && now < start) {
    return "pending";
  }


  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "active";
  if (now > end) return "action-required";

  return "pending";
}


export function getRemainingTimeMs(task: any) {
  const now = new Date();
  const end = new Date(task.endTime!);
  const diff = end.getTime() - now.getTime();
  return Math.max(diff, 0);
}

export function formatTimeRange(start: string, end: string) {
  const s = new Date(start).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const e = new Date(end).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${s} – ${e}`;
}

export function formatMs(ms: number) {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}m ${secs}s`;
}
