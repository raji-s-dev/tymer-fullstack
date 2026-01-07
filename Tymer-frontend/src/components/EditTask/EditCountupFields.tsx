type Props = {
  value: { completedDate: string; completedTime: string };
  onChange: (v: any) => void;
};

export default function EditCountupFields({ value, onChange }: Props) {
  return (
    <div className="section">
      <h3 className="text-lg font-semibold mb-3">Countup Task</h3>

      <label className="block text-sm">Completed Date</label>
      <input
        placeholder="completed date"
        type="date"
        className="input mb-3"
        value={value.completedDate}
        onChange={(e) =>
          onChange({ ...value, completedDate: e.target.value })
        }
      />

      <label className="block text-sm">Completed Time</label>
      <input
        placeholder="completed time"
        type="time"
        className="input"
        value={value.completedTime}
        onChange={(e) =>
          onChange({ ...value, completedTime: e.target.value })
        }
      />
    </div>
  );
}
