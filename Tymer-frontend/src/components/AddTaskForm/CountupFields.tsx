type Props = {
  value: { completedDate: string; completedTime: string };
  onChange: (v: any) => void;
};

export default function CountupFields({ value, onChange }: Props) {
  return (
    <div className="mt-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Countup Task
      </h3>

      {/* Completed Date */}
      <div className="mb-4">
        <label className="text-sm block mb-1 text-gray-700">
          Completed Date
        </label>
        <input
        title="completed date"
          type="date"
          className="input"
          value={value.completedDate}
          onChange={(e) =>
            onChange({ ...value, completedDate: e.target.value })
          }
        />
      </div>

      {/* Completed Time */}
      <div>
        <label className="text-sm block mb-1 text-gray-700">
          Completed Time
        </label>
        <input
        title="completed time"
          type="time"
          className="input"
          value={value.completedTime}
          onChange={(e) =>
            onChange({ ...value, completedTime: e.target.value })
          }
        />
      </div>
    </div>
  );
}
