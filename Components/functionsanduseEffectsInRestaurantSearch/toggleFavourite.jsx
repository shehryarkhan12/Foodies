import React,{useState,useRef} from "react";
import { Alert,Animated,View, TextInput, Button, StyleSheet, Text,Image,FlatList,TouchableOpacity,ScrollView,Modal,Linking} from 'react-native';
import { useFavourites } from '../favouritesContext';



const toggleFavourite = async (restaurant) => {

    const [likedRestaurants, setLikedRestaurants] = useState({});
const { favourites, setFavourites,saveFavouritesToStorage,removeFavourite,lastRemovedFavouriteId } = useFavourites();
const animatedValue = useRef(new Animated.Value(0)).current;
    console.log('Toggling favourite for restaurant with ID:', restaurant.id);
    
    try {
        if (favourites.find(fav => fav.id === restaurant.id)) {
            console.log('Removing from favourites...');
            
            // Remove from favourites
            const updatedFavourites = favourites.filter(fav => fav.id !== restaurant.id);
            setFavourites(updatedFavourites);
            await saveFavouritesToStorage(updatedFavourites);
            
            // Update likedRestaurants and save to AsyncStorage
            const updatedLikes = { ...likedRestaurants };
            delete updatedLikes[restaurant.id];
            setLikedRestaurants(updatedLikes);
            await AsyncStorage.setItem('likedRestaurants', JSON.stringify(updatedLikes));
  
        } else {
            console.log('Adding to favourites...');
            
            // Add to favourites
            const updatedFavourites = [...favourites, restaurant];
            setFavourites(updatedFavourites);
            await saveFavouritesToStorage(updatedFavourites);
            
            // Update likedRestaurants and save to AsyncStorage
            setLikedRestaurants({
                ...likedRestaurants,
                [restaurant.id]: true
            });
            await AsyncStorage.setItem('likedRestaurants', JSON.stringify({ ...likedRestaurants, [restaurant.id]: true }));
        }
    } catch (error) {
        console.error("Error in toggleFavourite:", error);
    }
  };
  export default toggleFavourite;