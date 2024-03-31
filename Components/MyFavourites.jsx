import React from 'react';
import { View, Text, StyleSheet, FlatList, Image,TouchableOpacity } from 'react-native';
import { useFavourites } from './favouritesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyFavourites = () => {
    const { favourites, removeFavourite, likedRestaurants } = useFavourites();
    console.log(favourites);
    const saveFavouritesToStorage = async (favourites) => {
        try {
            await AsyncStorage.setItem('my_favourites', JSON.stringify(favourites));
        } catch (error) {
            console.error("Error saving favourites: ", error);
        }
    };
    
    const loadFavouritesFromStorage = async () => {
        try {
            const storedFavourites = await AsyncStorage.getItem('my_favourites');
            if (storedFavourites) {
                return JSON.parse(storedFavourites);
            }
            return [];  // Default to empty array if nothing found
        } catch (error) {
            console.error("Error loading favourites: ", error);
            return [];  // Default to empty array on error
        }
    };
    const renderFavouriteItem = ({ item }) => {
        console.log('Rendering item:', item.name);
        console.log(item);
    
        return (
            <View style={styles.card}>
                <Image source={{ uri: item.images[0] }} style={styles.dishImage} />
                <View style={styles.textContainer}>
                <Text style={styles.dishName}>{item.name}</Text>
                <Text style={styles.restaurantName}>{item.address || "Address not available"}</Text>
                </View>
                <TouchableOpacity style={{ width: 30, height: 30 }} onPress={() => removeFavourite(item.id)}>
    <Image source={require('../Images/trashbin.png')} style={{ width: 20, height: 20 }} />
</TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Favourites</Text>
            <FlatList 
                data={favourites}
                extraData={favourites}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={renderFavouriteItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#E53935',
    },
    card: {
        flexDirection: 'row',
        
        marginBottom: 15,
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    dishImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textContainer: {
        marginLeft: 15,
        marginRight: 15,  // adding some margin to the right
        flexShrink: 1,
    },
    dishName: {
        fontSize: 18,
    },
    restaurantName: {
        fontSize: 14,
        color: 'gray',
    },
});

export default MyFavourites;
