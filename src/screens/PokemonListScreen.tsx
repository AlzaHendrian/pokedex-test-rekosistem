import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, RefreshControl, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePokemonStore } from '../stores/pokemonStore';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useNetworkStore } from '../stores/networkStore';
import { Pokemon } from '../types/pokemon';
import { PokemonCard } from '../components/pokemon/PokemonCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { StatsHeader } from '../components/pokemon/StatsHeader';
import { ListFooter } from '../components/list/ListFooter';
import { ErrorScreen } from '../components/ui/ErrorScreen';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface PokemonListScreenProps {
    navigation: any;
}

export const PokemonListScreen: React.FC<PokemonListScreenProps> = ({ navigation }) => {
    const pokemonStore = usePokemonStore();
    const favoritesStore = useFavoritesStore();
    const networkStore = useNetworkStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const initializeApp = async () => {
            await favoritesStore.loadFavorites();
            await pokemonStore.loadPokemons(true);
            await networkStore.checkConnection();
        };

        initializeApp();
        networkStore.startPeriodicCheck();

        return () => {
            networkStore.stopPeriodicCheck();
        };
    }, []);

    useEffect(() => {
        if (networkStore.isOnline) {
            favoritesStore.syncFavorites();
        }
    }, [networkStore.isOnline]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await networkStore.checkConnection();
        await pokemonStore.loadPokemons(true);
        if (networkStore.isOnline) {
            await favoritesStore.syncFavorites();
        }
        setRefreshing(false);
    };

    const handleLoadMore = () => {
        if (pokemonStore.hasMore && !pokemonStore.isLoadingMore && networkStore.isOnline) {
            pokemonStore.loadMorePokemons();
        }
    };

    const handlePokemonPress = (pokemon: Pokemon) => {
        navigation.navigate('PokemonDetail', { pokemonId: pokemon.id });
    };

    const handleToggleFavorite = async (pokemon: Pokemon) => {
        try {
            if (favoritesStore.isFavorite(pokemon.id)) {
                await favoritesStore.removeFromFavorites(pokemon.id);
            } else {
                await favoritesStore.addToFavorites({ id: pokemon.id, name: pokemon.name });
            }
        } catch (error) {
            // Handle error
        }
    };

    const renderPokemon = ({ item }: { item: Pokemon }) => (
        <PokemonCard
            pokemon={item}
            onPress={() => handlePokemonPress(item)}
            isFavorite={favoritesStore.isFavorite(item.id)}
            onToggleFavorite={() => handleToggleFavorite(item)}
            width={CARD_WIDTH}
        />
    );

    //   const renderSkeleton = () => (
    //     <View style={styles.row}>
    //       <SkeletonCard />
    //       <SkeletonCard />
    //     </View>
    //   );

    const renderSkeleton = ({ item, index }: { item: number; index: number }) => (
        <SkeletonCard />
    );

    const renderHeader = () => (
        <StatsHeader
            discoveredCount={pokemonStore.pokemons.length}
            favoritesCount={favoritesStore.favorites.length}
            isOnline={networkStore.isOnline}
        />
    );

    const renderFooter = () => (
        <ListFooter
            hasMore={pokemonStore.hasMore}
            isLoadingMore={pokemonStore.isLoadingMore}
            isOnline={networkStore.isOnline}
            totalCount={pokemonStore.pokemons.length}
        />
    );

    if (pokemonStore.error && pokemonStore.pokemons.length === 0) {
        return (
            <ErrorScreen
                title="Oops! Something went wrong"
                message={pokemonStore.error}
                onRetry={() => {
                    pokemonStore.clearError();
                    handleRefresh();
                }}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <FlatList
                data={pokemonStore.pokemons}
                renderItem={renderPokemon}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#3b82f6']}
                        tintColor="#3b82f6"
                        title="Pull to refresh"
                        titleColor="#64748b"
                    />
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {pokemonStore.isLoading && pokemonStore.pokemons.length === 0 && (
                <View style={styles.initialLoadingContainer}>
                    <FlatList
                        data={[1, 2, 3, 4, 5, 6]}
                        renderItem={renderSkeleton}
                        keyExtractor={(item) => item.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9',
    },
    listContent: {
        padding: 20,
        paddingBottom: 32,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    initialLoadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f1f5f9',
    },
});