import axios from "axios";
export const fetchDetailedInfo = async (place_id) => {
  const BASE_URL = "https://maps.googleapis.com/maps/api/place";
const API_KEY = "AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U"; // Replace with your actual API key
    const detailsEndpoint = `${BASE_URL}/details/json?place_id=${place_id}&key=${API_KEY}`;
  
    try {
      const response = await axios.get(detailsEndpoint);
      return response.data.result; // Axios automatically parses the JSON data
    } catch (error) {
      console.error('Error fetching detailed info:', error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };
  