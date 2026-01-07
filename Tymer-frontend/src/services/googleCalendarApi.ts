import { API_BASE_URL } from "@/config/api";

export async function writeTaskToGoogleCalendar(taskId: string) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE_URL}/google/calendar/write`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ taskId }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to add to Google Calendar");
  }

  return res.json();
}
