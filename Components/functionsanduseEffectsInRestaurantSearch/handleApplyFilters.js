import axios from "axios";

export const handleApplyFilters = async () => {

  const [places, setPlaces] = useState([]);
  // Your API key
  const apiKey = 'AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U';
    // Base URL for Google Places API
    const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${apiKey}`;
  
    
  
    // Other necessary parameters for your API call
    const location = `${latitude},${longitude}`;  // replace with actual lat and long
    const radius = '1500';  // replace or adjust as necessary
  
    // Construct your URL based on filters
    let url = `${baseUrl}location=${location}&radius=${radius}&key=${apiKey}`;
  
    if (priceLevel) {
      url += `&minprice=${priceLevel}`;
    }
    if (minimumRating) {
      url += `&rating=${minimumRating}`;
    }
    if (openNow) {
      url += `&opennow=true`;
    }
  
    try {
      const response = await axios.get(url);
      const results = response.data.results;
      // Now, you can update your UI with these results
      setPlaces(results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }