//import Geolocation from '@react-native-community/geolocation';

// Get the user's current location
const getCurrentLocation = (callback) => {
    Geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            callback({ latitude, longitude });
        },
        (error) => {
            // Handle error - this is where you'd manage scenarios where location services are unavailable
            console.error(error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
};