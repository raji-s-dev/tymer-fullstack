import express from "express";
import { auth } from "../middleware/authMiddleware";
import { oauth2Client } from "../config/googleClient";
import { fetchCalendarEvents } from "../services/googleCalendar.service";
import { db } from "../config/db";
import { writeTaskToGoogleCalendar } from "../controllers/googleCalendarController";

const router = express.Router();


router.get("/events", auth, async (req: any, res) => {
  try {
    const userId = req.userId;
    const { date } = req.query;

    const result = await db.query(
      "SELECT google_refresh_token FROM users WHERE id=$1",
      [userId]
    );

    const refreshToken = result.rows[0]?.google_refresh_token;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Google Calendar not connected",
      });
    }

    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const events = await fetchCalendarEvents(
      oauth2Client,
      typeof date === "string" ? date : undefined
    );

    res.json({
      source: "google-calendar",
      count: events.length,
      events,
    });
  } catch (err) {
    console.error("Error fetching Google Calendar events:", err);
    res.status(500).json({ message: "Failed to fetch calendar events" });
  }
});


router.post("/write", auth, writeTaskToGoogleCalendar);

export default router;
