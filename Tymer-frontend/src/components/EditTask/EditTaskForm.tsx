import { useState } from "react";
import EditCategorySelector from "./EditCategorySelector";
import EditOnDemandFields from "./EditOnDemandFields";
import EditOneTimeFields from "./EditOneTimeFields";
import EditCountupFields from "./EditCountupFields";
import { editTask } from "../../services/taskapi";
import { Task } from "../../store/useTasksStore";


type Props = {
  task: Task;
  onClose: () => void;
  onUpdated: () => void; // callback to refetch tasks
};

export default function EditTaskForm({ task, onClose, onUpdated }: Props) {
  

  // BASIC STATES
  const [taskName, setTaskName] = useState(task.title);
  const [taskDetails, setTaskDetails] = useState(task.description || "");
  const [category, setCategory] = useState(task.type);

  // FIELD STATES BASED ON CATEGORY
  const [onDemandData, setOnDemandData] = useState({
    durationValue: Number(task.duration || 0),
    durationUnit: "minutes",
    cooldownValue: Number(task.cooldown || 0),
    cooldownUnit: "minutes",
  });

  const [scheduledData, setScheduledData] = useState({
    startDate: task.startTime?.split("T")[0] || "",
    startTime: task.startTime?.split("T")[1]?.slice(0, 5) || "",
    endTime: task.endTime || "",
  });

  const [countupData, setCountupData] = useState({
    completedDate: task.completedDate?.split("T")[0] || "",
    completedTime: task.completedTime || "",
  });

  // SUBMIT
const handleSubmit = async () => {
  const payload: any = {
    task_name: taskName,
    task_details: taskDetails,
    category,
  };

  if (category === "ondemand") payload.ondemand_metadata = onDemandData;
  if (category === "scheduled") payload.one_time_metadata = scheduledData;
  if (category === "countup") payload.countup_metadata = countupData;

  try {
    await editTask(task.id, payload); // 🔥 Clean API call
    onUpdated();                      // 🔥 Ask parent to refetch
    onClose();                        // 🔥 Close form
  } catch (err) {
    console.error(err);
    alert("Failed to update task");
  }
};


  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Edit Task</h2>
        <button onClick={onClose} className="text-red-500 text-sm">
          Close
        </button>
      </div>

      {/* BASIC FIELDS */}
      <div className="space-y-4 border-l-4 border-gray-300 pl-4 mb-6">
        {/* Task Name */}
        <div>
          <label className="block text-sm mb-1">Task Name</label>
          <input
            placeholder="task name"
            className="input"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>

        {/* Task Details */}
{/* Task Details */}
<div>
  <label className="block text-sm mb-1">Task Details</label>
  <textarea
    placeholder="Enter task details"
    maxLength={100}
    className="input resize-none p-2 h-32 w-full border rounded-md border-gray-300"
    value={taskDetails}
    onChange={(e) => setTaskDetails(e.target.value)}
  />
  {/* Live character counter */}
  <p className="text-gray-500 text-xs text-right mt-1">
    {taskDetails.length} / 100
  </p>
</div>


        {/* Category */}
        <EditCategorySelector value={category} onChange={setCategory} />
      </div>

      {/* CONDITIONAL FIELDS */}
      {category === "ondemand" && (
        <EditOnDemandFields value={onDemandData} onChange={setOnDemandData} />
      )}

      {category === "scheduled" && (
        <EditOneTimeFields
          value={scheduledData}
          onChange={setScheduledData}
        />
      )}

      {category === "countup" && (
        <EditCountupFields value={countupData} onChange={setCountupData} />
      )}

      {/* Submit */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
