interface Props {
  activeTab: "scheduled" | "ondemand" | "countup";
  setActiveTab: (tab: "scheduled" | "ondemand" | "countup") => void;
}

export default function TasksTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="h-12 flex border-t">

      {/* Scheduled */}
      <button
        className={`w-52 h-12 flex items-center justify-center text-base font-normal font-poppins text-black 
          border-r border-b
          ${activeTab === "scheduled" ? "bg-sky-100" : "bg-white"}
        `}
        onClick={() => setActiveTab("scheduled")}
      >
        Scheduled Tasks
      </button>

      {/* On-Demand */}
      <button
        className={`w-52 h-12 flex items-center justify-center text-base font-normal font-poppins text-black
          border-r border-b
          ${activeTab === "ondemand" ? "bg-sky-100" : "bg-white"}
        `}
        onClick={() => setActiveTab("ondemand")}
      >
        On-Demand Tasks
      </button>

      {/* Count-up */}
      <button
        className={`w-52 h-12 flex items-center justify-center text-base font-normal font-poppins text-black border-r border-b
          ${activeTab === "countup" ? "bg-sky-100" : "bg-white"}
        `}
        onClick={() => setActiveTab("countup")}
      >
        Countup Tasks
      </button>

    </div>
  );
}
