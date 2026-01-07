import { google } from "googleapis";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { OAuth2Client } from "google-auth-library";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function fetchCalendarEvents(
  oauth2Client: OAuth2Client,
  date?: string
) {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // ✅ FIX: preserve local date as IST
  const baseDate = date
    ? dayjs(date).tz("Asia/Kolkata", true)
    : dayjs().tz("Asia/Kolkata");

  const dayStart = baseDate.startOf("day");
  const dayEnd = baseDate.endOf("day");

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: dayStart.toISOString(),
    timeMax: dayEnd.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 50,
  });

  return (
    res.data.items
      ?.map((event) => {
        const start = event.start?.dateTime || event.start?.date;
        const end = event.end?.dateTime || event.end?.date;

        const startAt = start ? new Date(start).getTime() : null;

        return {
          externalId: event.id,
          title: event.summary || "Untitled Event",
          description: event.description || "No description",
          startAt,
          endAt: end ? new Date(end).getTime() : null,
          isAllDay: !!event.start?.date,
          source: "google-calendar",
        };
      })
      // ✅ HARD FILTER (now it will actually work)
      .filter((e) => {
        if (!e.startAt) return false;
        return (
          e.startAt >= dayStart.valueOf() &&
          e.startAt <= dayEnd.valueOf()
        );
      }) || []
  );
}
