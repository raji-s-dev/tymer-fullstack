import { useParams, useNavigate } from "react-router-dom";
import { useTasksStore } from "../../store/useTasksStore";
import { useEffect, useState } from "react";
import {
  getComputedState,
  getRemainingTimeMs,
  formatMs,
} from "../TaskCard/OneTime/utils/timeUtils";

import { recordTaskEvent } from "../../services/taskapi";
import { StateBadge } from "../TaskCard/OneTime/components/StateBadge";
import { ConfirmPopup } from "../TaskCard/OneTime/components/ConfirmPopup";
import logo from "../../assets/navbar/logo.png";
import fullscreen from "../../assets/taskcard/exitscreen.png";
import compelte from "../../assets/taskcard/complete.png";
import resume from "../../assets/taskcard/resume.png";
import pause from "../../assets/taskcard/pause.png";

export default function FullScreenOneTimeTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const task = useTasksStore((s) => s.tasks.find((t) => t.id === id));
  if (!task) return <div className="p-10 text-center">Task not found</div>;

  const [isPaused, setIsPaused] = useState(false);
  const [pausedRemainingMs, setPausedRemainingMs] = useState<number | null>(
    null
  );
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  const [adjustedEnd, setAdjustedEnd] = useState<number | null>(null);

  const [mode, setMode] = useState<"default" | "sec" | "min" | "hour">(
    "default"
  );

  const convertMode = (ms: number) => {
    if (mode === "sec") return `${Math.floor(ms / 1000)} sec`;
    if (mode === "min") return `${Math.ceil(ms / 60000)} min`;
    if (mode === "hour") return `${Math.ceil(ms / 3600000)} hr`;
    return formatMs(ms);
  };

  const [showPopup, setShowPopup] =
    useState<null | "completed" | "missed">(null);

  const handleConfirm = async () => {
    if (!showPopup) return;
    await recordTaskEvent(task.id, showPopup);
    navigate(-1);
  };

  const handlePauseResume = () => {
    if (!isPaused) {
      const remaining = adjustedEnd
        ? Math.max(adjustedEnd - Date.now(), 0)
        : getRemainingTimeMs(task);
      setPausedRemainingMs(remaining);
      setPausedAt(Date.now());
      setIsPaused(true);
      return;
    }

    const pausedDuration = Date.now() - pausedAt!;
    const baseEnd = adjustedEnd ?? new Date(task.endTime!).getTime();
    setAdjustedEnd(baseEnd + pausedDuration);
    setPausedAt(null);
    setIsPaused(false);
  };

  const [_tick, setTick] = useState(Date.now());
  useEffect(() => {
    if (isPaused) return;
    const i = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(i);
  }, [isPaused]);

  const state = isPaused ? "active" : getComputedState(task);

  const remainingMs = isPaused
    ? pausedRemainingMs!
    : adjustedEnd
    ? Math.max(adjustedEnd - Date.now(), 0)
    : getRemainingTimeMs(task);


  const canShowHours = remainingMs >= 3600000;  // 1 hour
  const canShowMinutes = remainingMs >= 60000;  // 1 minute
  const canShowSeconds = remainingMs >= 1000;   // 1 second  

  return (
  <div className="w-full h-screen bg-white relative overflow-hidden">

    {/* ✅ LOGO */}
    <div className="absolute left-[50px] top-[50px]">
     <img src={logo} alt="Tymer Logo" className="h-8 object-contain" />
    </div>

    {/* ✅ TOP RIGHT TAGS */}
    <div className="absolute right-[60px] top-[36px] flex flex-col items-end gap-0">
      <div className="w-36 h-9 bg-purple-500 rounded-[10px] flex items-center justify-center">
        <span className="text-white text-sm font-normal">{task.type}</span>
      </div>

      <div >
        <StateBadge state={state} />
      </div>
    </div>

    {/* ✅ TITLE */}
    <div className="absolute left-1/2 -translate-x-1/2 top-[149px] text-gray-900 text-lg font-medium">
      {task.title}
    </div>

    {/* ✅ DESCRIPTION */}
    <div className="absolute left-1/2 -translate-x-1/2 top-[192px] w-[320px] text-justify text-gray-600 text-base font-normal leading-5">
      {task.description}
    </div>

    {/* ✅ TIME REMAINING LABEL */}
    <div className="absolute left-1/2 -translate-x-1/2 top-[310px] text-black text-base font-medium">
      Time Remaining
    </div>

    {/* ✅ TIMER */}
    <div className="absolute left-1/2 -translate-x-1/2 top-[350px] text-blue-500 text-[120px] font-medium leading-none font-poppins">
      {convertMode(remainingMs)}
    </div>

    {/* ✅ MODE BUTTONS */}
    {state === "active" && (
      <div className="absolute left-1/2 -translate-x-1/2 top-[550px] flex gap-6">
<button
  disabled={!canShowSeconds}
  onClick={() => canShowSeconds && setMode("sec")}
  className={`w-28 h-12 rounded-[40px] flex items-center justify-center text-black text-base font-medium 
    ${canShowSeconds ? "bg-emerald-200" : "bg-gray-300 opacity-50 cursor-not-allowed"}`}
>
  Seconds
</button>

<button
  disabled={!canShowMinutes}
  onClick={() => canShowMinutes && setMode("min")}
  className={`w-28 h-12 rounded-[40px] flex items-center justify-center text-black text-base font-medium 
    ${canShowMinutes ? "bg-blue-300" : "bg-gray-300 opacity-50 cursor-not-allowed"}`}
>
  Minutes
</button>

<button
  disabled={!canShowHours}
  onClick={() => canShowHours && setMode("hour")}
  className={`w-28 h-12 rounded-[40px] flex items-center justify-center text-black text-base font-medium 
    ${canShowHours ? "bg-violet-300" : "bg-gray-300 opacity-50 cursor-not-allowed"}`}
>
  Hours
</button>

        <button
          onClick={() => setMode("default")}
          className="w-28 h-12 bg-orange-200 rounded-[40px] flex items-center justify-center text-black text-base font-medium"
        >
          Default
        </button>
      </div>
    )}

    {/* ✅ ACTION BUTTONS */}
    <div className="absolute left-1/2 -translate-x-1/2 top-[620px] flex gap-6">

      {/* PAUSE */}
      <button
        onClick={handlePauseResume}
        className="w-32 h-12 bg-yellow-500 rounded-[40px] flex items-center justify-center gap-2 text-white text-base font-medium"
      >
        {isPaused ? "Resume" : "Pause"}
        <img src={isPaused ? resume : pause} className="w-3 h-3" alt={isPaused ? "resume" : "pause"} />
      </button>

      {/* COMPLETE */}
      <button
        onClick={() => setShowPopup("completed")}
        className="w-36 h-12 bg-green-600 rounded-[40px] flex items-center justify-center gap-2 text-white text-base font-medium"
      >
        Complete
        <img src={compelte} className="w-4 h-4" alt="complete" />
      </button>

    </div>

    {/* ✅ EXIT FULL SCREEN */}
    <button
      onClick={() => navigate(-1)}
      className="absolute right-[60px] bottom-[60px] "
    >
      <img src={fullscreen} alt="Exit Fullscreen" className="w-8 h-8" />
    </button>

    {/* ✅ POPUP (UNCHANGED) */}
    {showPopup && (
      <ConfirmPopup
        message={
          showPopup === "completed"
            ? "Mark task as completed?"
            : "Mark task as missed?"
        }
        onCancel={() => setShowPopup(null)}
        onConfirm={handleConfirm}
      />
    )}
  </div>
);

}
