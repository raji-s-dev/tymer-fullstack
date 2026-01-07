import { db } from "../config/db";

export function startCooldownScheduler(): void {
  // runs every 30 seconds
  setInterval(async () => {
    try {
      await db.query(
        `UPDATE tasks t
         SET state = 'pending',
             updated_at = NOW()
         FROM ondemand_metadata m
         WHERE t.id = m.task_id
           AND t.state = 'cooldown'
           AND m.cooldown_end IS NOT NULL
           AND NOW() >= m.cooldown_end`
      );
    } catch (err) {
      console.error("Cooldown scheduler error:", err);
    }
  }, 30 * 1000); // 30 seconds
}
