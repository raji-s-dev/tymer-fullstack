import { Request, Response } from "express";
import { db } from "../../config/db";

export const completeCooldown = async (req: Request, res: Response) => {
  try {
    const { task_id } = req.params;

    // Validate task
    const taskRes = await db.query(
      `SELECT state FROM tasks WHERE id = $1`,
      [task_id]
    );

    if (taskRes.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only allow if it's truly in cooldown
    if (taskRes.rows[0].state !== "cooldown") {
      return res.status(400).json({ message: "Task not in cooldown" });
    }

    // Update to pending
    await db.query(
      `UPDATE tasks
       SET state = 'pending',
           updated_at = NOW()
       WHERE id = $1`,
      [task_id]
    );

    return res.status(200).json({ message: "Cooldown completed → Pending" });

  } catch (error) {
    console.error("Cooldown update error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
