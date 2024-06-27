import { create } from "zustand";

interface User {
  id: number;
  email: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

interface WalletAddressState {
  walletAddress: string | null,
  setWalletAddress: (walletAddr: string | null) => void
}

export const useWalletStore = create<WalletAddressState>((set) => ({
  walletAddress: null as string| null,
  setWalletAddress: (walletAddr: string| null) => set({ walletAddress:walletAddr }),
}));

export const useUserStore = create<UserState>((set) => ({
  user: null as User | null,
  setUser: (user: User | null) => set({ user }),
}));
