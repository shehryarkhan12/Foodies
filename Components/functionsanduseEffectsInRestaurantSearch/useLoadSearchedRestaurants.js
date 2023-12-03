import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLoadSearchedRestaurants = (setSearchedRestaurants) => {
    useEffect(() => {
        const loadSearchedRestaurants = async () => {
            try {
                const storedSearchedRestaurants = await AsyncStorage.getItem('searchedRestaurants');
                if (storedSearchedRestaurants) {
                    setSearchedRestaurants(JSON.parse(storedSearchedRestaurants));
                }
            } catch (error) {
                console.error('Failed to load previously searched restaurants:', error);
            }
        };

        loadSearchedRestaurants();
    }, [setSearchedRestaurants]);
};
