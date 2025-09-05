import { create } from 'zustand';
import { pokemonApi } from '../services/pokemonApi';

interface NetworkState {
  // Connection state
  isOnline: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  
  // Actions
  checkConnection: () => Promise<void>;
  setOnlineStatus: (isOnline: boolean) => void;
  startPeriodicCheck: () => void;
  stopPeriodicCheck: () => void;
}

let checkInterval: NodeJS.Timeout | null = null;

export const useNetworkStore = create<NetworkState>((set, get) => ({
  // Initial state
  isOnline: true, // Assume online initially
  isChecking: false,
  lastChecked: null,

  // Check internet connection
  checkConnection: async () => {
    const { isChecking } = get();
    if (isChecking) return;

    set({ isChecking: true });

    try {
      const isOnline = await pokemonApi.checkConnection();
      set({
        isOnline,
        isChecking: false,
        lastChecked: new Date(),
      });
    } catch (error) {
      set({
        isOnline: false,
        isChecking: false,
        lastChecked: new Date(),
      });
    }
  },

  // Manually set online status
  setOnlineStatus: (isOnline: boolean) => {
    set({ isOnline, lastChecked: new Date() });
  },

  // Start periodic connection checking
  startPeriodicCheck: () => {
    // Clear existing interval
    if (checkInterval) {
      clearInterval(checkInterval);
    }

    // Check immediately
    get().checkConnection();

    // Check every 30 seconds
    checkInterval = setInterval(() => {
      get().checkConnection();
    }, 30000);
  },

  // Stop periodic checking
  stopPeriodicCheck: () => {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  },
}));