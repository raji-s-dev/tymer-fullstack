import { useEffect, useState } from "react";

// ✅ IMPORT YOUR ASSETS HERE
import logo from "../../assets/navbar/logo.png";
import addIcon from "../../assets/navbar/add icon.png";
import notificationIcon from "../../assets/navbar/notification icon.png";


import settings from "../../assets/navbar/settings.png";
import fullscreenon from "../../assets/navbar/fullscreenon.png"
import fullscreenoff from "../../assets/navbar/fullscreenoff.png"

interface NavbarProps {
  onAddTask: () => void;
  onOpenProfile: () => void;
    isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export default function Navbar({
  onAddTask,
  onOpenProfile,
  isFullscreen,
  onToggleFullscreen,
}: NavbarProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  // ✅ LIVE TIME & DATE FUNCTION
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const formattedTime = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const formattedDate = now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      setTime(formattedTime);
      setDate(formattedDate);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="w-full h-20 bg-white flex items-center justify-between px-[50px] border-b">

      {/* ✅ LEFT LOGO */}
      <div className="flex items-center">
        <img src={logo} alt="Tymer Logo" className="h-8 object-contain" />
      </div>

      {/* ✅ RIGHT CONTROLS */}
      <div className="flex items-center gap-6">

        {/* ✅ ADD TASK BUTTON */}
        <button
          onClick={onAddTask}
          className="w-36 h-10 bg-[#1E90FF] text-white rounded-[10px] flex items-center justify-center gap-2 font-poppins text-base hover:bg-[#1878d8] transition-all duration-200 ease-in-out hover:scale-[1.02]"
        >
          <span>Add Task</span>
          <img src={addIcon} alt="add" className="w-3 h-3" />
        </button> 

        {/* ✅ ICON BUTTONS */}
        <div className="flex items-center gap-4">

{/* ✅ NOTIFICATION */}
<div
  className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center cursor-pointer hover:ring-1 hover:ring-blue-500 transition-all"
  onClick={() => alert("This feature is not coded yet")}
>
  <img src={notificationIcon} alt="notification" className="w-4 h-4" />
</div>

{/* ✅ THEME
<div
  className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center cursor-pointer hover:ring-1 hover:ring-blue-500 transition-all"
  onClick={() => alert("This feature is not coded yet")}
>
  <img src={themeIcon} alt="theme" className="w-4 h-4" />
</div>
 */}
{/* ✅ FULLSCREEN TOGGLE */}
<div
  onClick={onToggleFullscreen}
  className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center cursor-pointer hover:ring-1 hover:ring-blue-500 transition-all"
>
  <img
    src={isFullscreen ? fullscreenon : fullscreenoff}
    alt="fullscreen"
    className="w-4 h-4"
  />
</div>

          {/* ✅ PROFILE */}
          <div
            onClick={onOpenProfile}
            className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center cursor-pointer hover:ring-1 hover:ring-blue-500 transition-all"
          >
            <img src={settings} alt="profile" className="w-5 h-5" />
          </div>
        </div>

        {/* ✅ TIME & DATE */}
        <div className="text-right font-poppins text-black font-normal leading-6">
          <div>{time}</div>
          <div>{date}</div>
        </div>

      </div>
    </nav>
  );
}
