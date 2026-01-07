import { useEffect, useState } from "react";
import { useUserStore } from "../../../store/useUserStore";
import ProfileSidebar from "./ProfileSidebar";
import ProfileDetails from "../ProfileContent/ProfileDetails";
import GoogleCalendarSection from "../ProfileContent/GoogleCalendarSection";

type Props = {
  onClose: () => void;
  onImportTask: (task: {
    title: string;
    description?: string;
    startAt: number;
    endAt: number;
  }) => void;
};



export default function ProfilePage({ onClose, onImportTask }: Props) {
  const { loadProfile } = useUserStore();
  const [activeTab, setActiveTab] = useState<"profile" | "calendar">("profile");

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    // 👇 NORMAL CONTAINER — NOT FIXED
    <div className="w-full h-full flex bg-white ">
      
      {/* Left Navigation */}
      <ProfileSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Right Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <button
          onClick={onClose}
          className="mb-4 text-sm text-red-500 hover:underline"
        >
          Close
        </button>

        {activeTab === "profile" && <ProfileDetails />}
        {activeTab === "calendar" && <GoogleCalendarSection onImportTask={onImportTask} />}
      </div>
    </div>
  );
}
