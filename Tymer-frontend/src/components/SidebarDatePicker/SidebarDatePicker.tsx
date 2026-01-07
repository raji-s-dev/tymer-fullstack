import { useRef, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useUserStore } from "../../store/useUserStore";

import Header from "./components/Header";
import DateList from "./components/DateList";
import MonthNavigation from "./components/MonthNavigation";
import FooterJumpButton from "./components/FooterJumpButton";

import { useTasksStore } from "../../store/useTasksStore";
import { useDateStore } from "../../store/useDateStore";

interface SidebarDatePickerProps {
  onDateChanged?: (date: string) => void;
}

export default function SidebarDatePicker({ onDateChanged }: SidebarDatePickerProps) {
  const userId = useUserStore((s) => s.userId);
  const { tasks, taskCounts, loadTasks, loadTaskCounts } = useTasksStore();
  

  const setSelectedDateGlobal = useDateStore((s) => s.setSelectedDate);


  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const dateRefs = useRef<(HTMLDivElement | null)[]>([]);

    // -----------------------------
  // Load task counts when month or user changes
  // -----------------------------
  useEffect(() => {
    if (!userId) return;
    const monthStr = currentMonth.format("YYYY-MM");
    loadTaskCounts(userId, monthStr);
  }, [currentMonth, userId, loadTaskCounts,tasks]);


  // Load tasks when date or user changes
  useEffect(() => {
    if (!userId) return;
    const dateStr = selectedDate.format("YYYY-MM-DD");
    loadTasks(userId, dateStr);
  }, [selectedDate, userId, loadTasks]);



  // -----------------------------
  // Generate dates array for current month
  // -----------------------------
  const daysInMonth = currentMonth.daysInMonth();
  const datesArray = [...Array(daysInMonth)].map((_, i) => {
    const fullDate = currentMonth.date(i + 1).format("YYYY-MM-DD");
    return {
      number: i + 1,
      fullDate,
      taskCount: taskCounts[fullDate] ?? 0, // always show 0 if no task
    };
  });

  // Handle date selection
  const handleDateSelect = (date: string, index: number) => {
    const d = dayjs(date);
    setSelectedDate(d);
    setSelectedDateGlobal(d);
    onDateChanged?.(date);

    dateRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    if (!userId) return;
    loadTasks(userId, date);
  };

  // Navigate months
  const handlePrevMonth = () => setCurrentMonth((prev) => prev.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth((prev) => prev.add(1, "month"));

  // Jump to today
  const jumpToToday = () => {
    const today = dayjs();
    setCurrentMonth(today);
    setSelectedDate(today);
    setSelectedDateGlobal(today);

    setTimeout(() => {
      const idx = today.date() - 1;
      dateRefs.current[idx]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);
  };

  // Handle date picked from input header
  const handleDateSelected = (fullDate: string) => {
    const d = dayjs(fullDate);
    setCurrentMonth(d);
    setSelectedDate(d);
    setSelectedDateGlobal(d);

    const idx = d.date() - 1;
    setTimeout(() => {
      dateRefs.current[idx]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  };

  // Scroll to selected date on mount or when datesArray changes
useEffect(() => {
  const idx = selectedDate.date() - 1; // index in the current month
  if (dateRefs.current[idx]) {
    dateRefs.current[idx]?.scrollIntoView({
      behavior: "smooth",
      block: "center", // center vertically
    });
  }
}, [datesArray, selectedDate]); // run when month changes or selectedDate changes

  return (
    <div className=" h-full flex flex-col bg-white rounded-tr-[10px]  ">
      <Header currentMonth={currentMonth} onDatePicked={handleDateSelected} />

      <div className="flex-1 overflow-y-auto no-scrollbar ">
        <DateList
          datesArray={datesArray}
          selectedDate={selectedDate}
          onSelect={handleDateSelect}
          dateRefs={dateRefs}
        />
      </div>

      <MonthNavigation onPrev={handlePrevMonth} onNext={handleNextMonth} />
      <FooterJumpButton onClick={jumpToToday} />
    </div>
  );
}
