import { useEffect, useState } from "react";

type CalendarEvent = {
  externalId: string;
  title: string;
  description:string;
  startAt: number | null;
  endAt: number | null;
  isAllDay: boolean;
};

type Props = {
  onImportTask: (task: {
    title: string;
    description?: string;
    startAt: number;
    endAt: number;
  }) => void;
};

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function formatISTTime(ts: number) {
  return new Date(ts - IST_OFFSET_MS).toLocaleString("en-IN", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}


export default function GoogleCalendarSection({ onImportTask }: Props) {
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() =>
  new Date().toISOString().split("T")[0] // YYYY-MM-DD
);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(
      "https://tymer-backend.onrender.com/google/calendar/status",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      const data = await res.json();
      setCalendarConnected(data.connected);
    }
  };

  const connectCalendar = () => {
    const token = localStorage.getItem("token");
    window.location.href =
      `https://tymer-backend.onrender.com/google/calendar/connect?token=${token}`;
  };

const fetchEvents = async () => {
  setLoading(true);
  const token = localStorage.getItem("token");

  const res = await fetch(
    `https://tymer-backend.onrender.com/google/calendar/events?date=${selectedDate}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();
  setEvents(data.events || []);
  setLoading(false);
};


  return (
    <div>
<div className="flex flex-row justify-between" >
      <h2 className="text-2xl font-semibold mb-6">Google Calendar</h2>
        <button
          onClick={connectCalendar}
          disabled={calendarConnected}
          className={`px-4 py-2 rounded-lg ${
            calendarConnected
              ? "bg-gray-400 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {calendarConnected ? "Connected ✅" : "Connect"}
        </button>
        </div>
      <div className="space-x-3 mb-6">

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-600 mb-1">
    Select Date
  </label>
  <input
  placeholder="date"
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    className="border px-3 py-2 rounded-lg"
  />
</div>
        <button
          onClick={fetchEvents}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Events"}
        </button>
      </div>

      {events.length > 0 && (
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {events.map((e) => (
            <li key={e.externalId} className="border p-3 rounded">
              <p className="font-medium">{e.title}</p>
<p className="text-sm text-gray-500">
  {e.isAllDay || e.startAt == null
    ? "All Day"
    : formatISTTime(e.startAt)}
</p>

<p className="text-sm text-gray-500">
  {e.isAllDay || e.endAt == null
    ? "All Day"
    : formatISTTime(e.endAt)}
</p>



              <button
  className="px-4 py-2 border mt-2"
  onClick={() =>
    onImportTask({
      title: e.title,
      description:e.description,
      startAt: e.startAt!,
      endAt: e.endAt!,
    })
  }
>
  Import
</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
