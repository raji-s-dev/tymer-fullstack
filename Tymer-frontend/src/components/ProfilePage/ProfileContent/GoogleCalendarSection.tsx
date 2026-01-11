import { useEffect, useState } from "react";
import {
  getGoogleCalendarStatus,
  connectGoogleCalendar,
  fetchGoogleCalendarEvents,
} from "@/services/googleCalendarApi";

type CalendarEvent = {
  externalId: string;
  title: string;
  description: string;
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
  const [hasFetched, setHasFetched] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  /* ---------------- STATUS CHECK ---------------- */
  const checkStatus = async () => {
    try {
      const data = await getGoogleCalendarStatus();
      setCalendarConnected(data.connected);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  /* -------- RESET ON DATE CHANGE -------- */
  useEffect(() => {
    setHasFetched(false);
    setEvents([]);
  }, [selectedDate]);

  /* ---------------- HANDLERS ---------------- */
  const connectCalendarHandler = () => {
    connectGoogleCalendar();
  };

  const fetchEvents = async () => {
    setLoading(true);
    setHasFetched(true);

    try {
      const data = await fetchGoogleCalendarEvents(selectedDate);
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div>
      {/* NOT CONNECTED */}
      {!calendarConnected && (
        <div className="flex flex-col gap-3 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-semibold">Google Calendar</h2>

          <p className="text-sm text-gray-600 max-w-md">
            Connect your Google Calendar to import events and manage them as
            tasks inside Tymer.
          </p>

          <button
            onClick={connectCalendarHandler}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Connect Google Calendar
          </button>
        </div>
      )}

      {/* CONNECTED */}
      {calendarConnected && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Google Calendar</h2>

            <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
              Connected
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div>
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
              disabled={loading}
              className="self-end px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Fetch Events"}
            </button>
          </div>

          {/* EMPTY STATE */}
          {hasFetched && !loading && events.length === 0 && (
            <p className="text-gray-500 text-sm">
              No events found for the selected date.
            </p>
          )}

          {/* EVENTS */}
          {events.length > 0 && (
            <ul className="space-y-3 max-h-96 overflow-y-auto">
              {events.map((e) => (
                <li key={e.externalId} className="border p-4 rounded-lg">
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
                    className="mt-2 px-4 py-2 border rounded hover:bg-gray-50"
                    onClick={() =>
                      onImportTask({
                        title: e.title,
                        description: e.description,
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
        </>
      )}
    </div>
  );
}
