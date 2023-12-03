import { useEffect, useState } from 'react';
import {fetchRestaurants} from './fetchRestaurants';

export const useFetchRestaurantsOnMount = (restaurantLocation, deviceLocation) => {
    const [results, setResults] = useState([]);
    const [top10RatedRestaurants, setTop10RatedRestaurants] = useState([]);

    useEffect(() => {
        const latitude = restaurantLocation.latitude || deviceLocation.latitude;
        const longitude = restaurantLocation.longitude || deviceLocation.longitude;
        console.log(typeof fetchRestaurants); // should log 'function'
        if (latitude && longitude) {
            fetchRestaurants(latitude, longitude)
                .then(newResults => {
                    setResults(newResults);
                    const topRated = newResults.filter(restaurant => restaurant.rating >= 4.3)
                                              .sort((a, b) => b.rating - a.rating)
                                              .slice(0, 10);
                    setTop10RatedRestaurants(topRated);
                })
                .catch(error => {
                    console.error('Error in fetching:', error);
                });
        }
    }, [restaurantLocation, deviceLocation]); // Depend on location props

    return { results, top10RatedRestaurants };
};
