import { useState } from "react";
import CategorySelector from "./CategorySelector";
import OnDemandFields from "./OnDemandFields";
import OneTimeFields from "./OneTimeFields";
import CountupFields from "./CountupFields";
import { useUserStore } from "../../store/useUserStore";
import personvideo from '../../assets/taskform/person.mp4';
import { useTasksStore } from "../../store/useTasksStore";
import { useDateStore } from "../../store/useDateStore";
import { useEffect } from "react";
import { createTask } from "../../services/taskapi";

type Props = {
  onClose: () => void;
  prefillTask?: {
    title: string;
    description?: string;
    startAt: number;
    endAt: number;
  } | null;
};

export default function AddTaskForm({ onClose, prefillTask }: Props) {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;


  const loadTasks = useTasksStore((s) => s.loadTasks);
const selectedDate = useDateStore((s) => s.selectedDate);
  // BASIC STATES
  const [taskName, setTaskName] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [category, setCategory] = useState<
    "" | "ondemand" | "scheduled" | "countup"
  >("");

  const userId = useUserStore((s) => s.userId);

  // FIELD STATES
  const [onDemandData, setOnDemandData] = useState({
    durationValue: 0,
    durationUnit: "minutes",
    cooldownValue: 0,
    cooldownUnit: "minutes",
  });

  const [oneTimeData, setOneTimeData] = useState({
    startDate: "",
    startTime: "",
    endTime: "",
  });

  const [countupData, setCountupData] = useState({
    completedDate: "",
    completedTime: "",
  });

  // VALIDATION
  const [formErrors, setFormErrors] = useState({
    taskName: "",
    taskDetails: "",
    category: "",
    oneTime: "",
  });

  const validate = () => {
    const errors: any = {};

    if (!taskName.trim()) errors.taskName = "Task name is required";
    if (!taskDetails.trim()) errors.taskDetails = "Task details are required";
    if (!category) errors.category = "Select a category";

if (category === "scheduled") {
  const { startDate, startTime, endTime } = oneTimeData;

  // 1. All fields required
  if (!startDate || !startTime || !endTime) {
    errors.oneTime = "Fill all scheduled task fields";
  } else {
    // 2. Convert to minutes
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;

    // 3. Validate: start < end
    if (startMins === endMins) {
      errors.oneTime = "Start time and end time cannot be the same";
    } else if (endMins < startMins) {
      errors.oneTime = "End time must be later than start time";
    }
  }
}



    if (category === "countup") {
      if (!countupData.completedDate || !countupData.completedTime)
        errors.oneTime = "Fill all countup fields";
    }

      // NEW VALIDATION FOR ONDEMAND
  if (category === "ondemand") {
    if (onDemandData.durationValue < 1)
      errors.oneTime = "Duration must be at least 1 minute";

    if (onDemandData.cooldownValue < 1)
      errors.oneTime = "Cooldown must be at least 1 minute";
  }


    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload: any = {
      user_id: userId,
      task_name: taskName,
      task_details: taskDetails,
      category,
    };

    if (category === "ondemand") payload.ondemand_metadata = onDemandData;
    if (category === "scheduled") payload.one_time_metadata = oneTimeData;
    if (category === "countup") payload.countup_metadata = countupData;

  try {
    await createTask(payload);  // ✅ use service function
    if (userId && selectedDate) {
      loadTasks(userId, selectedDate.format("YYYY-MM-DD"));
    }
    onClose();
  } catch (err) {
    console.error("Task creation failed:", err);
  }

    onClose();
  };

  useEffect(() => {
  if (!prefillTask) return;

  setTaskName(prefillTask.title);
  setTaskDetails((prefillTask.description || "").slice(0, 100));
  setCategory("scheduled");

  const start = new Date(prefillTask.startAt - IST_OFFSET_MS);
  const end = new Date(prefillTask.endAt - IST_OFFSET_MS);

  const toDate = (d: Date) => d.toISOString().split("T")[0];
  const toTime = (d: Date) =>
    `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;

  setOneTimeData({
    startDate: toDate(start),
    startTime: toTime(start),
    endTime: toTime(end),
  });
}, [prefillTask]);

  // RENDER UI
  return (
  <div className="flex w-full h-full   bg-white rounded-2xl   overflow-hidden">

    {/* LEFT: FORM (60%) */}
    <div className="w-[60%] p-32 overflow-y-auto max-h-[90vh] no-scrollbar">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Add Task</h2>

        <button
          onClick={onClose}
          className="text-sm text-red-500 hover:text-red-600 transition"
        >
          Close
        </button>
      </div>

      {/* FORM BOX */}
      <div className="space-y-6">

        {/* Task Name */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Task Name</label>
          <input
            className={`w-full px-4 py-2 bg-gray-50 rounded-xl border outline-none focus:ring-2 focus:ring-blue-400 transition ${
              formErrors.taskName ? "border-red-500" : "border-gray-300"
            }`}
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task name"
          />
          {formErrors.taskName && (
            <p className="text-red-500 text-xs mt-1">{formErrors.taskName}</p>
          )}
        </div>

        {/* Task Details */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Task Description
          </label>

          <textarea
            className={`w-full p-3 resize-none h-20 bg-gray-50 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none transition ${
              formErrors.taskDetails ? "border-red-500" : "border-gray-300"
            }`}
            value={taskDetails}
            onChange={(e) => setTaskDetails(e.target.value)}
            placeholder="Enter task details"
            maxLength={100}
          />

          {/* Character counter */}
          <p className="text-xs text-gray-400 text-right mt-1">
            {taskDetails.length} / 100
          </p>

          {formErrors.taskDetails && (
            <p className="text-red-500 text-xs mt-1">{formErrors.taskDetails}</p>
          )}
        </div>

        {/* Category */}
        <CategorySelector value={category} onChange={setCategory} />
        {formErrors.category && (
          <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>
        )}
      </div>

      {/* CONDITIONAL FIELDS */}
      <div className="mt-6">
        {category === "ondemand" && (
          <OnDemandFields value={onDemandData} onChange={setOnDemandData} />
        )}
        {category === "scheduled" && (
          <OneTimeFields value={oneTimeData} onChange={setOneTimeData} />
        )}
        {category === "countup" && (
          <CountupFields value={countupData} onChange={setCountupData} />
        )}
      </div>

      {/* SUBMIT BUTTON */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-sm transition active:scale-[0.98]"
        >
          Add Task
        </button>
      </div>
    </div>

    {/* RIGHT: VIDEO (40%) */}
    <div className="w-[40%] bg-white">
      <video
        src={personvideo}
        autoPlay
        loop
        muted
        playsInline
        className=" p-6 w-full h-full translate-x-[-20px]"
      />
    </div>
  </div>
);

}
