import { useEffect } from 'react';
import {fetchRestaurants} from './fetchRestaurants';
export const useFetchRestaurantsOnLocationChange = (setResults, setTop10RatedRestaurants, restaurantLocation, deviceLocation) => {
    useEffect(() => {
        const latitude = restaurantLocation.latitude || deviceLocation.latitude;
        const longitude = restaurantLocation.longitude || deviceLocation.longitude;
        console.log("latitude:",latitude);
        if (latitude && longitude) {
            fetchRestaurants(latitude, longitude)
                .then(newResults => {
                    setResults(newResults);
                    const topRated = newResults.filter(restaurant => restaurant.rating >= 4.3).sort((a, b) => b.rating - a.rating).slice(0, 10);
                    setTop10RatedRestaurants(topRated);
                })
                .catch(error => {
                    console.error('Error in fetching:', error);
                });
        }
    }, [setResults, setTop10RatedRestaurants, restaurantLocation, deviceLocation]);
};
