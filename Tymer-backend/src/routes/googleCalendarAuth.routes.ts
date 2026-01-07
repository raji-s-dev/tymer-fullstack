import express from "express";
import jwt from "jsonwebtoken";
import { oauth2Client } from "../config/googleClient";
import {
  googleCalendarCallback,
  googleCalendarStatus,
} from "../controllers/googleCalendarController";
import { auth } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * Step 1: Redirect to Google consent screen
 * GET /api/google-calendar/auth/connect?token=JWT
 */
router.get("/connect", (req, res) => {
  const token = req.query.token as string;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  let payload: any;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }

  const userId = payload.id;

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "openid",
],
    state: String(userId),
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  });

  res.redirect(url);
});

/**
 * Step 2: OAuth callback
 */
router.get("/callback", googleCalendarCallback);

/**
 * Step 3: Check connection status
 */
router.get("/status", auth, googleCalendarStatus);

export default router;
