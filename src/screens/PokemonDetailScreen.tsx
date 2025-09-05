import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Alert, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePokemonStore } from '../stores/pokemonStore';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useNetworkStore } from '../stores/networkStore';
import { pokemonApi } from '../services/pokemonApi';
import { PokemonDetailHeader } from '../components/pokemon/PokemonDetailHeader';
import { TypeBadge } from '../components/pokemon/TypeBadge';
import { AbilityCard } from '../components/pokemon/AbilityCard';
import { StatBar } from '../components/ui/StatBar';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { PokemonInfoCard } from '../components/pokemon/PokemonInfoCard';
import { DetailSkeleton } from '../components/ui/DetailSkeleton';
import { ErrorScreen, NetworkErrorScreen, NotFoundErrorScreen } from '../components/ui/ErrorScreen';

interface PokemonDetailScreenProps {
  route: {
    params: {
      pokemonId: number;
    };
  };
  navigation: any;
}

export const PokemonDetailScreen: React.FC<PokemonDetailScreenProps> = ({ 
  route, 
  navigation 
}) => {
  const { pokemonId } = route.params;
  
  const pokemonStore = usePokemonStore();
  const favoritesStore = useFavoritesStore();
  const networkStore = useNetworkStore();

  const pokemonDetail = pokemonStore.pokemonDetails[pokemonId];
  const isCurrentFavorite = favoritesStore.isFavorite(pokemonId);

  // Animations
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (!pokemonDetail && networkStore.isOnline) {
      pokemonStore.loadPokemonDetail(pokemonId);
    }
  }, [pokemonId, pokemonDetail, networkStore.isOnline]);

  useEffect(() => {
    if (pokemonDetail) {
      navigation.setOptions({
        title: pokemonDetail.name.charAt(0).toUpperCase() + pokemonDetail.name.slice(1),
      });

      // Start animations when data is loaded
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [pokemonDetail, navigation, fadeAnim, slideAnim, scaleAnim]);

  const handleToggleFavorite = async () => {
    if (!pokemonDetail) return;

    try {
      if (isCurrentFavorite) {
        await favoritesStore.removeFromFavorites(pokemonDetail.id);
      } else {
        await favoritesStore.addToFavorites({ 
          id: pokemonDetail.id, 
          name: pokemonDetail.name 
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleRetry = () => {
    pokemonStore.clearError();
    if (networkStore.isOnline) {
      pokemonStore.loadPokemonDetail(pokemonId);
    } else {
      Alert.alert('No Internet Connection', 'Please check your internet connection and try again.');
    }
  };

  const getTypeGradient = (types: any[]) => {
    if (types.length === 0) return '#f1f5f9';
    
    const typeColors: Record<string, string> = {
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      psychic: '#F85888',
      ice: '#98D8D8',
      dragon: '#7038F8',
      dark: '#705848',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
      normal: '#A8A878',
    };
    
    const primaryColor = typeColors[types[0]?.type?.name] || '#68A090';
    return primaryColor + '20';
  };

  const generatePokemonInfo = (pokemon: any) => {
    const aboutContent = `This is ${pokemon.name}, a ${pokemon.types.map(t => t.type.name).join('/')} type Pokémon.${pokemon.types.length > 1 ? ' This dual-type combination makes it unique and versatile in battles.' : ''}`;
    
    const abilitiesContent = `${pokemon.name} possesses ${pokemon.abilities.length} special abilit${pokemon.abilities.length === 1 ? 'y' : 'ies'}: ${pokemon.abilities.map(a => 
      a.ability.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    ).join(', ')}.`;

    return { aboutContent, abilitiesContent };
  };

  if (pokemonStore.isLoadingDetail) {
    return <DetailSkeleton />;
  }

  if (pokemonStore.error && !pokemonDetail) {
    return (
      <ErrorScreen
        title="Failed to load Pokémon"
        message={pokemonStore.error}
        onRetry={handleRetry}
      />
    );
  }

  if (!pokemonDetail && !networkStore.isOnline) {
    return (
      <NetworkErrorScreen
        onRetry={handleRetry}
      />
    );
  }

  if (!pokemonDetail) {
    return (
      <NotFoundErrorScreen
        onGoBack={() => navigation.goBack()}
      />
    );
  }

  const imageUrl = pokemonDetail.sprites?.front_default || pokemonApi.getPokemonImageUrl(pokemonDetail.id);
  const gradientColor = getTypeGradient(pokemonDetail.types);
  const { aboutContent, abilitiesContent } = generatePokemonInfo(pokemonDetail);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <PokemonDetailHeader
          pokemon={pokemonDetail}
          imageUrl={imageUrl}
          isFavorite={isCurrentFavorite}
          onToggleFavorite={handleToggleFavorite}
          gradientColor={gradientColor}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          scaleAnim={scaleAnim}
        />

        <AnimatedSection title="Types" fadeAnim={fadeAnim} slideAnim={slideAnim}>
          <View style={styles.typesContainer}>
            {pokemonDetail.types.map((typeInfo, index) => (
              <TypeBadge key={index} type={typeInfo.type.name} />
            ))}
          </View>
        </AnimatedSection>

        <AnimatedSection title="Abilities" fadeAnim={fadeAnim} slideAnim={slideAnim}>
          <View style={styles.abilitiesContainer}>
            {pokemonDetail.abilities.map((abilityInfo, index) => (
              <AbilityCard 
                key={index} 
                ability={abilityInfo.ability.name}
                index={index}
              />
            ))}
          </View>
        </AnimatedSection>

        <AnimatedSection title="Status" fadeAnim={fadeAnim} slideAnim={slideAnim}>
          <View style={styles.statsContainer}>
            <StatBar
              label="Favorite"
              value={isCurrentFavorite ? 'Yes' : 'No'}
              color={isCurrentFavorite ? '#ef4444' : '#64748b'}
            />
            <StatBar
              label="Connection"
              value={networkStore.isOnline ? 'Online' : 'Offline'}
              color={networkStore.isOnline ? '#10b981' : '#f59e0b'}
            />
            <StatBar
              label="Types"
              value={pokemonDetail.types.length.toString()}
              color="#3b82f6"
            />
            <StatBar
              label="Abilities"
              value={pokemonDetail.abilities.length.toString()}
              color="#8b5cf6"
            />
          </View>
        </AnimatedSection>

        <AnimatedSection title="Information" fadeAnim={fadeAnim} slideAnim={slideAnim}>
          <View style={styles.infoContainer}>
            <PokemonInfoCard
              title={`About ${pokemonDetail.name}`}
              content={aboutContent}
            />
            <PokemonInfoCard
              title="Abilities"
              content={abilitiesContent}
              borderColor="#8b5cf6"
            />
          </View>
        </AnimatedSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  abilitiesContainer: {
    gap: 12,
  },
  statsContainer: {
    gap: 16,
  },
  infoContainer: {
    gap: 16,
  },
});