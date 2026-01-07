import { Request, Response } from "express";
import { oauth2Client } from "../config/googleClient";
import { google } from "googleapis";
import { db } from "../config/db";
import dayjs from "dayjs";
import { createGoogleCalendarEvent } from "../services/googleCalendarWrite.service";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
// 1️⃣ OAuth callback

export const googleCalendarCallback = async (req: Request, res: Response) => {
  console.log("CALLBACK QUERY:", req.query);

  try {
    const { code, state } = req.query;
    const userId = state as string;

    if (!code || !userId) {
      return res.status(400).json({ error: "Missing code or state" });
    }

    // 1️⃣ Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    // 2️⃣ Fetch Google account info (IMPORTANT)
    const oauth2 = google.oauth2("v2");
    const { data } = await oauth2.userinfo.get({
      auth: oauth2Client,
    });

    const googleCalendarId = data.id;
    const googleCalendarEmail = data.email;

    // 3️⃣ Store calendar identity + tokens (non-breaking)
    await db.query(
      `
      UPDATE users
      SET
        google_calendar_id = $1,
        google_calendar_email = $2,
        google_refresh_token = COALESCE($3, google_refresh_token),
        google_access_token = $4
      WHERE id = $5
      `,
      [
        googleCalendarId,
        googleCalendarEmail,
        tokens.refresh_token,
        tokens.access_token,
        userId,
      ]
    );

    // 4️⃣ Handle already-connected case safely
    if (!tokens.refresh_token) {
      return res.redirect(
        process.env.FRONTEND_URL + "/settings?calendar=already_connected"
      );
    }

    return res.redirect(
      process.env.FRONTEND_URL + "/settings?calendar=connected"
    );
  } catch (err) {
    console.error("Google Calendar OAuth error:", err);
    return res.redirect(
      process.env.FRONTEND_URL + "/settings?calendar=error"
    );
  }
};

// 2️⃣ Fetch upcoming events using refresh token
export const fetchGoogleCalendarEvents = async (req: any, res: any) => {
  try {
    const userId = req.userId;

    const result = await db.query(
      "SELECT google_refresh_token FROM users WHERE id=$1",
      [userId]
    );

    const refreshToken = result.rows[0]?.google_refresh_token;
    if (!refreshToken) {
      return res.status(400).json({ error: "Google Calendar not connected" });
    }

    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items?.map((event) => {
      const start = event.start?.dateTime || event.start?.date;
      const end = event.end?.dateTime || event.end?.date;

      return {
        externalId: event.id,
        title: event.summary || "Untitled Event",
        description: event.description || "",
        startAt: start ? dayjs(start).valueOf() : null,
        endAt: end ? dayjs(end).valueOf() : null,
        isAllDay: !!event.start?.date,
        source: "google-calendar",
      };
    });

    res.json({ count: events?.length || 0, events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Google Calendar events" });
  }
};


export const googleCalendarStatus = async (req: any, res: any) => {
  try {
    const userId = req.userId;

    const result = await db.query(
      "SELECT google_refresh_token FROM users WHERE id=$1",
      [userId]
    );

    const connected = !!result.rows[0]?.google_refresh_token;

    res.json({ connected });
  } catch (err) {
    console.error("Google Calendar status error:", err);
    res.status(500).json({ error: "Failed to check calendar status" });
  }
};










export const writeTaskToGoogleCalendar = async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const { taskId } = req.body;

// 1. Fetch task
const taskRes = await db.query(
  "SELECT * FROM tasks WHERE id=$1 AND user_id=$2",
  [taskId, userId]
);

const task = taskRes.rows[0];
if (!task) return res.status(404).json({ error: "Task not found" });

    // 2. Prevent duplicate sync
    if (task.google_event_id) {
      return res.status(400).json({ error: "Task already synced" });
    }

    
    // 3. Fetch metadata for scheduled task
    const metaRes = await db.query(
      "SELECT start_date, start_time, end_time FROM one_time_metadata WHERE task_id=$1",
      [task.id]
    );
    const meta = metaRes.rows[0];
    if (!meta) {
      return res.status(400).json({ error: "Scheduled task metadata missing" });
    }

    if (!meta.start_date || !meta.start_time || !meta.end_time) {
  return res.status(400).json({ error: "Scheduled task metadata incomplete" });
}
const startDate = dayjs(meta.start_date).format("YYYY-MM-DD");
const startAtStr = `${startDate} ${meta.start_time}`;
const endAtStr   = `${startDate} ${meta.end_time}`;

const FORMAT = "YYYY-MM-DD HH:mm:ss";

const startAt = dayjs(startAtStr, FORMAT).tz("Asia/Kolkata", true);
const endAt   = dayjs(endAtStr, FORMAT).tz("Asia/Kolkata", true);



if (!startAt.isValid() || !endAt.isValid()) {
  return res.status(400).json({ error: `Invalid task time: ${startAtStr} - ${endAtStr}` });
}
    // sanity check
    if (!startAt || !endAt) {
      return res.status(400).json({ error: "Task start or end time missing" });
    }

    // 3. Get refresh token
    const userRes = await db.query(
      "SELECT google_refresh_token FROM users WHERE id=$1",
      [userId]
    );

    const refreshToken = userRes.rows[0]?.google_refresh_token;
    if (!refreshToken) {
      return res.status(400).json({ error: "Google Calendar not connected" });
    }

    // 4. Auth
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    // 5. Create calendar event
const googleEventId = await createGoogleCalendarEvent(oauth2Client, {
  title: task.task_name,
  description: task.task_details,
   startAt,
    endAt   // ✅ FIX
});


    // 6. Save mapping
    await db.query(
      "UPDATE tasks SET google_event_id=$1 WHERE id=$2",
      [googleEventId, taskId]
    );

    res.json({ success: true, googleEventId });
  }  catch (err: any) {
    console.error("Google Calendar write error:");
  console.error(err?.response?.data || err);
    res.status(500).json({  error: "Failed to write to Google Calendar",
    details: err?.response?.data || null, });
  }
};
