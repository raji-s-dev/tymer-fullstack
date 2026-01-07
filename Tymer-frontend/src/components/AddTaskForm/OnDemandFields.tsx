type Props = {
  value: {
    durationValue: number;
    durationUnit: string;
    cooldownValue: number;
    cooldownUnit: string;
  };
  onChange: (v: any) => void;
};

export default function OnDemandFields({ value, onChange }: Props) {
  return (
    <div className="mt-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        On-Demand Task
      </h3>

      {/* Duration */}
      <label className="text-sm font-medium text-gray-700">Duration</label>
      <div className="flex gap-4 mb-6 mt-1">
        <input
        min={0} 
          type="number"
          className="input w-32"
          value={value.durationValue}
          onChange={(e) =>
            onChange({
  ...value,
  durationValue: Math.max(0, Number(e.target.value)),
})
          }
          placeholder="Value"
        />

        <select
        title="durationunit"
          className="input w-44"
          value={value.durationUnit}
          onChange={(e) => onChange({ ...value, durationUnit: e.target.value })}
        >
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
        </select>
      </div>

      {/* Cooldown */}
      <label className="text-sm font-medium text-gray-700">Cooldown</label>
      <div className="flex gap-4 mt-1">
        <input
        min={0} 
          type="number"
          className="input w-32"
          value={value.cooldownValue}
          onChange={(e) =>
            onChange({
  ...value,
  cooldownValue: Math.max(0, Number(e.target.value)),
})
          }
          placeholder="Value"
        />

        <select
        title="cooldownunit"
          className="input w-44"
          value={value.cooldownUnit}
          onChange={(e) =>
            onChange({ ...value, cooldownUnit: e.target.value })
          }
        >
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          
        </select>
      </div>
    </div>
  );
}
