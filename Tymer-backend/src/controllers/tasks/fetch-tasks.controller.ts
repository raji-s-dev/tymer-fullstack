import { Request, Response } from "express";
import { db } from "../../config/db";
import dayjs from "dayjs";

// ----- getTasksByDate -----
export const getTasksByDate = async (req: Request, res: Response) => {
  try {
    const user_id = req.params.user_id;
    const dateStr = req.query.date as string;

    if (!dateStr) return res.status(400).json({ message: "date query required" });

    const selectedDate = dayjs(dateStr);
    const tasksResult = await db.query(`SELECT * FROM tasks WHERE user_id = $1`, [user_id]);
    const tasks = tasksResult.rows;
    const finalTasks: any[] = [];

for (const task of tasks) {

  // ---------------- scheduled ----------------
  if (task.category === "scheduled") {
    const meta = (await db.query(
      `SELECT * FROM one_time_metadata WHERE task_id = $1`,
      [task.id]
    )).rows[0];

    if (dayjs(meta.start_date).isSame(selectedDate, "day")) {
      const taskDateStr = dayjs(meta.start_date).format("YYYY-MM-DD");

      // Completed
      const completedHistory = await db.query(
        `SELECT occurrence_timestamp 
         FROM task_history 
         WHERE task_id = $1 
         AND event_type = 'completed'
         AND DATE(occurrence_timestamp) = $2
         ORDER BY occurrence_timestamp DESC
         LIMIT 1`,
        [task.id, taskDateStr]
      );

      const completedAt = completedHistory.rows[0]?.occurrence_timestamp || null;

      // Missed
      const missedHistory = await db.query(
        `SELECT occurrence_timestamp 
         FROM task_history 
         WHERE task_id = $1 
         AND event_type = 'missed'
         AND DATE(occurrence_timestamp) = $2
         ORDER BY occurrence_timestamp DESC
         LIMIT 1`,
        [task.id, taskDateStr]
      );

      const missedAt = missedHistory.rows[0]?.occurrence_timestamp || null;

      const startDateTime = `${taskDateStr}T${meta.start_time}`;
      const endDateTime = `${taskDateStr}T${meta.end_time}`;

      finalTasks.push({
        id: task.id,
        title: task.task_name,
        description: task.task_details,
        type: task.category,
        startTime: startDateTime,
        endTime: endDateTime,
        state: task.state,
        startdate: meta.start_date,
        googleEventId:task.google_event_id,
  history: [
    ...(completedAt ? [{ type: "completed", timestamp: completedAt }] : []),
    ...(missedAt ? [{ type: "missed", timestamp: missedAt }] : []),
  ],
      });
    }
    continue;
  }


// ---------------- ON-DEMAND ----------------
if (task.category === "ondemand") {
  const meta = (
    await db.query(
      `SELECT * FROM ondemand_metadata WHERE task_id = $1`,
      [task.id]
    )
  ).rows[0];

  // Use the actual database state if it exists, otherwise compute from metadata
  let state = task.state;


  finalTasks.push({
    id: task.id,
    title: task.task_name,
    description: task.task_details,
    type: "ondemand",
    duration: `${meta.duration_value} ${meta.duration_unit}`,
    cooldown: `${meta.cooldown_value} ${meta.cooldown_unit}`,
    cooldownEnd: meta.cooldown_end,
    lastCompletedAt: meta.last_completed_at,

    state, // now uses actual DB state if set
  });

  continue;
}

  // ---------------- ondemand instance ----------------
// ---------------- ondemand instance ----------------
if (task.category === "ondemandinstance") {
  const meta = (await db.query(
    `SELECT * FROM ondemandinstance_metadata WHERE task_id = $1`,
    [task.id]
  )).rows[0];

  if (!meta) continue;

  const taskDateStr = dayjs(meta.start_date).format("YYYY-MM-DD");

  // Get all events for this instance
  const historyRows = await db.query(
    `SELECT event_type, occurrence_timestamp
     FROM task_history
     WHERE task_id = $1
     ORDER BY occurrence_timestamp ASC`,
    [task.id]
  );

  const history = historyRows.rows.map((r) => ({
    type: r.event_type,
    timestamp: r.occurrence_timestamp,
  }));

  finalTasks.push({
    id: task.id,
    instanceId: task.id,
    metadataId: meta.id,
    title: task.task_name,
    description: task.task_details,
    type: "ondemandinstance",
    startTime: `${taskDateStr}T${meta.start_time}`,
    endTime: `${taskDateStr}T${meta.end_time}`,
    state: task.state,
    startdate: meta.start_date,
    history,
  });

  continue;
}



// INSERTED BLOCK (after ondemandinstance block, before end of loop)
//countup

if (task.category === "countup") {
  const meta = (
    await db.query(
      `SELECT completed_date, completed_time 
       FROM countup_metadata
       WHERE task_id = $1`,
      [task.id]
    )
  ).rows[0];

  if (meta) {
    finalTasks.push({
      id: task.id,
      title: task.task_name,
      description: task.task_details,
      type: "countup",
      completedDate: meta.completed_date,
      completedTime: meta.completed_time,
      state: task.state,
    });
  }

  continue;
}

}


    res.json({ tasks: finalTasks });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// ----- getTaskCountsByMonth -----
export const getTaskCountsByMonth = async (req: Request, res: Response) => {
  try {
    const user_id = req.params.user_id;
    const monthStr = req.query.month as string;

    if (!monthStr)
      return res.status(400).json({ message: "month query required" });

    const startDate = dayjs(monthStr + "-01").startOf("month");
    const endDate = dayjs(monthStr + "-01").endOf("month");

    const counts: Record<string, number> = {};

    const oneTimeRows = await db.query(
      `SELECT m.start_date
       FROM one_time_metadata m
       JOIN tasks t ON t.id = m.task_id
       WHERE t.user_id = $1
         AND m.start_date BETWEEN $2 AND $3`,
      [user_id, startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")]
    );

    oneTimeRows.rows.forEach((r: any) => {
      const day = dayjs(r.start_date).format("YYYY-MM-DD");
      counts[day] = (counts[day] || 0) + 1;
    });

    res.json({ counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
