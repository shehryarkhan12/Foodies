import {useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const useAnimateFavouriteToggle = (lastRemovedFavouriteId,item, itemId) => {
    const [likedRestaurants, setLikedRestaurants] = useState({});
    const isLiked = !!likedRestaurants[itemId];
    const animatedValue = useRef(new Animated.Value(isLiked ? 1 : 0)).current;

    useEffect(() => {
        if (lastRemovedFavouriteId === itemId) {
            Animated.spring(animatedValue, {
                toValue: isLiked ? 1 : 0,
                useNativeDriver: false,
            }).start();
        }

    }, [lastRemovedFavouriteId, itemId, animatedValue, isLiked]);

    
};

