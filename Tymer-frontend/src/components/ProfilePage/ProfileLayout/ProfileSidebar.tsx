

type Props = {
  activeTab: "profile" | "calendar";
  onTabChange: (tab: "profile" | "calendar") => void;
};

export default function ProfileSidebar({ activeTab, onTabChange }: Props) {
  return (
    <div className="w-[220px] border-r p-6 space-y-4">
      <h2 className="text-xl font-semibold mb-6">Settings</h2>

      <button
        onClick={() => onTabChange("profile")}
        className={`w-full text-left px-4 py-2 rounded-lg border ${
          activeTab === "profile"
            ? "bg-blue-500 text-white"
            : "hover:bg-gray-100"
        }`}
      >

  
        Profile
      </button>

      <button
        onClick={() => onTabChange("calendar")}
        className={`w-full text-left px-4 py-2 rounded-lg border ${
          activeTab === "calendar"
            ? "bg-blue-500 text-white"
            : "hover:bg-gray-100"
        }`}
      >
      Google Calendar
      </button>
    </div>
  );
}
