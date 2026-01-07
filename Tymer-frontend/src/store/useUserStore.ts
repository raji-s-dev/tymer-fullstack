import { create } from "zustand";
import { getProfile } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  // add more fields if your backend returns more
}

interface UserState {
  user: User | null;
  userId: string | null;
  loadProfile: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  userId: null,

  loadProfile: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const user = await getProfile(token); // ✅ use service API
      set({ user, userId: user.id });
    } catch (err) {
      set({ user: null, userId: null });
    }
  },
}));
