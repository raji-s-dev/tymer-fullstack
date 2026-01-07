import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Task } from "../../../store/useTasksStore";

import { ConfirmPopup } from "../OneTime/components/ConfirmPopup";
import { StateBadge } from "../OneTime/components/StateBadge";
import deleteicon from "../../../assets/taskcard/delete.png";
import fullscreen from "../../../assets/taskcard/fullscreen.png";
import compelte from "../../../assets/taskcard/complete.png";
import missed from "../../../assets/taskcard/missed.png";
import resume from "../../../assets/taskcard/resume.png";
import pause from "../../../assets/taskcard/pause.png";

import {
  recordTaskEvent,
  deleteTask,
} from "../../../services/taskapi";

import {
  getComputedState,
  getRemainingTimeMs,
  formatMs,
  formatTimeRange,
} from "../OneTime/utils/timeUtils";

import { useUserStore } from "../../../store/useUserStore";
import { useDateStore } from "../../../store/useDateStore";
import { useTasksStore } from "../../../store/useTasksStore";

interface Props {
  task: Task;
  onComplete: (id: string) => void;
  onMissed: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function OnDemandTaskCardState({
  task,
  onComplete,
  onMissed,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  const TypeColors = {
    scheduled: "bg-purple-500 text-white",
    ondemand: "bg-green-500 text-white",
    ondemandinstance: "bg-[#2DD4BF] text-white",
    countup: "bg-red-500 text-white",
  };

  const TypeLabels = {
    scheduled: "Scheduled Task",
    ondemand: "On-demand Task",
    ondemandinstance: "On-demand ",
    countup: "Count-up Task",
  };

  const userId = useUserStore((s) => s.userId);
  const selectedDate = useDateStore((s) => s.selectedDate);
  const loadTasks = useTasksStore((s) => s.loadTasks);

  const [isPaused, setIsPaused] = useState(false);
  const [pausedRemainingMs, setPausedRemainingMs] = useState<number | null>(null);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  const [adjustedEnd, setAdjustedEnd] = useState<number | null>(null);

  const [showPopup, setShowPopup] =
    useState<null | "completed" | "missed" | "delete">(null);

  const handleConfirm = async () => {
    if (!showPopup) return;

    if (showPopup === "delete") {
      await deleteTask(task.id);
      await loadTasks(userId!, selectedDate.format("YYYY-MM-DD"));
      onDelete(task.id);
      setShowPopup(null);
      return;
    }

    if (task.type === "ondemandinstance") {
      await recordTaskEvent(task.id, showPopup, task.id);
    } else {
      await recordTaskEvent(task.id, showPopup);
    }

    if (showPopup === "completed") onComplete(task.id);
    if (showPopup === "missed") onMissed(task.id);

    await loadTasks(userId!, selectedDate.format("YYYY-MM-DD"));
    setShowPopup(null);
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
    const newEnd = baseEnd + pausedDuration;

    setAdjustedEnd(newEnd);
    setPausedAt(null);
    setIsPaused(false);
  };

  const [_tick, setTick] = useState(Date.now());

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

const computedState = getComputedState(task);
const state = isPaused ? "active" : computedState;

  const remainingMs = isPaused
    ? pausedRemainingMs!
    : adjustedEnd
    ? Math.max(adjustedEnd - Date.now(), 0)
    : getRemainingTimeMs(task);

  // --------- Time Text Split (same as ScheduledCard) ----------
  const parts = formatTimeRange(task.startTime!, task.endTime!).split(" ");
  const startTime = parts[0];
  const startPeriod = parts[1];
  const endTime = parts[3];
  const endPeriod = parts[4];

  return (
    <div
      className={`relative w-[621px] ${
        state === "active" || state === "action-required"
          ? "h-[460px] shadow-[0px_0px_4px_0px_rgba(30,144,255,1)]"
          : "h-96 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)]"
      } bg-white rounded-[20px] outline outline-1 outline-gray-200 p-[48px]`}
    >
      {/* POPUP */}
      {showPopup && (
        <ConfirmPopup
          message={
            showPopup === "completed"
              ? "Did you complete this task?"
              : showPopup === "missed"
              ? "Did you miss this task?"
              : "Are you sure you want to delete this task permanently?"
          }
          onConfirm={handleConfirm}
          onCancel={() => setShowPopup(null)}
        />
      )}

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-medium text-gray-900">{task.title}</h2>

        <div
          className={`${TypeColors[task.type]} text-sm px-6 py-2 rounded-[10px] font-normal font-poppins`}
        >
          {TypeLabels[task.type]}
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-6 text-gray-600 text-base leading-5 w-[320px] text-justify">
        {task.description}
      </p>

      {/* STATE BADGE */}
      <StateBadge state={state} />

      {/* UPCOMING / PENDING / COMPLETED / MISSED */}
      {(state === "upcoming" ||
        state === "pending" ||
        state === "completed" ||
        state === "missed") && (
        <>
          <p className="mt-6 text-black text-base font-medium">
            Start time - End time
          </p>

          <div className="flex items-end gap-2 mt-2">
            <span className="text-5xl font-medium text-black">{startTime}</span>
            <span className="text-3xl font-medium">{startPeriod}</span>

            <span className="text-5xl mx-4">-</span>

            <span className="text-5xl font-medium text-black">{endTime}</span>
            <span className="text-3xl font-medium">{endPeriod}</span>
          </div>
        </>
      )}

      {/* ACTIVE */}
      {state === "active" && (
        <>
          <p className="mt-6 text-black text-base font-medium">
            Time Remaining:
          </p>

          <p className="text-blue-500 text-5xl font-medium mt-2">
            {formatMs(remainingMs)}
          </p>

          <div className="flex gap-6 mt-10">
            <button
              onClick={() => setShowPopup("completed")}
              className="bg-green-600 text-white w-36 h-12 rounded-[40px] flex items-center justify-center gap-2"
            >
              Complete <img src={compelte} className="w-4 h-4" alt="complete" />
            </button>

            <button
              onClick={handlePauseResume}
              className="bg-yellow-500 text-white w-32 h-12 rounded-[40px] flex items-center justify-center gap-2"
            >
              {isPaused ? "Resume" : "Pause"}
              <img src={isPaused ? resume : pause} className="w-4 h-4" alt={isPaused ? "resume" : "pause"} />
            </button>
          </div>
        </>
      )}

      {/* ACTION REQUIRED */}
      {state === "action-required" && (
        <>
          <p className="mt-6 text-black text-base font-medium">
            Time Remaining:
          </p>

          <p className="text-blue-500 text-5xl font-medium mt-2">00m 00s</p>

          <div className="flex gap-6 mt-10">
            <button
              onClick={() => setShowPopup("completed")}
              className="bg-green-600 text-white w-36 h-12 rounded-[40px] flex items-center justify-center gap-2"
            >
              Complete <img src={compelte} className="w-4 h-4" alt="complete" />
            </button>

            <button
              onClick={() => setShowPopup("missed")}
              className="bg-red-600 text-white w-32 h-12 rounded-[40px] flex items-center justify-center gap-2"
            >
              Missed <img src={missed} className="w-3 h-3" alt="missed"/>
            </button>
          </div>
        </>
      )}

      {/* TOP RIGHT ICONS — ONLY DELETE */}
      <div className="absolute right-10 top-24 flex flex-col gap-4">
        <div
          onClick={() => setShowPopup("delete")}
          className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center cursor-pointer"
        >
          <img src={deleteicon} className="w-4 h-4" alt="delete" />
        </div>
      </div>

      {/* FULLSCREEN */}
      {state === "active" && (
        <img
        alt="fullscreen"
          onClick={() => navigate(`/task/${task.id}`)}
          src={fullscreen}
          className="absolute bottom-16 right-12 w-6 h-6 cursor-pointer"
        />
      )}
    </div>
  );
}
