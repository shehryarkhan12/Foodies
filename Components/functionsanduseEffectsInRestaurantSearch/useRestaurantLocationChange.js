import { useEffect } from 'react';
import {fetchRestaurants}  from './fetchRestaurants';

export const useRestaurantLocationChange = (restaurantLocation, prevRestaurantLocationRef) => {
    useEffect(() => {
        const prevRestaurantLocation = prevRestaurantLocationRef.current;

        if (!prevRestaurantLocation || prevRestaurantLocation.latitude !== restaurantLocation.latitude || prevRestaurantLocation.longitude !== restaurantLocation.longitude) {
            if (restaurantLocation.latitude && restaurantLocation.longitude) {
                fetchRestaurants(restaurantLocation.latitude, restaurantLocation.longitude);
            }
        }

        prevRestaurantLocationRef.current = restaurantLocation;
    }, [restaurantLocation, prevRestaurantLocationRef]);
};
