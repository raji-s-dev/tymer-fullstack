import { useEffect, useState } from "react";

type Props = {
  value: {
    startDate: string;
    startTime: string;
    endTime: string;
  };
  onChange: (v: any) => void;
};

/* ------------------ helpers ------------------ */
function getTodayDate() {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

function getCurrentTime() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export default function OneTimeFields({ value, onChange }: Props) {
  const [duration, setDuration] = useState<number | "">("");

  /* ------------------ utils ------------------ */
  function timeToMinutes(t: string) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  function minutesToTime(min: number) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  /* ------------------ set default date & time ------------------ */
  useEffect(() => {
    if (!value.startDate || !value.startTime) {
      onChange({
        ...value,
        startDate: value.startDate || getTodayDate(),
        startTime: value.startTime || getCurrentTime(),
      });
    }
  }, []);

  /* ------------------ handlers ------------------ */
function handleStartTimeChange(startTime: string) {
  let updated = { ...value, startTime };

  if (duration !== "" && startTime) {
    const end = minutesToTime(
      timeToMinutes(startTime) + Number(duration)
    );
    updated.endTime = end;
  }

  onChange(updated);
}

useEffect(() => {
  if (!value.startTime || duration === "") return;

  const end = minutesToTime(
    timeToMinutes(value.startTime) + Number(duration)
  );

  if (end !== value.endTime) {
    onChange({ ...value, endTime: end });
  }
}, [value.startTime, duration]);

useEffect(() => {
  if (!value.startTime || !value.endTime) return;

  const diff =
    timeToMinutes(value.endTime) - timeToMinutes(value.startTime);

  if (diff > 0) {
    setDuration(diff);
  }
}, [value.startTime, value.endTime]);


  function handleDurationChange(minStr: string) {
    if (!value.startTime) return;

    if (minStr === "") {
      setDuration("");
      onChange({ ...value, endTime: "" });
      return;
    }

    const mins = Number(minStr);
    setDuration(mins);

    const startMins = timeToMinutes(value.startTime);
    const end = minutesToTime(startMins + mins);

    onChange({ ...value, endTime: end });
  }

  function handleEndTimeChange(endTime: string) {
    onChange({ ...value, endTime });

    if (value.startTime && endTime) {
      const diff =
        timeToMinutes(endTime) - timeToMinutes(value.startTime);

      setDuration(diff > 0 ? diff : "");
    }
  }

  /* ------------------ UI ------------------ */
  return (
    <div className="mt-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Scheduled Task
      </h3>

      {/* Start Date */}
      <div className="mb-4">
        <label className="text-sm block mb-1 text-gray-700">
          Start Date
        </label>
        <input
        placeholder="date"
          type="date"
          className="input"
          value={value.startDate}
          onChange={(e) =>
            onChange({ ...value, startDate: e.target.value })
          }
        />
      </div>

      {/* Start Time */}
      <div className="mb-4">
        <label className="text-sm block mb-1 text-gray-700">
          Start Time
        </label>
        <input
        placeholder="starttime"
          type="time"
          className="input"
          value={value.startTime}
          onChange={(e) => handleStartTimeChange(e.target.value)}
        />
      </div>

      {/* Duration */}
      <div className="mb-4">
        <label className="text-sm block mb-1 text-gray-700">
          Duration (minutes)
        </label>
        <input
          type="number"
          min={1}
          className="input w-40"
          value={duration}
          onChange={(e) => handleDurationChange(e.target.value)}
          placeholder="30"
        />
      </div>

      {/* End Time */}
      <div className="mb-2">
        <label className="text-sm block mb-1 text-gray-700">
          End Time
        </label>
        <input
        placeholder="time"
          type="time"
          min={value.startTime}
          className="input"
          value={value.endTime}
          onChange={(e) => handleEndTimeChange(e.target.value)}
        />
      </div>
    </div>
  );
}
