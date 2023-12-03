import {useState, useEffect } from 'react';
import * as Location from 'expo-location';
import  {fetchRestaurants}  from './fetchRestaurants';

export const useFetchDeviceLocation = (setDeviceLocation, restaurantLocation) => {
    useEffect(() => {
        const fetchDeviceLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            const newLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
            setDeviceLocation({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
            });

            fetchRestaurants(newLocation.coords.latitude, newLocation.coords.longitude);
        };

        fetchDeviceLocation();
    }, [setDeviceLocation, restaurantLocation]);
};
