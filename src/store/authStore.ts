import { create } from 'zustand';
import type { AuthState, User } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  verificationId: null,

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false
    });
  },

  setVerificationId: (id: string | null) => {
    set({ verificationId: id });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      verificationId: null
    });
  },
}));
