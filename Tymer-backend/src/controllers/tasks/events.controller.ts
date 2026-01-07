import { Request, Response } from "express";
import { db } from "../../config/db";

export const recordTaskEvent = async (req: Request, res: Response) => {
  try {
    const { instanceId, eventType } = req.body;
    const taskIdFromParams = req.params.task_id;

    // Validate eventType
    if (!["completed", "missed", "started"].includes(eventType)) {
      return res.status(400).json({ message: "Invalid eventType" });
    }

    // ============================================================
    // 1️⃣ CASE A: ON-DEMAND INSTANCE TASK
    // ============================================================
if (instanceId) {
  // 1. Insert history
  await db.query(
    `INSERT INTO task_history (task_id, event_type, occurrence_timestamp)
     VALUES ($1, $2, NOW())`,
    [instanceId, eventType]
  );

  // 2. Update INSTANCE task state
  await db.query(
    `UPDATE tasks
     SET state = $1,
         updated_at = NOW()
     WHERE id = $2`,
    [eventType, instanceId]
  );

// Correct fetch of parent_task_id
const parentRes = await db.query(
  `SELECT parent_task_id FROM ondemandinstance_metadata WHERE task_id = $1`,
  [instanceId] // instanceId is the task.id of the instance
);

  if (parentRes.rows.length > 0 && parentRes.rows[0].parent_task_id) {
    const parentTaskId = parentRes.rows[0].parent_task_id;

    // 4. Reset PARENT task state → cooldown
    await db.query(
      `UPDATE tasks
       SET state = 'cooldown',
           updated_at = NOW()
       WHERE id = $1`,
      [parentTaskId]
    );

      // 5. Load cooldown details from metadata
  const metaRes = await db.query(
    `SELECT cooldown_value, cooldown_unit 
     FROM ondemand_metadata 
     WHERE task_id = $1`,
    [parentTaskId]
  );
  

     if (metaRes.rows.length > 0) {
    const { cooldown_value, cooldown_unit } = metaRes.rows[0];

    // 6. Update metadata timestamps
    await db.query(
      `UPDATE ondemand_metadata
       SET last_completed_at = NOW(),
           cooldown_end = NOW() + ($2 || ' ' || $3)::interval
       WHERE task_id = $1`,
      [parentTaskId, cooldown_value, cooldown_unit]
    );
  }
  }

  return res.status(200).json({
    message: "Instance updated and parent task reset to cooldown",
  });
}


    // ============================================================
    // 2️⃣ CASE B: NORMAL / SCHEDULED / ONE-TIME TASK
    // ============================================================
    if (!taskIdFromParams) {
      return res.status(400).json({ message: "task_id missing in params" });
    }

    // 1. Insert history
    await db.query(
      `INSERT INTO task_history (task_id, event_type, occurrence_timestamp)
       VALUES ($1, $2, NOW())`,
      [taskIdFromParams, eventType]
    );

    // 2. Update task state
    await db.query(
      `UPDATE tasks
       SET state = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [eventType, taskIdFromParams]
    );

    return res.status(200).json({
      message: "Task updated successfully",
    });

  } catch (error) {
    console.error("Error recording task event:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
