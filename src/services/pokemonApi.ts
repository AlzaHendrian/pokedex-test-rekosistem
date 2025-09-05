import axios from 'axios';
import { Pokemon, PokemonDetail, PokemonListResponse } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Add retry logic for failed requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || !config.retry) {
      config.retry = 0;
    }
    
    if (config.retry < 3) {
      config.retry += 1;
      console.log(`Retrying request... Attempt ${config.retry}`);
      return api(config);
    }
    
    return Promise.reject(error);
  }
);

export const pokemonApi = {
  // Get list of pokemon with pagination
  getPokemons: async (limit: number = 20, offset: number = 0): Promise<PokemonListResponse> => {
    try {
      const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
      
      // Add ID to each pokemon from URL
      const pokemonsWithId = response.data.results.map((pokemon: Pokemon) => {
        const id = parseInt(pokemon.url.split('/').slice(-2, -1)[0]);
        return { ...pokemon, id };
      });
      
      return {
        ...response.data,
        results: pokemonsWithId,
      };
    } catch (error) {
      console.error('Error fetching pokemon list:', error);
      throw error;
    }
  },

  // Get pokemon details
  getPokemonDetail: async (id: number): Promise<PokemonDetail> => {
    try {
      const response = await api.get(`/pokemon/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pokemon detail for ID ${id}:`, error);
      throw error;
    }
  },

  // Get pokemon image URL
  getPokemonImageUrl: (id: number): string => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  },

  // Check if API is reachable (for online/offline detection)
  checkConnection: async (): Promise<boolean> => {
    try {
      await api.get('/pokemon/1');
      return true;
    } catch (error) {
      return false;
    }
  },
};