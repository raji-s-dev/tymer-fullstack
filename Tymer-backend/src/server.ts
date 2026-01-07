import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import otpRoutes from "./routes/otpRoutes";
import { auth } from "./middleware/authMiddleware";
import {db} from "./config/db";
import googleRoutes from "./routes/googleRoutes";
import taskRoutes from "./routes/taskRoutes";
import { startCooldownScheduler } from "./cron/cooldownScheduler";
import googleCalendarAuthRoutes from "./routes/googleCalendarAuth.routes";
import googleCalendarRoutes from "./routes/googleCalendar.routes";


dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://tymer-frontend.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/google/calendar", googleCalendarAuthRoutes);
app.use("/google/calendar", googleCalendarRoutes);     // events / write
app.use("/auth/google", googleRoutes);
app.use("/auth", authRoutes);
app.use("/auth", otpRoutes);
app.use("/tasks", taskRoutes);
app.use("/ondemand", taskRoutes);

startCooldownScheduler();


// 🛡 Protected Route – requires valid JWT
app.get("/auth/profile", auth, async (req, res) => {
  try {
    const user = await db.query(
      "SELECT id, google_id, email, name, picture, created_at FROM users WHERE id=$1",
      [req.userId]
    );

    if (!user.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: user.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
