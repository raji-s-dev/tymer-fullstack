type Props = {
  value: {
    durationValue: number;
    durationUnit: string;
    cooldownValue: number;
    cooldownUnit: string;
  };
  onChange: (v: any) => void;
};

export default function EditOnDemandFields({ value, onChange }: Props) {
  return (
    <div className="section">
      <h3 className="text-lg font-semibold mb-3">On-Demand Task</h3>

      <label className="block text-sm mb-1">Duration</label>
      <div className="flex gap-3 mb-4">
        <input
          min={0} 
        aria-label="durationvalue"
          type="number"
          className="input w-32"
          value={value.durationValue}
          onChange={(e) =>
            onChange({ ...value, durationValue: Number(e.target.value) })
          }
        />
        <select
        aria-label="durationunit"
          className="input w-40"
          value={value.durationUnit}
          onChange={(e) =>
           onChange({
  ...value,
  durationValue: Math.max(0, Number(e.target.value)),
})
          }
        >
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
        </select>
      </div>

      <label className="block text-sm mb-1">Cooldown</label>
      <div className="flex gap-3">
        <input
         min={0} 
        aria-label="cooldownvalue"
          type="number"
          className="input w-32"
          value={value.cooldownValue}
          onChange={(e) =>
             onChange({
  ...value,
  cooldownValue: Math.max(0, Number(e.target.value)),
})
          }
        />
        <select
        aria-label="cooldownunit"
          className="input w-40"
          value={value.cooldownUnit}
          onChange={(e) =>
            onChange({ ...value, cooldownUnit: e.target.value })
          }
        >
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="months">Months</option>
        </select>
      </div>
    </div>
  );
}
