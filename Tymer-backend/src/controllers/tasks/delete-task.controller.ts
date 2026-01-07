import { Request, Response } from "express";
import { db } from "../../config/db";


export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task_id = req.params.task_id;

    // Delete from task history
    await db.query(`DELETE FROM task_history WHERE task_id = $1`, [task_id]);

    // Delete Count-up metadata
    await db.query(`DELETE FROM countup_metadata WHERE task_id = $1`, [task_id]);

    // Delete One-time metadata (if exists)
    await db.query(`DELETE FROM one_time_metadata WHERE task_id = $1`, [task_id]);

    // Delete On-demand metadata (if exists)
    await db.query(`DELETE FROM ondemand_metadata WHERE task_id = $1`, [task_id]);

// Safe delete: only run if table exists
try {
  await db.query(`DELETE FROM ondemandinstance_metadata WHERE parent_task_id = $1`, [task_id]);
} catch (e) {
  // ignore if table doesn't exist
}

    // Finally delete from tasks
    await db.query(`DELETE FROM tasks WHERE id = $1`, [task_id]);

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};