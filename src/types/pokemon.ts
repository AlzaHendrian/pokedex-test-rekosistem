export interface Pokemon {
  id: number;
  name: string;
  url: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  sprites: {
    front_default: string;
  };
}

export interface PokemonListResponse {
  results: Pokemon[];
  next: string | null;
  previous: string | null;
}

export interface FavoritePokemon {
  id: number;
  name: string;
  image: string;
  addedAt: string;
}