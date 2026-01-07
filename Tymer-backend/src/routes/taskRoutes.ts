import { Router } from "express";
import { createTask, getTasksByDate, getTaskCountsByMonth,recordTaskEvent, deleteTask, startOnDemandTask,updateTask} from "../controllers/tasks/index";
import { completeCooldown } from "../controllers/tasks/cooldownComplete";

const router = Router();

router.post("/", createTask);

// Tasks of specific day
router.get("/:user_id/day", getTasksByDate);
router.get("/:user_id/month", getTaskCountsByMonth);
router.post("/:task_id/event", recordTaskEvent);
router.delete("/:task_id", deleteTask);

router.post("/start", startOnDemandTask);
router.post("/:task_id/cooldown-complete", completeCooldown);
router.put("/:task_id", updateTask);



export default router;
