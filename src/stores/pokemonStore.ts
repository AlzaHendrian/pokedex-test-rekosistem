import { create } from 'zustand';
import { Pokemon, PokemonDetail } from '../types/pokemon';
import { pokemonApi } from '../services/pokemonApi';

interface PokemonState {
  // Data
  pokemons: Pokemon[];
  pokemonDetails: Record<number, PokemonDetail>;
  
  // Pagination
  currentOffset: number;
  hasMore: boolean;
  
  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  isLoadingDetail: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  loadPokemons: (refresh?: boolean) => Promise<void>;
  loadMorePokemons: () => Promise<void>;
  loadPokemonDetail: (id: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const usePokemonStore = create<PokemonState>((set, get) => ({
  // Initial state
  pokemons: [],
  pokemonDetails: {},
  currentOffset: 0,
  hasMore: true,
  isLoading: false,
  isLoadingMore: false,
  isLoadingDetail: false,
  error: null,

  // Load initial pokemons or refresh
  loadPokemons: async (refresh = false) => {
    const { isLoading, isLoadingMore } = get();
    if (isLoading || isLoadingMore) return;

    set({ isLoading: true, error: null });

    try {
      const offset = refresh ? 0 : get().currentOffset;
      const response = await pokemonApi.getPokemons(20, offset);
      
      set({
        pokemons: refresh ? response.results : [...get().pokemons, ...response.results],
        currentOffset: offset + response.results.length,
        hasMore: response.next !== null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load pokemons',
        isLoading: false,
      });
    }
  },

  // Load more pokemons for pagination
  loadMorePokemons: async () => {
    const { isLoading, isLoadingMore, hasMore } = get();
    if (isLoading || isLoadingMore || !hasMore) return;

    set({ isLoadingMore: true, error: null });

    try {
      const response = await pokemonApi.getPokemons(20, get().currentOffset);
      
      set({
        pokemons: [...get().pokemons, ...response.results],
        currentOffset: get().currentOffset + response.results.length,
        hasMore: response.next !== null,
        isLoadingMore: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load more pokemons',
        isLoadingMore: false,
      });
    }
  },

  // Load pokemon detail
  loadPokemonDetail: async (id: number) => {
    // Check if detail already exists
    if (get().pokemonDetails[id]) return;

    set({ isLoadingDetail: true, error: null });

    try {
      const detail = await pokemonApi.getPokemonDetail(id);
      
      set({
        pokemonDetails: {
          ...get().pokemonDetails,
          [id]: detail,
        },
        isLoadingDetail: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load pokemon detail',
        isLoadingDetail: false,
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    pokemons: [],
    pokemonDetails: {},
    currentOffset: 0,
    hasMore: true,
    isLoading: false,
    isLoadingMore: false,
    isLoadingDetail: false,
    error: null,
  }),
}));