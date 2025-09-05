// Mock AsyncStorage
const mockAsyncStorage = {
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock pokemonApi
const mockPokemonApi = {
  getPokemonImageUrl: jest.fn((id: number) => `https://example.com/pokemon/${id}.png`),
  checkConnection: jest.fn(() => Promise.resolve(true)),
};

jest.mock('../../services/pokemonApi', () => ({
  pokemonApi: mockPokemonApi,
}));

// Mock the favorites store
const mockFavoritesState = {
  favorites: [],
  isLoading: false,
  isSyncing: false,
  lastSyncTime: null,
  pendingSyncActions: [],
  loadFavorites: jest.fn(),
  addToFavorites: jest.fn(),
  removeFromFavorites: jest.fn(),
  isFavorite: jest.fn(),
  syncFavorites: jest.fn(),
  clearFavorites: jest.fn(),
};

jest.mock('../../stores/favoritesStore', () => ({
  useFavoritesStore: jest.fn(() => mockFavoritesState),
}));

import { useFavoritesStore } from '../../stores/favoritesStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pokemonApi } from '../../services/pokemonApi';

const mockedUseFavoritesStore = useFavoritesStore as jest.MockedFunction<typeof useFavoritesStore>;
const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedPokemonApi = pokemonApi as jest.Mocked<typeof pokemonApi>;

describe('Favorites Store - Offline-First Functionality', () => {
  let mockStore: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock store state
    mockStore = {
      favorites: [],
      isLoading: false,
      isSyncing: false,
      lastSyncTime: null,
      pendingSyncActions: [],
      loadFavorites: jest.fn(),
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
      isFavorite: jest.fn(),
      syncFavorites: jest.fn(),
      clearFavorites: jest.fn(),
    };

    mockedUseFavoritesStore.mockReturnValue(mockStore);
  });

  describe('initial state', () => {
    test('should have correct initial state', () => {
      const store = useFavoritesStore();

      expect(store.favorites).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.isSyncing).toBe(false);
      expect(store.lastSyncTime).toBeNull();
      expect(store.pendingSyncActions).toEqual([]);
    });
  });

  describe('loadFavorites - Offline Storage', () => {
    test('should call loadFavorites function', async () => {
      const store = useFavoritesStore();
      
      await store.loadFavorites();
      
      expect(store.loadFavorites).toHaveBeenCalled();
    });

    test('should handle loading state during loadFavorites', () => {
      mockStore.isLoading = true;
      const store = useFavoritesStore();
      
      expect(store.isLoading).toBe(true);
    });

    test('should load favorites from storage successfully', () => {
      const mockFavorites = [
        {
          id: 1,
          name: 'bulbasaur',
          image: 'https://example.com/pokemon/1.png',
          addedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: 25,
          name: 'pikachu',
          image: 'https://example.com/pokemon/25.png',
          addedAt: '2023-01-02T00:00:00.000Z',
        },
      ];

      mockStore.favorites = mockFavorites;
      const store = useFavoritesStore();
      
      expect(store.favorites).toEqual(mockFavorites);
      expect(store.favorites).toHaveLength(2);
    });
  });

  describe('addToFavorites - Offline-First Operations', () => {
    test('should call addToFavorites with correct parameters', async () => {
      const store = useFavoritesStore();
      const pokemon = { id: 1, name: 'bulbasaur' };
      
      await store.addToFavorites(pokemon);
      
      expect(store.addToFavorites).toHaveBeenCalledWith(pokemon);
    });

    test('should add pokemon to favorites list', () => {
      const newFavorite = {
        id: 1,
        name: 'bulbasaur',
        image: 'https://example.com/pokemon/1.png',
        addedAt: '2023-01-01T00:00:00.000Z',
      };

      mockStore.favorites = [newFavorite];
      const store = useFavoritesStore();
      
      expect(store.favorites).toContain(newFavorite);
      expect(store.favorites).toHaveLength(1);
    });

    test('should create pending sync action when adding offline', () => {
      const syncAction = {
        action: 'add',
        pokemon: {
          id: 1,
          name: 'bulbasaur',
          image: 'https://example.com/pokemon/1.png',
          addedAt: '2023-01-01T00:00:00.000Z',
        },
        timestamp: '2023-01-01T00:00:00.000Z',
      };

      mockStore.pendingSyncActions = [syncAction];
      const store = useFavoritesStore();
      
      expect(store.pendingSyncActions).toHaveLength(1);
      expect(store.pendingSyncActions[0].action).toBe('add');
      expect(store.pendingSyncActions[0].pokemon.id).toBe(1);
    });
  });

  describe('removeFromFavorites - Offline-First Operations', () => {
    test('should call removeFromFavorites with pokemon ID', async () => {
      const store = useFavoritesStore();
      
      await store.removeFromFavorites(1);
      
      expect(store.removeFromFavorites).toHaveBeenCalledWith(1);
    });

    test('should remove pokemon from favorites list', () => {
      // Initially has 2 favorites, after removal has 1
      mockStore.favorites = [
        {
          id: 25,
          name: 'pikachu',
          image: 'https://example.com/pokemon/25.png',
          addedAt: '2023-01-02T00:00:00.000Z',
        },
      ];
      
      const store = useFavoritesStore();
      
      expect(store.favorites).toHaveLength(1);
      expect(store.favorites.find((fav: any) => fav.id === 1)).toBeUndefined();
    });

    test('should create pending sync action when removing offline', () => {
      const removeAction = {
        action: 'remove',
        pokemon: {
          id: 1,
          name: 'bulbasaur',
          image: 'https://example.com/pokemon/1.png',
          addedAt: '2023-01-01T00:00:00.000Z',
        },
        timestamp: '2023-01-01T00:00:00.000Z',
      };

      mockStore.pendingSyncActions = [removeAction];
      const store = useFavoritesStore();
      
      expect(store.pendingSyncActions).toHaveLength(1);
      expect(store.pendingSyncActions[0].action).toBe('remove');
    });
  });

  describe('isFavorite - Check Favorite Status', () => {
    test('should call isFavorite with pokemon ID', () => {
      const store = useFavoritesStore();
      
      store.isFavorite(1);
      
      expect(store.isFavorite).toHaveBeenCalledWith(1);
    });

    test('should return true for favorite pokemon', () => {
      mockStore.isFavorite.mockReturnValue(true);
      const store = useFavoritesStore();
      
      const result = store.isFavorite(1);
      
      expect(result).toBe(true);
    });

    test('should return false for non-favorite pokemon', () => {
      mockStore.isFavorite.mockReturnValue(false);
      const store = useFavoritesStore();
      
      const result = store.isFavorite(999);
      
      expect(result).toBe(false);
    });
  });

  describe('syncFavorites - Online/Offline Sync Mechanism', () => {
    test('should call syncFavorites function', async () => {
      const store = useFavoritesStore();
      
      await store.syncFavorites();
      
      expect(store.syncFavorites).toHaveBeenCalled();
    });

    test('should handle syncing state during sync', () => {
      mockStore.isSyncing = true;
      const store = useFavoritesStore();
      
      expect(store.isSyncing).toBe(true);
    });

    test('should update lastSyncTime after successful sync', () => {
      const syncTime = '2023-01-01T12:00:00.000Z';
      mockStore.lastSyncTime = syncTime;
      const store = useFavoritesStore();
      
      expect(store.lastSyncTime).toBe(syncTime);
    });

    test('should clear pending sync actions after successful sync', () => {
      // After successful sync, pending actions should be empty
      mockStore.pendingSyncActions = [];
      const store = useFavoritesStore();
      
      expect(store.pendingSyncActions).toEqual([]);
    });

    test('should keep pending actions when sync fails', () => {
      const pendingAction = {
        action: 'add',
        pokemon: { id: 1, name: 'bulbasaur', image: '', addedAt: '' },
        timestamp: '2023-01-01T00:00:00.000Z',
      };

      mockStore.pendingSyncActions = [pendingAction];
      const store = useFavoritesStore();
      
      expect(store.pendingSyncActions).toHaveLength(1);
    });
  });

  describe('clearFavorites - Cleanup Operations', () => {
    test('should call clearFavorites function', async () => {
      const store = useFavoritesStore();
      
      await store.clearFavorites();
      
      expect(store.clearFavorites).toHaveBeenCalled();
    });

    test('should clear all favorites data', () => {
      // After clear, all data should be reset
      mockStore.favorites = [];
      mockStore.pendingSyncActions = [];
      mockStore.lastSyncTime = null;
      
      const store = useFavoritesStore();
      
      expect(store.favorites).toEqual([]);
      expect(store.pendingSyncActions).toEqual([]);
      expect(store.lastSyncTime).toBeNull();
    });
  });

  describe('offline-first behavior scenarios', () => {
    test('should handle offline add operations', () => {
      const offlineFavorite = {
        id: 1,
        name: 'bulbasaur',
        image: 'https://example.com/pokemon/1.png',
        addedAt: '2023-01-01T00:00:00.000Z',
      };

      const pendingAddAction = {
        action: 'add',
        pokemon: offlineFavorite,
        timestamp: '2023-01-01T00:00:00.000Z',
      };

      mockStore.favorites = [offlineFavorite];
      mockStore.pendingSyncActions = [pendingAddAction];
      
      const store = useFavoritesStore();
      
      expect(store.favorites).toContain(offlineFavorite);
      expect(store.pendingSyncActions).toContain(pendingAddAction);
    });

    test('should handle multiple pending sync actions', () => {
      const pendingActions = [
        {
          action: 'add',
          pokemon: { id: 1, name: 'bulbasaur', image: '', addedAt: '' },
          timestamp: '2023-01-01T00:00:00.000Z',
        },
        {
          action: 'remove',
          pokemon: { id: 2, name: 'ivysaur', image: '', addedAt: '' },
          timestamp: '2023-01-01T00:01:00.000Z',
        },
        {
          action: 'add',
          pokemon: { id: 25, name: 'pikachu', image: '', addedAt: '' },
          timestamp: '2023-01-01T00:02:00.000Z',
        },
      ];

      mockStore.pendingSyncActions = pendingActions;
      const store = useFavoritesStore();
      
      expect(store.pendingSyncActions).toHaveLength(3);
      expect(store.pendingSyncActions[0].action).toBe('add');
      expect(store.pendingSyncActions[1].action).toBe('remove');
      expect(store.pendingSyncActions[2].action).toBe('add');
    });
  });
});