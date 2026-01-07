import { create } from "zustand";
import dayjs, { Dayjs } from "dayjs";

interface DateStore {
  selectedDate: Dayjs;
  setSelectedDate: (d: Dayjs) => void;
}

export const useDateStore = create<DateStore>((set) => ({
  selectedDate: dayjs(),              // default today
  setSelectedDate: (d) => set({ selectedDate: d }),
}));
