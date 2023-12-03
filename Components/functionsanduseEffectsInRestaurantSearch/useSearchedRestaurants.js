import {useState,useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSearchedRestaurantsState } from './useSearchedRestaurantsState';
export const useSearchedRestaurants = async () => {
    const [searchedRestaurants, setSearchedRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadSearchedRestaurants = async () => {
        try {
          const storedSearchedRestaurants = await AsyncStorage.getItem('searchedRestaurants');
          if (storedSearchedRestaurants) {
            setSearchedRestaurants(JSON.parse(storedSearchedRestaurants));
          }
        } catch (error) {
          console.error('Failed to load previously searched restaurants:', error);
        } finally {
          setLoading(false);
        }
      };
  
      loadSearchedRestaurants();
    }, []);
   // useSearchedRestaurantsState(searchedRestaurants);
  
    return { searchedRestaurants, loading };
  };

