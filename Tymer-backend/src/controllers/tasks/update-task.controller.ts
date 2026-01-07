import { Request, Response } from "express";
import { db } from "../../config/db";

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.task_id;
    const { task_name, task_details, category } = req.body;

    // -------------------------------------------------------
    // UPDATE MAIN TASK TABLE
    // -------------------------------------------------------
    const updatedTask = await db.query(
      `UPDATE tasks
       SET task_name = $1,
           task_details = $2,
           category = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [task_name, task_details, category, taskId]
    );

    if (updatedTask.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    // -------------------------------------------------------
    // UPDATE METADATA BASED ON CATEGORY
    // -------------------------------------------------------

    // 🔹 ONDEMAND
    if (category === "ondemand") {
      const { durationValue, durationUnit, cooldownValue, cooldownUnit } =
        req.body.ondemand_metadata;

      await db.query(
        `UPDATE ondemand_metadata
         SET duration_value = $1,
             duration_unit = $2,
             cooldown_value = $3,
             cooldown_unit = $4
         WHERE task_id = $5`,
        [durationValue, durationUnit, cooldownValue, cooldownUnit, taskId]
      );
    }

    // 🔹 SCHEDULED / ONE-TIME
    if (category === "scheduled") {
      const { startDate, startTime, endTime } = req.body.one_time_metadata;

      await db.query(
        `UPDATE one_time_metadata
         SET start_date = $1,
             start_time = $2,
             end_time = $3
         WHERE task_id = $4`,
        [startDate, startTime, endTime, taskId]
      );
    }

    // 🔹 COUNTUP
    if (category === "countup") {
      const { completedDate, completedTime } = req.body.countup_metadata;

      await db.query(
        `UPDATE countup_metadata
         SET completed_date = $1,
             completed_time = $2
         WHERE task_id = $3`,
        [completedDate, completedTime, taskId]
      );
    }

    res.json({ message: "Task updated successfully" });

  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
