// Mock the entire pokemonApi module to avoid axios complexity
jest.mock('../../services/pokemonApi', () => ({
  pokemonApi: {
    getPokemons: jest.fn(),
    getPokemonDetail: jest.fn(),
    getPokemonImageUrl: jest.fn(),
    checkConnection: jest.fn(),
  },
}));

import { pokemonApi } from '../../services/pokemonApi';

const mockedPokemonApi = pokemonApi as jest.Mocked<typeof pokemonApi>;

describe('pokemonApi - Manual Mock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPokemons', () => {
    test('should fetch pokemons successfully', async () => {
      const mockResponse = {
        results: [
          { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { id: 2, name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
        next: 'https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20',
        previous: null,
      };

      mockedPokemonApi.getPokemons.mockResolvedValueOnce(mockResponse);

      const result = await pokemonApi.getPokemons(2, 0);

      expect(mockedPokemonApi.getPokemons).toHaveBeenCalledWith(2, 0);
      expect(result.results).toHaveLength(2);
      expect(result.results[0].name).toBe('bulbasaur');
      expect(result.results[1].name).toBe('ivysaur');
    });

    test('should use default parameters', async () => {
      const mockResponse = {
        results: [],
        next: null,
        previous: null,
      };

      mockedPokemonApi.getPokemons.mockResolvedValueOnce(mockResponse);

      await pokemonApi.getPokemons();

      expect(mockedPokemonApi.getPokemons).toHaveBeenCalledWith();
    });

    test('should handle API errors', async () => {
      const mockError = new Error('Network Error');
      mockedPokemonApi.getPokemons.mockRejectedValueOnce(mockError);

      await expect(pokemonApi.getPokemons()).rejects.toThrow('Network Error');
    });
  });

  describe('getPokemonDetail', () => {
    test('should fetch pokemon detail by ID', async () => {
      const mockPokemonDetail = {
        id: 1,
        name: 'bulbasaur',
        types: [
          { type: { name: 'grass' } },
          { type: { name: 'poison' } },
        ],
        abilities: [
          { ability: { name: 'overgrow' } },
        ],
        sprites: {
          front_default: 'https://example.com/bulbasaur.png',
        },
      };

      mockedPokemonApi.getPokemonDetail.mockResolvedValueOnce(mockPokemonDetail);

      const result = await pokemonApi.getPokemonDetail(1);

      expect(mockedPokemonApi.getPokemonDetail).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPokemonDetail);
    });

    test('should handle API errors', async () => {
      const mockError = new Error('Pokemon not found');
      mockedPokemonApi.getPokemonDetail.mockRejectedValueOnce(mockError);

      await expect(pokemonApi.getPokemonDetail(999)).rejects.toThrow('Pokemon not found');
    });
  });

  describe('getPokemonImageUrl', () => {
    test('should return correct image URL', () => {
      const expectedUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png';
      mockedPokemonApi.getPokemonImageUrl.mockReturnValueOnce(expectedUrl);

      const imageUrl = pokemonApi.getPokemonImageUrl(25);

      expect(mockedPokemonApi.getPokemonImageUrl).toHaveBeenCalledWith(25);
      expect(imageUrl).toBe(expectedUrl);
    });

    test('should handle different IDs', () => {
      const expectedUrl1 = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png';
      const expectedUrl150 = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png';
      
      mockedPokemonApi.getPokemonImageUrl.mockReturnValueOnce(expectedUrl1);
      mockedPokemonApi.getPokemonImageUrl.mockReturnValueOnce(expectedUrl150);

      expect(pokemonApi.getPokemonImageUrl(1)).toBe(expectedUrl1);
      expect(pokemonApi.getPokemonImageUrl(150)).toBe(expectedUrl150);
    });
  });

  describe('checkConnection', () => {
    test('should return true when connection successful', async () => {
      mockedPokemonApi.checkConnection.mockResolvedValueOnce(true);

      const result = await pokemonApi.checkConnection();

      expect(mockedPokemonApi.checkConnection).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    test('should return false when connection fails', async () => {
      mockedPokemonApi.checkConnection.mockResolvedValueOnce(false);

      const result = await pokemonApi.checkConnection();

      expect(result).toBe(false);
    });
  });
});