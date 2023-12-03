import { useEffect } from 'react';

export const useSearchedRestaurantsState = (searchedRestaurants) => {
    useEffect(() => {
        // Debugging or additional logic
        console.log('Searched Restaurants State:', searchedRestaurants);
    }, [searchedRestaurants]);
};
