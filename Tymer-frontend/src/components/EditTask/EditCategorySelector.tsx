type Props = {
  value: string;
  onChange: (v: "ondemand" | "scheduled" | "countup") => void;
};

export default function EditCategorySelector({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm mb-1">Category</label>

      <select
       aria-label="category"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value as any)}
      >
        <option value="scheduled">Scheduled</option>
        <option value="ondemand">On-Demand</option>
        <option value="countup">Countup</option>
      </select>
    </div>
  );
}
