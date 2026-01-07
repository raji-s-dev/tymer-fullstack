import { Request, Response } from "express";
import { db } from "../../config/db";
import dayjs from "dayjs";

// --- your unchanged code ---
export const createTask = async (req: Request, res: Response) => {
  try {
    const { user_id, task_name, task_details, category } = req.body;

    const result = await db.query(
      `INSERT INTO tasks (user_id, task_name, task_details, category)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, task_name, task_details, category]
    );

    const task = result.rows[0];

    if (category === "ondemand") {
      const { durationValue, durationUnit, cooldownValue, cooldownUnit } =
        req.body.ondemand_metadata;

      await db.query(
        `INSERT INTO ondemand_metadata 
         (task_id, duration_value, duration_unit, cooldown_value, cooldown_unit)
         VALUES ($1, $2, $3, $4, $5)`,
        [task.id, durationValue, durationUnit, cooldownValue, cooldownUnit]
      );
    }

    if (category === "scheduled") {
      const { startDate, startTime, endTime } = req.body.one_time_metadata;

      await db.query(
        `INSERT INTO one_time_metadata (task_id, start_date, start_time, end_time)
         VALUES ($1, $2, $3, $4)`,
        [task.id, startDate, startTime, endTime]
      );
    }

        // ---------- COUNTUP TASK ----------
    if (category === "countup") {
      const { completedDate, completedTime } = req.body.countup_metadata;

      await db.query(
        `INSERT INTO countup_metadata (task_id, completed_date, completed_time)
         VALUES ($1, $2, $3)`,
        [task.id, completedDate, completedTime]
      );
    }

    res.status(201).json({ task });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
