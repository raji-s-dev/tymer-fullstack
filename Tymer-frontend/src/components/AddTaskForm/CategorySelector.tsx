type Props = {
  value: string;
  onChange: (v: "ondemand" | "scheduled" | "countup" | "") => void;
};

export default function CategorySelector({ value, onChange }: Props) {
  return (
    <div>
      
       <label htmlFor="category-select" className="text-sm font-medium text-gray-700 mb-1 block">Category</label>

      <select
        id="category-select"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value as any)}
      >
        <option value="">-- Select --</option>
        <option value="scheduled">Scheduled</option>
        <option value="ondemand">On-Demand</option>
        <option value="countup">Countup</option>
      </select>
    </div>
  );
}
