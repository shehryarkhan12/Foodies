
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLoadLikedRestaurants = () => {
    const [likedRestaurants, setLikedRestaurants] = useState([]);

    useEffect(() => {
        const loadLikedRestaurants = async () => {
            try {
                const storedLikes = await AsyncStorage.getItem('likedRestaurants');
                if (storedLikes) {
                    setLikedRestaurants(JSON.parse(storedLikes));
                }
            } catch (error) {
                console.error("Error loading liked restaurants: ", error);
            }
        };

        loadLikedRestaurants();
    }, []);

    return likedRestaurants;
};
