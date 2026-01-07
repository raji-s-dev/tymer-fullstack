import { useState } from "react";

type Props = {
  value: { startDate: string; startTime: string; endTime: string };
  onChange: (v: any) => void;
};

export default function EditOneTimeFields({ value, onChange }: Props) {
  const [duration, setDuration] = useState<number | "">("");

  function timeToMin(t: string) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  function minToTime(min: number) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  const handleDuration = (val: string) => {
    if (!value.startTime) return;
    if (val === "") {
      setDuration("");
      return;
    }

    const mins = Number(val);
    setDuration(mins);

    const newEnd = minToTime(timeToMin(value.startTime) + mins);
    onChange({ ...value, endTime: newEnd });
  };

  return (
    <div className="section">
      <h3 className="text-lg font-semibold mb-3">Scheduled Task</h3>

      <label className="block text-sm">Start Date</label>
      <input
        placeholder="start date"
        type="date"
        className="input mb-3"
        value={value.startDate}
        onChange={(e) =>
          onChange({ ...value, startDate: e.target.value })
        }
      />

      <label className="block text-sm">Start Time</label>
      <input
      placeholder="start time"
        type="time"
        className="input mb-3"
        value={value.startTime}
        onChange={(e) =>
          onChange({ ...value, startTime: e.target.value })
        }
      />

      <label className="block text-sm">Duration (minutes)</label>
      <input
      placeholder="duration"
        type="number"
        className="input mb-3 w-32"
        value={duration}
        onChange={(e) => handleDuration(e.target.value)}
      />

      <label className="block text-sm">End Time</label>
      <input
      placeholder="end time"
        type="time"
        className="input"
        value={value.endTime}
        onChange={(e) =>
          onChange({ ...value, endTime: e.target.value })
        }
      />
    </div>
  );
}
