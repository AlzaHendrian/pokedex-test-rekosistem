import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PokemonListScreen } from '../screens/PokemonListScreen';
import { PokemonDetailScreen } from '../screens/PokemonDetailScreen';

export type RootStackParamList = {
  PokemonList: undefined;
  PokemonDetail: {
    pokemonId: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PokemonList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3b82f6',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="PokemonList"
          component={PokemonListScreen}
          options={{
            title: 'Pokédex',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="PokemonDetail"
          component={PokemonDetailScreen}
          options={({ route }) => ({
            title: 'Pokémon Detail',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};