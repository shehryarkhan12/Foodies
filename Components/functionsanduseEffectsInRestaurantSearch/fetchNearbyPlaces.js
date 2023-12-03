import axios from "axios";


export const fetchNearbyPlaces = (latitude, longitude, searchTerm) => {
  const BASE_URL = "https://maps.googleapis.com/maps/api/place";
const API_KEY = "AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U"; // Replace with your actual API key
    const params = {
      query: searchTerm,
      location: `${latitude},${longitude}`,
      radius: 1500,
      key: API_KEY
    };
    
    return axios.get(`${BASE_URL}/textsearch/json`, { params });
  };