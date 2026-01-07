import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import SidebarDatePicker from "../components/SidebarDatePicker/SidebarDatePicker";
import AddTaskForm from "../components/AddTaskForm/AddTaskForm";
import ProfilePage from "../components/ProfilePage/ProfileLayout/ProfilePage";

type ImportedCalendarTask = {
  title: string;
  description?: string;
  startAt: number;
  endAt: number;
};

export default function DashboardLayout() {

    const [showAddTask, setShowAddTask] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

const [isFullscreen, setIsFullscreen] = useState(false);
const [prefillTask, setPrefillTask] = useState<ImportedCalendarTask | null>(null);


 
  return (
    <div className="w-full h-screen flex flex-col">

      <Navbar
        onAddTask={() => {
          setShowProfile(false);
          setShowAddTask(true);
        }}
        onOpenProfile={() => {
          setShowAddTask(false);
          setShowProfile(true);
        }}

        isFullscreen={isFullscreen}
  onToggleFullscreen={() => setIsFullscreen(prev => !prev)}
      />

      {/* SHOW ADD TASK FORM */}
{showAddTask ? (
  <div className="flex-1 overflow-y-auto bg-gray-50">
    <AddTaskForm
      onClose={() => {
        setShowAddTask(false);
        setPrefillTask(null);
      }}
      prefillTask={prefillTask}
    />
  </div>
) : null}

      {/* SHOW PROFILE PAGE */}
{showProfile ? (
  <div className="flex-1 overflow-y-auto bg-gray-50">
    <ProfilePage
      onClose={() => setShowProfile(false)}
      onImportTask={(task) => {
        setPrefillTask(task);
        setShowProfile(false);
        setShowAddTask(true);
      }}
    />
  </div>
) : null}
      {/* SHOW DASHBOARD DEFAULT PAGE */}
{!showAddTask && !showProfile && (
  <div className="flex flex-1 overflow-hidden">

    {/* SIDEBAR — hide in fullscreen */}
<div
  className={`
    relative
    bg-white
    border-r
    overflow-hidden
    transition-all
    duration-300
    ease-in-out
    
    ${
      isFullscreen
        ? "w-0 -translate-x-full opacity-0"
        : "w-[220px] translate-x-0 opacity-100"
        
    }
  `}
>
  <SidebarDatePicker />
</div>

    {/* MAIN CONTENT */}
    <div className="flex-1 overflow-y-auto bg-gray-50">
<Outlet
  context={{
    onAddTask: () => {
      setShowProfile(false);
      setShowAddTask(true);
    },
    isFullscreen,
  }}
/>

    </div>

  </div>
)}


    </div>
  );
}
