import { useState } from 'react';
import { useItems } from '../ItemsContext';
import { fetchNearbyPlaces } from "./fetchNearbyPlaces";
import { fetchDetailedInfo } from "./fetchDetailedInfo";
import { getRandomRating } from "./getRandomRating";
import AsyncStorage from '@react-native-async-storage/async-storage';



const handleSearch = async (searchTerm, deviceLocation, setResults, setSearchedRestaurants, searchedRestaurants) => {
  
const API_KEY = "AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U"; // Replace with your actual API key
  
    return new Promise(async (resolve, reject) => {

      
      console.log('handleSearch called'); 
  
      if (!searchTerm) {
        console.warn("Search term parameter is missing");
        return reject(new Error("Search term parameter is missing"));
      }
      //const api_key = 'AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U';
       const location = deviceLocation;
       console.log("Received Device Location:", location);


    // Check if location is defined and if latitude and longitude are not undefined
    if (!location || location.latitude === undefined || location.longitude === undefined) {
      console.warn("Location is not defined or does not contain valid latitude and longitude properties");
      return reject(new Error("Location is not defined or does not contain valid latitude and longitude properties"));
    }

    const latitude = location.latitude;
    const longitude = location.longitude;

    // Ensure that latitude and longitude are numbers before making API calls
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      console.warn("Latitude or longitude is not a number");
      return reject(new Error("Latitude or longitude is not a number"));
    }
      
  
      try {
        const response = await fetchNearbyPlaces(latitude, longitude, searchTerm);
        const data = response.data;
        //setMyData(response.data);
        const detailedPromises = data.results.map(place => fetchDetailedInfo(place.place_id));
        const detailedResults = await Promise.all(detailedPromises);
  
        if (data.results.length > 0) {
          console.log('API response:', response);
          
          // Map Google Places API response to your restaurant data schema
          const newRestaurants = data.results.map((place, index) => ({
            id: detailedResults[index].place_id || place.place_id,
          name: detailedResults[index].name || 'Not available',
          address: detailedResults[index].formatted_address || 'Not available',
            contactDetails: {
              phone: detailedResults[index].formatted_phone_number || 'Not available',
              email: 'Not available',
              website: detailedResults[index].website || 'Not available',
            },
            openingHours: {
              // Requires more detailed request
              // You would typically loop through the API's array to populate this
            },
            images: place.photos ? place.photos.map(photo => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${API_KEY}`) : [],
            menus: [], // Not available from Google Places API
            menuUrl: 'default_menu_image_uri',
            location: {
              type: 'Point',
              coordinates: [
                place.geometry.location.lat,
                place.geometry.location.lng
              ]
            },
            cuisine: 'Not available', // Not available from Google Places API
            price_level: place.price_level || 0,
            rating: place.rating || getRandomRating(1, 4),
            dietaryOptions: []  // Not available from Google Places API
          }))
          .filter(newRestaurant => newRestaurant.contactDetails && newRestaurant.contactDetails.phone);  // Added filter here 
          
          setResults(newRestaurants);
          
          const newSearchedRestaurants = [...searchedRestaurants, ...newRestaurants];
          setSearchedRestaurants(newSearchedRestaurants);
          
          await AsyncStorage.setItem('searchedRestaurants', JSON.stringify(newSearchedRestaurants));
          
          resolve(newRestaurants);
        } else {
          console.log('No restaurants found for the current search, keeping the previous state.');
          resolve([]); 
        }
  
      } catch (error) {
        console.error('API Error:', error);
        reject(error); 
      }
    });
  }
  export default handleSearch;