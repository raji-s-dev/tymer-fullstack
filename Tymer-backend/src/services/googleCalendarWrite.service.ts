import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Dayjs } from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

type CreateEventInput = {
  title: string;
  description?: string;
  startAt: Dayjs;
  endAt: Dayjs;
};
export async function createGoogleCalendarEvent(
  oauth2Client: OAuth2Client,
  task: CreateEventInput
) {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const { startAt, endAt } = task;

  if (!startAt.isValid() || !endAt.isValid()) {
    throw new Error("Invalid task time");
  }

  const event = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: `Tymer Task: ${task.title}`,
      description: `${task.description || ""}\n\n[Created by Tymer]`,
      start: {
        dateTime: startAt.format(), // ✅ safest for Google
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endAt.format(),
        timeZone: "Asia/Kolkata",
      },
    },
  });

  console.log("Google payload:", {
    start: startAt.format(),
    end: endAt.format(),
  });

  return event.data.id!;
}
