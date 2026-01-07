import { useState } from "react";
import TasksTabs from "../../components/Tabs/TasksTabs";
import Timeline from "../../components/Timeline/Timeline";
import OnDemandList from "../../components/OnDemand/OnDemandList";
import CompletedPanel from "../../components/completedpanel/CompletedPanel";
import { useDateStore } from "../../store/useDateStore";
import { useRef } from "react";
import Countuptask from "../../components/countuptask/Countuptask";
import { useTasksStore } from "../../store/useTasksStore";
import dayjs from "dayjs";
import { useOutletContext } from "react-router-dom";
import filterIcon from "../../assets/dashboardheader/filter icon.png";
import addIcon from "../../assets/dashboardheader/add icon.png";



export default function Dashboard() {
 const selectedDate = useDateStore((s) => s.selectedDate);
   const { onAddTask, isFullscreen } = useOutletContext<{
  onAddTask: () => void;
  isFullscreen: boolean;
}>();
  const { tasks, taskCounts } = useTasksStore();

  
 

const dateKey = selectedDate.format("YYYY-MM-DD");
const totalTasks = taskCounts[dateKey] ?? 0;

  // ▶ Completed count for this day
const completedTasks = tasks.filter((t) => 
  t.type === "scheduled" &&        // only scheduled tasks
  t.history?.some(
    (h) =>
      h.type === "completed" &&
      dayjs(h.timestamp).isSame(selectedDate, "day")
  )
).length;

  // 🔥 Main control for center container
  const [activeTab, setActiveTab] = useState<
  "scheduled" | "ondemand" | "countup"
>("scheduled");



  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-full w-full">

{/* CENTER CONTENT */}
<div className="flex-1 flex flex-col h-full bg-white">

  {/* Fixed Header + Tabs */}
  <div className="sticky top-0 z-10 bg-white border-b">
    {/* Header Section */}
    <div className="h-24 px-7 flex items-center justify-between">
      <div>
        <h2 className="text-base font-normal font-poppins text-black">
          {selectedDate.format("DD MMMM, dddd")}
        </h2>
        <p className="text-base font-normal font-poppins text-black mt-1">
  {totalTasks === 0
    ? "No tasks available"
    : `${completedTasks} / ${totalTasks} completed`}
</p>
      </div>

<div className="flex items-center gap-4">

  {/* ✅ FILTER */}
  <button
  type="button"
    onClick={() => alert("This feature is not coded yet.")}
    className="w-28 h-10 rounded-[10px] border border-black/50 flex items-center justify-center gap-2 font-poppins text-base text-zinc-950"
  >
    <span>Filter</span>
    <img src={filterIcon} className="w-3.5 h-3" alt="filter" />
  </button>

  {/* ✅ ADD TASK */}
  <button
  type="button"
    onClick={onAddTask}
    className="w-36 h-10 bg-[#1E90FF] rounded-[10px] flex items-center justify-center gap-2 font-poppins text-base text-white"
  >
    <span>Add Task</span>
    <img src={addIcon} className="w-3 h-3" alt="add" />
  </button>

</div>

    </div>

    <TasksTabs activeTab={activeTab} setActiveTab={setActiveTab} />
  </div>

  {/* Scrollable Timeline / OnDemand */}
<div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar">
  {activeTab === "scheduled" &&  <Timeline scrollContainerRef={scrollRef} active={activeTab === "scheduled"} />}
  {activeTab === "ondemand" && <OnDemandList />}

  {activeTab === "countup" && <Countuptask />}
</div>

</div>


      {/* RIGHT PANEL */}
{/* RIGHT PANEL — hide in fullscreen */}
<div
  className={`
    relative
    bg-white
    border-l
    overflow-hidden
    transition-all
    duration-300
    ease-in-out
    ${
      isFullscreen
        ? "w-0 translate-x-full opacity-0"
        : "w-[300px] translate-x-0 opacity-100"
    }
  `}
>
  <CompletedPanel />
</div>

    </div>
  );
}
