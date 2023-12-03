import { fetchNearbyPlaces } from "./fetchNearbyPlaces";
import { fetchDetailedInfo } from "./fetchDetailedInfo";
import { getRandomRating } from "./getRandomRating";

export const fetchRestaurants = async (latitude, longitude) => {
    const API_KEY = "AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U"; // Replace with your actual API key

    try {
        const response = await fetchNearbyPlaces(latitude, longitude, 'restaurant');
        const data = await response.data;

        if (data.results) {
            const detailedPromises = data.results.map(place => fetchDetailedInfo(place.place_id));
            const detailedResults = await Promise.all(detailedPromises);
            const restaurants = data.results.map((place, index) => ({
                id: detailedResults[index].place_id || place.place_id,
                name: detailedResults[index].name || 'Not available',
                address: detailedResults[index].formatted_address || 'Not available',
                contactDetails: {
                    phone: detailedResults[index].formatted_phone_number || 'Not available',
                    email: 'Not available',
                    website: detailedResults[index].website || 'Not available',
                },
                openingHours: {
                    // Additional implementation
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
            })).filter(restaurant => restaurant.contactDetails && restaurant.contactDetails.phone);

            return restaurants;  // Return the results
        } else {
            console.error('Results key missing in API data:', data);
            throw new Error('Results key missing in API data');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;  // Throw the error
    }
};


