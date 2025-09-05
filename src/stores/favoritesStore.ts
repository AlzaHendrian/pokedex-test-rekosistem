import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoritePokemon } from '../types/pokemon';
import { pokemonApi } from '../services/pokemonApi';

interface FavoritesState {
  // Data
  favorites: FavoritePokemon[];
  
  // Loading states
  isLoading: boolean;
  isSyncing: boolean;
  
  // Sync states
  lastSyncTime: string | null;
  pendingSyncActions: Array<{
    action: 'add' | 'remove';
    pokemon: FavoritePokemon;
    timestamp: string;
  }>;
  
  // Actions
  loadFavorites: () => Promise<void>;
  addToFavorites: (pokemon: { id: number; name: string }) => Promise<void>;
  removeFromFavorites: (pokemonId: number) => Promise<void>;
  isFavorite: (pokemonId: number) => boolean;
  syncFavorites: () => Promise<void>;
  clearFavorites: () => Promise<void>;
}

const FAVORITES_STORAGE_KEY = '@pokedex_favorites';
const SYNC_ACTIONS_STORAGE_KEY = '@pokedex_sync_actions';
const LAST_SYNC_STORAGE_KEY = '@pokedex_last_sync';

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  // Initial state
  favorites: [],
  isLoading: false,
  isSyncing: false,
  lastSyncTime: null,
  pendingSyncActions: [],

  // Load favorites from AsyncStorage
  loadFavorites: async () => {
    set({ isLoading: true });

    try {
      const [favoritesJson, syncActionsJson, lastSyncTime] = await Promise.all([
        AsyncStorage.getItem(FAVORITES_STORAGE_KEY),
        AsyncStorage.getItem(SYNC_ACTIONS_STORAGE_KEY),
        AsyncStorage.getItem(LAST_SYNC_STORAGE_KEY),
      ]);

      const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      const pendingSyncActions = syncActionsJson ? JSON.parse(syncActionsJson) : [];

      set({
        favorites,
        pendingSyncActions,
        lastSyncTime,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load favorites:', error);
      set({ isLoading: false });
    }
  },

  // Add pokemon to favorites
  addToFavorites: async (pokemon: { id: number; name: string }) => {
    const { favorites } = get();
    
    // Check if already in favorites
    if (favorites.some(fav => fav.id === pokemon.id)) return;

    const newFavorite: FavoritePokemon = {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemonApi.getPokemonImageUrl(pokemon.id),
      addedAt: new Date().toISOString(),
    };

    const updatedFavorites = [...favorites, newFavorite];

    try {
      // Update state immediately (optimistic update)
      set({ favorites: updatedFavorites });

      // Save to AsyncStorage
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));

      // Add to sync queue for later synchronization with server (if needed)
      const syncAction = {
        action: 'add' as const,
        pokemon: newFavorite,
        timestamp: new Date().toISOString(),
      };

      const updatedSyncActions = [...get().pendingSyncActions, syncAction];
      set({ pendingSyncActions: updatedSyncActions });
      
      await AsyncStorage.setItem(SYNC_ACTIONS_STORAGE_KEY, JSON.stringify(updatedSyncActions));
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      // Rollback optimistic update
      set({ favorites });
    }
  },

  // Remove pokemon from favorites
  removeFromFavorites: async (pokemonId: number) => {
    const { favorites } = get();
    const pokemonToRemove = favorites.find(fav => fav.id === pokemonId);
    
    if (!pokemonToRemove) return;

    const updatedFavorites = favorites.filter(fav => fav.id !== pokemonId);

    try {
      // Update state immediately (optimistic update)
      set({ favorites: updatedFavorites });

      // Save to AsyncStorage
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));

      // Add to sync queue
      const syncAction = {
        action: 'remove' as const,
        pokemon: pokemonToRemove,
        timestamp: new Date().toISOString(),
      };

      const updatedSyncActions = [...get().pendingSyncActions, syncAction];
      set({ pendingSyncActions: updatedSyncActions });
      
      await AsyncStorage.setItem(SYNC_ACTIONS_STORAGE_KEY, JSON.stringify(updatedSyncActions));
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      // Rollback optimistic update
      set({ favorites });
    }
  },

  // Check if pokemon is favorite
  isFavorite: (pokemonId: number) => {
    return get().favorites.some(fav => fav.id === pokemonId);
  },

  // Sync favorites with server when back online
  syncFavorites: async () => {
    const { pendingSyncActions, isSyncing } = get();
    
    if (isSyncing || pendingSyncActions.length === 0) return;

    set({ isSyncing: true });

    try {
      // Check if online
      const isOnline = await pokemonApi.checkConnection();
      
      if (!isOnline) {
        set({ isSyncing: false });
        return;
      }

      // Process sync actions (in a real app, this would sync with your backend)
      // For now, we just clear the pending actions since we don't have a backend
      console.log('Syncing favorites...', pendingSyncActions);

      // Clear pending sync actions
      set({ 
        pendingSyncActions: [],
        lastSyncTime: new Date().toISOString(),
        isSyncing: false,
      });

      await Promise.all([
        AsyncStorage.setItem(SYNC_ACTIONS_STORAGE_KEY, JSON.stringify([])),
        AsyncStorage.setItem(LAST_SYNC_STORAGE_KEY, new Date().toISOString()),
      ]);

      console.log('Favorites synced successfully');
    } catch (error) {
      console.error('Failed to sync favorites:', error);
      set({ isSyncing: false });
    }
  },

  // Clear all favorites
  clearFavorites: async () => {
    try {
      set({ favorites: [], pendingSyncActions: [] });
      await Promise.all([
        AsyncStorage.removeItem(FAVORITES_STORAGE_KEY),
        AsyncStorage.removeItem(SYNC_ACTIONS_STORAGE_KEY),
        AsyncStorage.removeItem(LAST_SYNC_STORAGE_KEY),
      ]);
    } catch (error) {
      console.error('Failed to clear favorites:', error);
    }
  },
}));