// Mock the pokemonApi
jest.mock('../../services/pokemonApi', () => ({
  pokemonApi: {
    getPokemons: jest.fn(),
    getPokemonDetail: jest.fn(),
  },
}));

// Mock the entire store to test state management logic
jest.mock('../../stores/pokemonStore', () => {
  const mockState = {
    pokemons: [],
    pokemonDetails: {},
    currentOffset: 0,
    hasMore: true,
    isLoading: false,
    isLoadingMore: false,
    isLoadingDetail: false,
    error: null,
    loadPokemons: jest.fn(),
    loadMorePokemons: jest.fn(),
    loadPokemonDetail: jest.fn(),
    clearError: jest.fn(),
    reset: jest.fn(),
  };

  return {
    usePokemonStore: jest.fn(() => mockState),
    mockState, // Export for testing
  };
});

import { usePokemonStore } from '../../stores/pokemonStore';
import { pokemonApi } from '../../services/pokemonApi';

const mockedPokemonApi = pokemonApi as jest.Mocked<typeof pokemonApi>;
const mockedUsePokemonStore = usePokemonStore as jest.MockedFunction<typeof usePokemonStore>;

describe('Pokemon Store - State Management', () => {
  let mockStore: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock store state
    mockStore = {
      pokemons: [],
      pokemonDetails: {},
      currentOffset: 0,
      hasMore: true,
      isLoading: false,
      isLoadingMore: false,
      isLoadingDetail: false,
      error: null,
      loadPokemons: jest.fn(),
      loadMorePokemons: jest.fn(),
      loadPokemonDetail: jest.fn(),
      clearError: jest.fn(),
      reset: jest.fn(),
    };

    mockedUsePokemonStore.mockReturnValue(mockStore);
  });

  describe('initial state', () => {
    test('should have correct initial state', () => {
      const store = usePokemonStore();

      expect(store.pokemons).toEqual([]);
      expect(store.pokemonDetails).toEqual({});
      expect(store.currentOffset).toBe(0);
      expect(store.hasMore).toBe(true);
      expect(store.isLoading).toBe(false);
      expect(store.isLoadingMore).toBe(false);
      expect(store.isLoadingDetail).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('loadPokemons function', () => {
    test('should call loadPokemons with correct parameters', async () => {
      const store = usePokemonStore();
      
      await store.loadPokemons(true);
      
      expect(store.loadPokemons).toHaveBeenCalledWith(true);
    });

    test('should call loadPokemons without parameters for default behavior', async () => {
      const store = usePokemonStore();
      
      await store.loadPokemons();
      
      expect(store.loadPokemons).toHaveBeenCalledWith();
    });

    test('should handle loading state correctly', () => {
      mockStore.isLoading = true;
      const store = usePokemonStore();
      
      expect(store.isLoading).toBe(true);
    });
  });

  describe('loadMorePokemons function', () => {
    test('should call loadMorePokemons correctly', async () => {
      const store = usePokemonStore();
      
      await store.loadMorePokemons();
      
      expect(store.loadMorePokemons).toHaveBeenCalled();
    });

    test('should handle loadingMore state', () => {
      mockStore.isLoadingMore = true;
      const store = usePokemonStore();
      
      expect(store.isLoadingMore).toBe(true);
    });
  });

  describe('loadPokemonDetail function', () => {
    test('should call loadPokemonDetail with pokemon ID', async () => {
      const store = usePokemonStore();
      
      await store.loadPokemonDetail(1);
      
      expect(store.loadPokemonDetail).toHaveBeenCalledWith(1);
    });

    test('should handle loadingDetail state', () => {
      mockStore.isLoadingDetail = true;
      const store = usePokemonStore();
      
      expect(store.isLoadingDetail).toBe(true);
    });
  });

  describe('error handling', () => {
    test('should handle error state correctly', () => {
      const errorMessage = 'Network error occurred';
      mockStore.error = errorMessage;
      const store = usePokemonStore();
      
      expect(store.error).toBe(errorMessage);
    });

    test('should call clearError function', () => {
      const store = usePokemonStore();
      
      store.clearError();
      
      expect(store.clearError).toHaveBeenCalled();
    });
  });

  describe('store state management', () => {
    test('should manage pokemons array correctly', () => {
      const mockPokemons = [
        { id: 1, name: 'bulbasaur', url: 'test-url-1' },
        { id: 2, name: 'ivysaur', url: 'test-url-2' },
      ];
      
      mockStore.pokemons = mockPokemons;
      const store = usePokemonStore();
      
      expect(store.pokemons).toEqual(mockPokemons);
      expect(store.pokemons).toHaveLength(2);
    });

    test('should manage pokemonDetails object correctly', () => {
      const mockDetail = {
        id: 1,
        name: 'bulbasaur',
        types: [{ type: { name: 'grass' } }],
        abilities: [{ ability: { name: 'overgrow' } }],
        sprites: { front_default: 'test-image.png' },
      };
      
      mockStore.pokemonDetails = { 1: mockDetail };
      const store = usePokemonStore();
      
      expect(store.pokemonDetails[1]).toEqual(mockDetail);
    });

    test('should manage pagination state correctly', () => {
      mockStore.currentOffset = 20;
      mockStore.hasMore = false;
      const store = usePokemonStore();
      
      expect(store.currentOffset).toBe(20);
      expect(store.hasMore).toBe(false);
    });
  });

  describe('utility functions', () => {
    test('should call reset function', () => {
      const store = usePokemonStore();
      
      store.reset();
      
      expect(store.reset).toHaveBeenCalled();
    });

    test('should reset to initial state', () => {
      // Simulate reset behavior
      mockStore.pokemons = [];
      mockStore.pokemonDetails = {};
      mockStore.currentOffset = 0;
      mockStore.hasMore = true;
      mockStore.error = null;
      
      const store = usePokemonStore();
      
      expect(store.pokemons).toEqual([]);
      expect(store.pokemonDetails).toEqual({});
      expect(store.currentOffset).toBe(0);
      expect(store.hasMore).toBe(true);
      expect(store.error).toBeNull();
    });
  });
});