import { API_BASE_URL } from "@/config/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  return {
    Authorization: `Bearer ${token}`,
  };
}

/* ------------------ STATUS ------------------ */
export async function getGoogleCalendarStatus() {
  const res = await fetch(`${API_BASE_URL}/google/calendar/status`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch calendar status");
  }

  return res.json(); // { connected: boolean }
}

/* ------------------ CONNECT ------------------ */
export function connectGoogleCalendar() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  window.location.href = `${API_BASE_URL}/google/calendar/connect?token=${token}`;
}

/* ------------------ FETCH EVENTS ------------------ */
export async function fetchGoogleCalendarEvents(date: string) {
  const res = await fetch(
    `${API_BASE_URL}/google/calendar/events?date=${date}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  return res.json(); // { events: CalendarEvent[] }
}

/* ------------------ WRITE TASK ------------------ */
export async function writeTaskToGoogleCalendar(taskId: string) {
  const res = await fetch(`${API_BASE_URL}/google/calendar/write`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ taskId }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to add to Google Calendar");
  }

  return res.json();
}
