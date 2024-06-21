import { create } from "zustand";

interface User {
  id: number;
  email: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null as User | null,
  setUser: (user: User | null) => set({ user }),
}));
