import { Request, Response } from "express";
import { db } from "../../config/db";

export const startOnDemandTask = async (req: Request, res: Response) => {
  try {
    const { task_id } = req.body;

    // 1️⃣ Fetch on-demand metadata
    const metaResult = await db.query(
      `SELECT * FROM ondemand_metadata WHERE task_id = $1`,
      [task_id]
    );
    const meta = metaResult.rows[0];

    if (!meta) {
      return res.status(404).json({ message: "On-demand metadata not found" });
    }

    // 2️⃣ Fetch the original task
    const taskResult = await db.query(
      `SELECT * FROM tasks WHERE id = $1`,
      [task_id]
    );
    const originalTask = taskResult.rows[0];

    if (!originalTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 3️⃣ Update original task state to "active"
    await db.query(
      `UPDATE tasks SET state = 'active', updated_at = NOW() WHERE id = $1`,
      [task_id]
    );

    // 4️⃣ Compute duration and end time in milliseconds
    const durationMs =
      meta.duration_value *
      (meta.duration_unit === "seconds"
        ? 1000
        : meta.duration_unit === "minutes"
        ? 60000
        : meta.duration_unit === "hours"
        ? 3600000
        : 0);

    // Use local date/time for start
const now = new Date();

// Convert to IST consistently
const istOffset = 5.5 * 60 * 60 * 1000;
const nowIST = new Date(now.getTime() + istOffset);

// Helper to pad 2 digits
const pad = (n: number) => String(n).padStart(2, "0");

// Format start date/time in IST
const startDate = `${nowIST.getFullYear()}-${pad(nowIST.getMonth() + 1)}-${pad(nowIST.getDate())}`;
const startTimeStr = `${pad(nowIST.getHours())}:${pad(nowIST.getMinutes())}:${pad(nowIST.getSeconds())}`;

// Compute end time
const endIST = new Date(nowIST.getTime() + durationMs);

// Format end time (also IST)
const endTimeStr = `${pad(endIST.getHours())}:${pad(endIST.getMinutes())}:${pad(endIST.getSeconds())}`;

    // 5️⃣ Insert new on-demand instance task
    const newTaskResult = await db.query(
      `INSERT INTO tasks (user_id, task_name, task_details, category, state)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        originalTask.user_id,
        originalTask.task_name,
        originalTask.task_details,
        "ondemandinstance",
        "pending",
      ]
    );
    const newTaskId = newTaskResult.rows[0].id;

    // 6️⃣ Insert instance metadata with parent_task_id
    const instance = await db.query(
      `INSERT INTO ondemandinstance_metadata
         (task_id, start_date, start_time, end_time, parent_task_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [newTaskId, startDate, startTimeStr, endTimeStr, task_id]
    );

    // 7️⃣ Return response
    res.json({
      message: "On-demand task started and instance created",
      originalTask: { ...originalTask, state: "active" },
      instanceTask: newTaskResult.rows[0],
      instanceMetadata: instance.rows[0],
    });
  } catch (err) {
    console.error("Error starting on-demand task:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
