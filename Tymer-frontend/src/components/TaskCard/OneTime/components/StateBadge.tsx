interface Props {
  state: string;
}

export const StateBadge = ({ state }: Props) => {
  const styles: Record<string, string> = {
    upcoming: "bg-slate-500 text-white",
    pending: "bg-zinc-100 text-black",
    active: "bg-blue-500 text-white",
    "action-required": "bg-rose-500 text-white",
    completed: "bg-emerald-500 text-white",
    missed: "bg-red-500 text-white",
  };

  const labels: Record<string, string> = {
    upcoming: "Upcoming",
    pending: "Pending",
    active: "Active",
    "action-required": "Action Required",
    completed: "Completed",
    missed: "Missed",
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-6 py-2 rounded-[20px] text-base font-normal mt-6 ${styles[state]}`}
    >
      {labels[state]}
    </span>
  );
};
