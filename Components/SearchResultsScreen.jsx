import React, { useEffect, useState, useRef,useCallback } from 'react';
import { RefreshControl,ImageBackground,Alert,Animated,View, TextInput,ActivityIndicator, Button, StyleSheet, Text,Image,FlatList,TouchableOpacity,ScrollView,Modal,Linking,Platform, StatusBar,TouchableHighlight, KeyboardAvoidingView,TouchableWithoutFeedback } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 
import { useFavourites } from './favouritesContext';
import { AntDesign } from '@expo/vector-icons';
import * as Font from 'expo-font';
import Checkbox from 'expo-checkbox';
import Zoom from './Zoom';
import { FavouritesProvider } from './favouritesContext';
import { useItems } from './ItemsContext';
import { useRoute } from "@react-navigation/native";
import { API_IP_ADDRESS } from '../api/config';
import StarRating from './StarRating'; 
import backgroundImg from '../Images/burger.jpg'; // Make sure this path is correct
import CardLoader from './CardLoader';
import { useRestaurants } from './RestaurantsContext';
import { Rating } from 'react-native-ratings'; // Import the rating component
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';
import FilterScreen from './FilterScreen';
import Voice from '@react-native-voice/voice';
import { Keyboard } from 'react-native';
import { MaterialIcons,MaterialCommunityIcons } from '@expo/vector-icons';
import { Chip } from 'react-native-paper';
import { useHeartAnimation } from './HeartAnimationContext';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';




const cuisineList = [
    { name: "Burger", image: require('../Images/burgerIcon.jpg') },
    { name: "Pizza", image: require('../Images/pizza.jpg') },
    { name: "BBQ", image: require('../Images/bbq.png') },
    { name: "Appetizers", image: require('../Images/appetizer.png') },
    { name: "Seafood", image: require('../Images/seafood.jpg') },
    { name: "Biryani", image: require('../Images/biryani.png') },
    { name: "Desserts", image: require('../Images/dessert.jpg') },
    { name: "Chinese", image: require('../Images/chinese.jpg') },
    { name: "IceCream", image: require('../Images/iceCream.png') },
    { name: "Vegan", image: require('../Images/vegan.jpg') },
    // ... more cuisines ...
  ];

const SearchResultsScreen = ({  props,route,item, onApplyFilters }) => {
    const { searchTerm } = route.params;
    const [searchResults, setSearchResults] = useState([]);
    const [keyboardStatus, setKeyboardStatus] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [cuisines, setCuisines] = useState(cuisineList);
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const [isFilterScreenVisible, setIsFilterScreenVisible] = useState(false);
    const [showNoResultsAlert, setShowNoResultsAlert] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceSearchTerm, setVoiceSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [animation] = useState(new Animated.Value(0)); // Initial value for opacity
    const [isPressed, setIsPressed] = useState(false);
    const { heartAnimationValues, updateHeartAnimation } = useHeartAnimation();
    const [recording, setRecording] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [chatGPTResponse, setChatGPTResponse] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [showVoiceSearchUI, setShowVoiceSearchUI] = useState(false);


    // State to control the drawer animation
const drawerAnimation = useRef(new Animated.Value(-300)).current; // Assuming the width of the drawer is 300
    const filledHeart = require('../Images/filledheart.png');  // replace with your actual path
const unfilledHeart = require('../Images/unfillledheart.png');  // replace with your actual path
    const navigation = useNavigation();
  // const [deviceLocation, setDeviceLocation] = useState({
  //   latitude: null,
  //   longitude: null,
  // });
  const [refreshing, setRefreshing] = useState(false);
  const [data,setData]=useState(null);

  const [ratings, setRatings] = useState({}); // State to store ratings for each restaurant

  const [mapCenter, setMapCenter] = useState(null);

  const [restaurantName, setRestaurantName] = useState("");
  
  const [results, setResults] = useState([]);

 // const [mapKey, setMapKey] = useState(1);

  const [isMenuModalVisible, setMenuModalVisible] = useState(false);

  const [menuUrl, setMenuUrl] = useState('default_menu_image_uri');

  const [searchedRestaurants, setSearchedRestaurants] = useState([]);
  //console.log("Searched restaurant= ",searchedRestaurants);;
  const [top10RatedRestaurants, setTop10RatedRestaurants] = useState([]);
  //console.log("top10= ",top10RatedRestaurants);
  
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [liked, setLiked] = React.useState(false);
  const [myData,SetMyData] = useState([]);
  //console.log("myData =",myData);

  const [isMenuLoading, setIsMenuLoading] = useState(false); 
  
  const [places, setPlaces] = useState([]);

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
const [filters, setFilters] = useState({
  vegan: false,
  openNow: false,
  priceLevel: null,
  // Add more filters here...
});
const { deviceLocation,setDeviceLocation,mapKey,setMapKey,token,setToken,restaurantLocation,setRestaurantLocation } = useItems(); 
const loadingTimeoutRef = useRef(null);
const [transcribedText, setTranscribedText] = useState('');
const [pulseAnim] = useState(new Animated.Value(1));
const { setRestaurants } = useRestaurants();

//console.log("Device Location=",deviceLocation.latitude);
  const prevRestaurantLocationRef = useRef();

  const animatedValue = useRef(new Animated.Value(0)).current;

  const { favourites, setFavourites,saveFavouritesToStorage,removeFavourite,lastRemovedFavouriteId,likedRestaurants, setLikedRestaurants } = useFavourites();

  const BASE_URL = "https://maps.googleapis.com/maps/api/place";
  const API_KEY = "AIzaSyDu_ikrzuCSjDJh3h0LDoz79ooMNzbKxwc"; // Replace with your actual API key
  const fetchNearbyPlaces = (latitude, longitude, searchTerm) => {
    const params = {
      query: searchTerm,
      location: `${latitude},${longitude}`,
      radius: 1500,
      key: API_KEY
    };
    
    return axios.get(`${BASE_URL}/textsearch/json`, { params });
  };

  // useEffect(() => {
  //   function onSpeechResults(e) {
      
  //     setVoiceSearchTerm(e.value[0]);
  //     handleSearch(e.value[0],false); // automatically start search with the voice input
  //   }
   
  
  //   if (Voice) {
  //     Voice.onSpeechResults = onSpeechResults;
  
  //     return () => {
        
  //       Voice.destroy()
  //         .then(Voice.removeAllListeners)
          
  //     };
  //   } else {
  //     console.error('Voice is not initialized in useEffect');
  //   }
  // }, []);

  const openAIKey = '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'; // Securely store this

const fetchResponseFromChatGPT = async (text) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v4/completions',
      {
        model: "text-davinci-003", // Update to gpt-3.5-turbo or your model of choice
        prompt: text,
        temperature: 0.5,
        max_tokens: 200,
      },
      {
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].text.trim(); // Extracting and returning the response text
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return "I'm sorry, but I couldn't process your request.";
  }
};

const analyzeTextSentimentWithGoogleAPI = async (transcribedText) => {
  const GOOGLE_API_URL = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${API_KEY}`;

  try {
    const response = await fetch(GOOGLE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document: {
          type: 'PLAIN_TEXT',
          content: transcribedText,
        },
        encodingType: 'UTF8',
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Processed text with Google API: ', data);
    return data; // Return the entire response data for further use
  } catch (error) {
    console.error('Error processing text with Google API:', error);
    return transcribedText; // Optionally return the original text if there's an error
  }
};


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const toggleListening = async () => {
  if (isListening) {
    await stopRecording();
    setShowVoiceSearchUI(false); // Hide the voice search UI
    await delay(1000); // Wait for 1 second before starting a new recording
  } 
  if (!isListening) {
    setShowVoiceSearchUI(true); // Show the voice search UI before starting to record
    await startRecording();
  }
  setIsListening(!isListening);
};
const startRecording = async () => {
  // Check if there's an existing recording
  if (recording) {
    console.log('Found an existing recording. Stopping and unloading...');
    await stopRecording(); // Make sure this fully clears the previous recording
  }

  try {
    console.log('Requesting permissions..');
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status === "granted") {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
    
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      console.log('Recording started', newRecording);
    } else {
      console.log('Permissions not granted to record audio.');
      // Handle the error - notify the user that the permission was not granted
    }
  } catch (err) {
    console.error('Failed to start recording', err);
  }
};


const stopRecording = async () => {
  console.log('Stopping recording..');
  if (recording) {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    console.log('Stopping and unloading recording', recording);
    setRecording(null);

    // Transcribe the audio
    const transcribedText = await transcribeAudio(uri);

    // New step: process the transcribed text with OpenAI
    const processedText = await analyzeTextSentimentWithGoogleAPI(transcribedText);
    setTranscribedText(processedText); // Or directly from the transcription function
    setVoiceSearchTerm(processedText); // Assuming you want to use the processed text
  }
};

const readAndBase64EncodeAudioFile = async (uri) => {
  try {
    const base64Audio = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    return base64Audio;
  } catch (error) {
    console.error('Error reading and encoding file:', error);
    throw error;  // It's important to throw the error so you can catch it in the calling function
  }
};

const transcribeAudio = async (audioUri) => {
  try {
    const base64Audio = await readAndBase64EncodeAudioFile(audioUri);

    const response = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`,
      {
        config: {
          encoding: 'AMR_WB',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
        },
        audio: {
          content: base64Audio, // Use the Base64 encoded string
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const transcript = response.data.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    console.log('Transcription: ', transcript);
    return transcript;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return '';
  }
};



useEffect(() => {
  if (isListening) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  } else {
    pulseAnim.setValue(1); // Reset animation
  }
}, [isListening, pulseAnim]);


  

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
     if (restaurantLocation.latitude && restaurantLocation.longitude) {
       fetchRestaurants(restaurantLocation.latitude, restaurantLocation.longitude);
     }

    //console.log("mapCenter changed:", mapCenter);
  }, [restaurantLocation, mapCenter]);


  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus("Keyboard Shown");
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus("Keyboard Hidden");
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    // Animate the container's appearance
    Animated.timing(animation, {
      toValue: suggestions.length > 0 ? 1 : 0, // Fully visible if suggestions are present
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [suggestions, animation]);


//   useEffect(() => {
//     const latitude = restaurantLocation.latitude || deviceLocation.latitude;
//     const longitude = restaurantLocation.longitude || deviceLocation.longitude;
//     console.log("Latitude:", latitude, "Longitude:", longitude);
//     if (latitude && longitude) {
//       fetchRestaurants(latitude, longitude)
//         .then(newResults => {
//           setResults(newResults);
//           const topRated = newResults
//             .filter(restaurant => restaurant.rating >= 4)
//             .sort((a, b) => b.rating - a.rating)
//             .slice(0, 10);
//           setTop10RatedRestaurants(topRated);
//         })
//         .catch(error => {
//           console.error('Error in fetching:', error);
//         });
//     }
//   }, [restaurantLocation, deviceLocation]); 

// Function to handle filter application
const handleApplyFilters = (filters) => {
  // Update state or context with new filters
  setFilters(filters);

  // Close the FilterScreen
  setIsFilterScreenVisible(false);

  // Call API with new filters
  fetchRestaurantsWithFilters(filters);
};

// Refactored clear search function
const clearSearch = () => {
  setRestaurantName('');
  setSearchResults([]);
};


  function debouncePromise(fn, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      return new Promise((resolve, reject) => {
        timeout = setTimeout(() => {
          fn(...args)
            .then(resolve)
            .catch(reject);
        }, delay);
      });
    };
  }
  function getRandomRating(min, max) {
    return Math.random() * (max - min) + min;
  }

  
  
  const fetchDetailedInfo = async (place_id) => {
    const detailsEndpoint = `${BASE_URL}/details/json?place_id=${place_id}&key=${API_KEY}`;
  
    try {
      const response = await axios.get(detailsEndpoint);
      return response.data.result; // Axios automatically parses the JSON data
    } catch (error) {
      console.error('Error fetching detailed info:', error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };


  const fetchRestaurantsWithFilters = debouncePromise(async (latitude, longitude, searchTerm, filters) => {
    const { location, openNow = false, priceLevel = null, rating = 0, cuisines = [] } = filters || {};

    return new Promise(async (resolve, reject) => {
        try {
            const searchLatitude = location?.latitude || deviceLocation.latitude;
            const searchLongitude = location?.longitude || deviceLocation.longitude;

            let keyword = 'restaurant';
            if (cuisines.length > 0) {
                keyword += ` ${cuisines.join(" ")}`;
            }
            //console.log("cuisines:",cuisines);

            if (searchTerm) {
                keyword += ` ${searchTerm}`;
            }
           // console.log("searchTerm:",searchTerm);

            const params = {
                location: `${searchLatitude},${searchLongitude}`,
                radius: 1500,
                type: 'restaurant',
                keyword: keyword,
                key: API_KEY,
            };

            if (openNow) {
                params.opennow = true;
            }
            //console.log("OpenNowState:",openNow);
            // Assuming priceLevel is an object with min and max properties
            if (priceLevel) {
                params.minprice = mapPriceToGoogleScale(priceLevel.min);
                params.maxprice = mapPriceToGoogleScale(priceLevel.max);
            }

            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, { params });
            const data = response.data;

            if (data.results) {
                let filteredResults = data.results.filter(place => (!rating || place.rating >= rating));

                const restaurants = filteredResults.map(place => ({
                    id: place.place_id,
                    name: place.name || 'Not available',
                    address: place.vicinity || 'Not available',
                    images: place.photos ? place.photos.map(photo => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${API_KEY}`) : [],
                    location: {
                        type: 'Point',
                        coordinates: [
                            place.geometry.location.lat,
                            place.geometry.location.lng
                        ]
                    },
                    price_level: place.price_level || 0,
                    rating: place.rating || 0,
                }));

                setResults(restaurants);
                resolve(restaurants);
            } else {
                console.error('Results key missing in API data:', data);
                reject(new Error('Results key missing in API data'));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            reject(error);
        }
    });
}, 100);

// Helper function to map price level to Google's scale
function mapPriceToGoogleScale(price) {
    // Implement the mapping logic based on your application's price level scale
    return price; // Replace this with the actual mapping
}
 
  
  const fetchRestaurants = debouncePromise(async (latitude, longitude,searchTerm) => {
    return new Promise(async (resolve, reject) => {
    
    try {
      const response = await fetchNearbyPlaces(latitude, longitude, 'restaurant'); // Use your utility function
      const data = await response.data;
      //console.log(data);

      
      
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
          
          images: place.photos ? place.photos.map(photo => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${API_KEY}`) : [],
          
          location: {
            type: 'Point',
            coordinates: [
              place.geometry.location.lat,
              place.geometry.location.lng
            ]
          },
          price_level: place.price_level || 0,
          rating: place.rating || getRandomRating(1, 4),
          
        }))
        .filter(restaurant => restaurant.contactDetails && restaurant.contactDetails.phone);  // Filtering step added here
        //console.log("Fetched Restaurants:", restaurants);
        setResults(restaurants);
        resolve(restaurants);
      } else {
        console.error('Results key missing in API data:', data);
        reject(new Error('Results key missing in API data'));  // Rejects the promise
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      reject(error);  // Rejects the promise
    }
  });
  }, 100);

  const debounce = (func, delay) => {
    let inDebounce;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
  };
  const debouncedSearch = useCallback(
    debounce((nextValue) => handleSearch(nextValue,true), 500),
    [] // Dependencies array, empty means the debounced function is created once
  );

  
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const storedSearches = await AsyncStorage.getItem('recentSearches');
        if (storedSearches) {
          setRecentSearches(JSON.parse(storedSearches));
        }
      } catch (error) {
        console.error("Error loading recent searches: ", error);
      }
    };
  
    loadRecentSearches();
  }, []);
  
  
  useEffect(() => {
    setResults([]);
  }, []);

  const fetchAutoSuggestions = async (searchTerm) => {
    try {
      // Define the city center latitude, longitude, and search radius
      const cityLatitude = deviceLocation.latitude; // Replace with your city's latitude
      const cityLongitude = deviceLocation.longitude; // Replace with your city's longitude
      console.log(deviceLocation.latitude,deviceLocation.longitude);
      const searchRadius = '25000'; // Define your search radius in meters
  
      const url = `http://${API_IP_ADDRESS}/suggestions?q=${encodeURIComponent(searchTerm)}&lat=${cityLatitude}&lon=${cityLongitude}&radius=${searchRadius}`;
  
      const response = await fetch(url);
      const data = await response.json();
  
      // Optionally log the fetched data
      console.log("Fetched Suggestions: ", data);
  
      return data;
    } catch (error) {
      console.error('Error fetching auto suggestions:', error);
      return [];
    }
  };

   // Function to remove a specific search term from recent searches
   const removeRecentSearch = (searchTerm) => {
    setRecentSearches(recentSearches.filter(search => search !== searchTerm));
  };

  const handleSuggestionSelect = (name) => {
    setRestaurantName(name);
    setSuggestions([]); // Clear suggestions
    handleSearch(name, false); // Pass false to avoid fetching suggestions again
    
     // Debugging: Check the updated state
    // console.log("Selected suggestion: ", name, "; Cleared suggestions.");
  };
   
  const handleSearch = async (searchTerm,fetchSuggestions = true) => {
    setIsLoading(true); // Start loading
    // Clear previous results before searching
    setResults([]);
    setTop10RatedRestaurants([]);
  
    if (!searchTerm) {
      clearSearch();
      setSuggestions([]); // Clear suggestions
      setShowNoResultsAlert(true);
      setIsLoading(false);
      return;
      }
      
      if (fetchSuggestions) {
        const suggestions = await fetchAutoSuggestions(searchTerm);
        if (suggestions.length > 0) {
          setSuggestions(suggestions);
        }else {
          setSuggestions([]); // Clear suggestions if no new suggestions are fetched
        }
      }

  
    const location = deviceLocation;
  
   
  
    const latitude = location.latitude;
    const longitude = location.longitude;
  
    if (searchTerm.length > 4) {
      setRecentSearches(prevSearches => {
        // Filter out the current searchTerm if it's already in prevSearches and filter out any short terms
        const newSearches = [searchTerm, ...prevSearches.filter(search => search !== searchTerm && search.length > 4)];
        // Slice the array to store up to 5 recent searches
        const recentSearchesToStore = newSearches.slice(0, 5);
        AsyncStorage.setItem('recentSearches', JSON.stringify(recentSearchesToStore));
        return recentSearchesToStore;
      });
  }
      
          try {
            const response = await fetchNearbyPlaces(latitude, longitude, searchTerm);
            const data = response.data;
            //console.log("data:",data);
            const results = response.data.results || [];
            if (results.length === 0) {
              setShowNoResultsAlert(true);
            }
            //setMyData(response.data);
            const detailedPromises = data.results.map(place => fetchDetailedInfo(place.place_id));
            const detailedResults = await Promise.all(detailedPromises);
      
            if (data.results.length > 0) {
              //console.log('API response:', response);
              
              setShowNoResultsAlert(false); // Hide no results alert
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

  
            } else {
              console.log('No restaurants found for the current search, keeping the previous state.');
              setShowNoResultsAlert(true); // Show no results alert
            }
            loadingTimeoutRef.current = setTimeout(() => {
                setIsLoading(false);
              }, 500);
      
          } catch (error) {
            console.error('API Error:', error);
            // Introduce a delay even in case of an error
            loadingTimeoutRef.current = setTimeout(() => {
                setIsLoading(false);
              }, 1500);
          }

    }
    
    useEffect(() => {
        return () => {
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
          }
        };
      }, []);

      const fetchMenuFromServer = async (menuCategory) => {
        try {
          const response = await axios.get(`http://${API_IP_ADDRESS}/menus?category=${menuCategory}`);
          //console.log("Raw Response Data:", response.data);  // Log raw response data
          if (response.data) {
            return response.data;
          } else {
            console.warn('No menu data found for the category');
            return null;
          }
        } catch (error) {
          console.error('Error fetching menu:', error);
          throw error;  // Rethrow the error to be caught in the calling function
        }
      };
      

    const handleRestaurantSelect = (item) => {
      if (item.location && item.location.coordinates) {
          const [latitude, longitude] = item.location.coordinates;
         console.log('Selected Restaurant:', item); // Debugging: Check if item has the correct data
          setRestaurantLocation({ latitude, longitude });
          navigation.navigate('RestaurantDetails', { 
            restaurant: item,
            latitude, // Pass latitude if needed
            longitude, // Pass longitude if needed
            deviceLocation, // Pass the entire deviceLocation object
          });
      } else {
          console.warn(`Location data missing for: ${item.name}`);
      }
  };


  useEffect(() => {
    //console.log('isMenuLoading updated:', isMenuLoading);
  }, [isMenuLoading]);

    const handleMenuButtonClick = async (item,lati,longi) => {
        setIsMenuLoading(true); // Show loader
        let menuCategory = '';
      
        try {
          //console.log(`Fetching menu for category: ${menuCategory}`); // Debugging statement
          const menuData = await fetchMenuFromServer(menuCategory);
          //console.log("Menu Data:", JSON.stringify(menuData, null, 2));
          NavigateToMenuScreen(menuData,lati,longi);
          //console.log(menuData);
        } catch (error) {
          console.error("Failed to fetch menu data:", error);
        }
        setIsMenuLoading(false); // Hide loader when done
      }
      
      
      const NavigateToMenuScreen = (menuData,lati,longi)=>{
       // console.log("Navigating to MenuScreen with data:", menuData); // Debugging statement
        navigation.navigate('MenuScreen', { menuData: menuData,lati:lati,longi:longi });
      }

      const toggleLike = async (id) => {
   
        setLikedRestaurants({
          ...likedRestaurants,
          [id]: !likedRestaurants[id],
        });
    
        if (likedRestaurants[id]) {
          removeFavourite(id);
          Alert.alert('Notification', `${item.name} removed from favourites!`);
      }
    
        try {
          await AsyncStorage.setItem('likedRestaurants', JSON.stringify(likedRestaurants));
      } catch (error) {
          console.error("Error saving liked restaurants: ", error);
      }
    
        Animated.spring(animatedValue, {
          toValue: likedRestaurants[id] ? 0 : 1,
          useNativeDriver: false,
        }).start();
      };
      useEffect(() => {
        const loadLikedRestaurants = async () => {
            try {
                const storedLikes = await AsyncStorage.getItem('likedRestaurants');
                if (storedLikes) {
                    setLikedRestaurants(JSON.parse(storedLikes));
                }
            } catch (error) {
                console.error("Error loading liked restaurants: ", error);
            }
        };
    
        loadLikedRestaurants();
    }, []);

    const toggleFavourite = async (restaurant) => {
        console.log('Toggling favourite for restaurant with ID:', restaurant.id);
        
        try {
            if (favourites.find(fav => fav.id === restaurant.id)) {
                console.log('Removing from favourites...');
                
                // Remove from favourites
                const updatedFavourites = favourites.filter(fav => fav.id !== restaurant.id);
                setFavourites(updatedFavourites);
                await saveFavouritesToStorage(updatedFavourites);
                
                // Update likedRestaurants and save to AsyncStorage
                const updatedLikes = { ...likedRestaurants };
                delete updatedLikes[restaurant.id];
                setLikedRestaurants(updatedLikes);
                await AsyncStorage.setItem('likedRestaurants', JSON.stringify(updatedLikes));
      
            } else {
                console.log('Adding to favourites...');
                
                // Add to favourites
                const updatedFavourites = [...favourites, restaurant];
                setFavourites(updatedFavourites);
                await saveFavouritesToStorage(updatedFavourites);
                
                // Update likedRestaurants and save to AsyncStorage
                setLikedRestaurants({
                    ...likedRestaurants,
                    [restaurant.id]: true
                });
                await AsyncStorage.setItem('likedRestaurants', JSON.stringify({ ...likedRestaurants, [restaurant.id]: true }));
            }
        } catch (error) {
            console.error("Error in toggleFavourite:", error);
        }
      };
      
      useEffect(() => {
        // Ensure 'item' is defined and has an 'id' property before proceeding
        if (item && item.id && lastRemovedFavouriteId === item.id) {
          // Check if 'likedRestaurants' is defined and has the 'id' property as a key
          if (likedRestaurants && likedRestaurants.hasOwnProperty(item.id)) {
            // Trigger the animation to show the unfilled heart
            Animated.spring(animatedValue, {
              toValue: likedRestaurants[id] ? 0 : 1, // assuming 0 is the value for an unfilled heart
              useNativeDriver: false,
            }).start();
          }
        }
      }, [lastRemovedFavouriteId, likedRestaurants, animatedValue]);
      
      
      
        const mapPriceLevelToText = (priceLevel) => {
          switch (priceLevel) {
            case 0:
              return 'Free';
            case 1:
              return '100 - 500 PKR per person';
            case 2:
              return '500 - 1500 PKR';
            case 3:
              return '1500 - 3000 PKR';
            case 4:
              return '3000 PKR and above per person';
            default:
              return '100 - 500 PKR per person';
          }
        };


        const handleCallPress = async (phoneNumber, restaurantName) => {
          if (phoneNumber && phoneNumber !== 'Not available') {
              Alert.alert(
                  "Save Contact",
                  `Do you want to save ${restaurantName} to your contacts?`,
                  [
                      {
                          text: "No",
                          onPress: () => Linking.openURL(`tel:${phoneNumber}`),
                          style: "cancel"
                      },
                      {
                          text: "Yes",
                          onPress: () => Linking.openURL(`tel:${phoneNumber}`)
                      }
                  ]
              );
          } else {
              console.warn("No phone number available or phone number is 'Not available'");
          }
      };
      const requestContactPermissions = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        return status;
      };
      
      const saveContactAndCall = async (phoneNumber, restaurantName) => {
        const permissionStatus = await requestContactPermissions();
        if (permissionStatus !== 'granted') {
          //console.warn('Contacts permission not granted');
          return;
        }
      
          const newContact = {
              [Contacts.Fields.LastName]: restaurantName,
              [Contacts.Fields.PhoneNumbers]: [{ label: 'mobile', number: phoneNumber }]
          };
      
          try {
            if(permissionStatus == 'granted'){
              const contactId = await Contacts.addContactAsync(newContact);
            
              console.log('Contact saved with ID:', contactId);
              Linking.openURL(`tel:${phoneNumber}`);
            }
          } catch (error) {
              console.error('Error saving contact:', error);
          }
      };
       // Function to open the full-screen drawer
      const openFiltersDrawer = () => {
        setIsFilterScreenVisible(true); // Show the FilterScreen
      };

       // Function to close the full-screen drawer
  const closeFiltersDrawer = () => {
    setIsFilterScreenVisible(false); // Hide the FilterScreen
  };

  const addRecentSearch = (searchTerm) => {
    setRecentSearches(prevSearches => ([
      ...prevSearches,
      { term: searchTerm, margin: getRandomMargin() }, // Store the random margin along with the search term
    ]));
  };

  // Function to clear suggestions when tapping outside
  const handleDismissSuggestions = () => {
    setSuggestions([]);
  };

  const addRecentSearchWithMargin = (searchTerm) => {
    const newSearch = {
      term: searchTerm,
      margin: {
        marginHorizontal: Math.random() * 10 + 5, // Randomize between 5 to 15, for example
        marginVertical: Math.random() * 10 + 5,
      },
    };
    // Assuming recentSearches is an array of objects now
    setRecentSearches((prevSearches) => [...prevSearches, newSearch]);
  };
  

  const getRandomMargin = () => ({
    marginHorizontal: Math.random() * 10 +5, // Randomize between 0 to 10, for example
    marginVertical: Math.random() * 10 +5,
  });


    const renderRestaurant = ({ item }) => {
  
        const isLiked = !!likedRestaurants[item.id];
        const handleRatingCompleted = (newRating) => {
          setRatings(prevRatings => ({ ...prevRatings, [item.id]: newRating }));
          //console.log("Rating for " + item.name + " is: " + newRating);
          Alert.alert(`Thank you for rating ${item.name}`);
          // Handle the logic to send the rating to your backend
        };
        //console.log("Menu URL:", menuUrl);
        //console.log("Results:", results);
        if (item && item.name) {
          if (!restaurantName || item.name.toLowerCase().includes(restaurantName.toLowerCase())) {
            return (
              <View>

                <TouchableOpacity onPress={() => handleRestaurantSelect(item)}>

              
                {/* <TouchableOpacity 
                  onPress={() => {
                    if (item.location && item.location.coordinates) {
                      const [latitude, longitude] = item.location.coordinates;
                      console.log(`Updating map center for: ${item.name}`, latitude, longitude);
                      onRestaurantCardClick(latitude, longitude);
                      setMapCenter({
                        latitude,
                        longitude,
                      });
                      //setMapKey(prevKey => prevKey + 1);
                    } else {
                      console.warn(`Location data missing for: ${item.name}`);
                    }
                  }}
                  style={styles.restaurantCard}
                > */}
                  <Image 
                    source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'default_image_uri' }} 
                    style={styles.restaurantImage} 
                    resizeMode="cover"
                  />
                  <View style={styles.restaurantDetails}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.restaurantName}>{item.name}</Text>
                    <TouchableOpacity onPress={() => {
    const restaurantId = item.id;
    const wasLikedBefore = likedRestaurants[restaurantId];
    toggleLike(restaurantId);
    toggleFavourite(item);

    if (!heartAnimationValues[restaurantId]) {
        heartAnimationValues[restaurantId] = new Animated.Value(1);
    }

    Animated.spring(heartAnimationValues[restaurantId], {
        toValue: wasLikedBefore ? 1 : 1.2,
        friction: 3,
        useNativeDriver: true,
    }).start();

    if (wasLikedBefore) {
        Alert.alert('Notification', `${item.name} removed from favourites!`);
    } else {
        Alert.alert('Favourite', `${item.name} saved as favourite!`);
    }
}}>

<Animated.View
  style={{
    marginTop: 10,
    transform: [
      {
        scale: heartAnimationValues[item.id] || 1,
      },
    ],
  }}
>
  <MaterialIcons 
    name={isLiked ? 'favorite' : 'favorite-border'}
    size={24} 
    color={isLiked ? 'red' : 'black'} 
  />
</Animated.View>
</TouchableOpacity>
      </View>
      {/* Add Address Here */}
      <Text style={styles.restaurantAddress}>{item.address || 'Address not available'}</Text>
      
                    <Text style={styles.restaurantInfo}>Price: {mapPriceLevelToText(item.price_level || 'default')}</Text>
      
                    <StarRating rating={item.rating || 0} />
                    {/* Rating Container */}
      <View style={styles.ratingContainer}>
        <Text style={styles.addRatingText}>Add Rating: {ratings[item.id]?.toFixed(1) || 'Not Rated'}</Text>
        <Rating
          type="star"
          ratingCount={5}
          imageSize={25}
          startingValue={ratings[item.id] || 0}
          onFinishRating={handleRatingCompleted}
          fractions={2} // Allows half-star ratings
          style={{ paddingVertical: 10 }}
        />
      </View>
       {/* Here is the new call button */}
                    {item.contactDetails && item.contactDetails.phone ? (
        <TouchableOpacity onPress={() => handleCallPress(item.contactDetails.phone, item.name)} style={{ alignItems: 'flex-start' }}>
          <Image 
            source={require('../Images/call.png')} 
            style={{ width: 50, height: 50 }}
          />
          <Text style={{ marginTop: 5,marginLeft:10 }}>Add to Contact list</Text>
        </TouchableOpacity>
      ) : null}
                     
                     <TouchableOpacity
        onPress={() => handleMenuButtonClick(item, deviceLocation.latitude, deviceLocation.longitude)}
        style={styles.orderButton}
        activeOpacity={0.7} // Optional: Adjusts the opacity touch feedback
      >
        <Text style={styles.orderButtonText}>Order</Text>
      </TouchableOpacity>
      
      
                    
                  </View>
                {/* </TouchableOpacity> */}
               
      
                {/* Modal to show the menu card */}
                {/* <Modal
          animationType="slide"
          transparent={true}
          visible={isMenuModalVisible}
          onRequestClose={() => {
              setMenuModalVisible(false);
          }}
      >
          <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center'}}>
              
              
              <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                  <TouchableOpacity onPress={() => setMenuModalVisible(false)}>
                      <Image 
                          source={require('../Images/cross_icon.png')}
                          style={{ width: 30, height: 30 }} 
                      />
                  </TouchableOpacity>
              </View>
      
              { menuUrl ? <Zoom source={{ uri: menuUrl }}/> : <Text>No menu available</Text> }
      
          </View>
      </Modal> */}
      </TouchableOpacity>
      
              </View>
              
            );
          }
        }
        return null;
      };

      //console.log('Component rendering', { isMenuLoading });
  
      return (
        
        <TouchableWithoutFeedback onPress={handleDismissSuggestions}>
           <View style={{flex:1}}>
      {showVoiceSearchUI && (
        <View style={styles.voiceSearchOverlay}>
          <Animated.View
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <Text style={styles.listeningText}>Listening...</Text>
          <Text style={styles.transcribedText}>{voiceSearchTerm}</Text>
          <TouchableOpacity onPress={toggleListening} style={styles.stopListeningButton}>
            <Text style={styles.stopListeningButtonText}>Tap to Stop</Text>
          </TouchableOpacity>
        </View>
      )}
   
{isMenuLoading ? (
      <ScrollView>
        {Array.from({ length: 5 }, (_, index) => (
          <CardLoader key={index} backgroundColor="#E0E0E0" baseColor="#C0C0C0" highlightColor="#A9A9A9" />
        ))}
      </ScrollView>
    ) : (
         
        <View >
          
          <View style={styles.searchContainer}>
            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={() => {
                  handleSearch(restaurantName,true);
                  setRestaurantName('');
                }}>
                <Image source={require('../Images/search.png')} style={styles.icon} />
              </TouchableOpacity>
              <TextInput
  placeholder="Search for restaurants, cuisines and cafes"
  placeholderTextColor="lightgray"
  style={styles.searchInput}
  onFocus={() => setIsSearchFocused(true)}
  onBlur={() => setIsSearchFocused(false)}
  onChangeText={text => {
    setRestaurantName(text);
    debouncedSearch(text);
  }}
  value={restaurantName || voiceSearchTerm}
/>

<TouchableOpacity onPress={toggleListening} style={styles.microphoneButton}>
        <Image 
          source={require('../Images/microphone.png')} // Make sure the path is correct
          style={styles.microphoneIcon}
        />
      </TouchableOpacity>
      

              <Text style={styles.divider}>|</Text>
              <TouchableOpacity onPress={openFiltersDrawer}>
                <Image source={require('../Images/filter.png')} style={styles.icon} />
              </TouchableOpacity>
              
              
  
            </View>

            <View>
           
  {recentSearches.length > 0 && !isSearchFocused && (
    <>
      <Text style={styles.recentSearchesLabel}>Recent Searches</Text>
      <View style={styles.chipsContainer}>
        {recentSearches.map((search, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSearch(search, false)}
            activeOpacity={0.1}
            style={[styles.customChip, search.margin]}
          >
            <View style={styles.chipContent}>
              <Text>{search}</Text>
            </View>
            <TouchableOpacity onPress={() => removeRecentSearch(search)} style={styles.closeIcon} activeOpacity={0.1}>
              <MaterialIcons name="close" size={20} color="#7E57C2" style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </>
  )}
</View>


            
             {/* Suggestions list starts here */}
          {suggestions.length > 0 && (
            <Animated.View
            style={[
              styles.suggestionsContainer,
              { opacity: animation } // Bind opacity to animated value
            ]}
          >
            
            
            <ScrollView style={styles.suggestionsContainer} keyboardShouldPersistTaps="handled" >
            <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            
          >
              {suggestions.map((suggestion, index) => (
                <TouchableHighlight
                key={index}
                style={styles.touchableHighlight}
                underlayColor={styles.touchableHighlight.underlayColor}
                onPress={() => handleSuggestionSelect(suggestion.name)}
              >
                
                <Text style={styles.suggestionItem}>
           <MaterialIcons name="search" style={styles.suggestionText} size={24} color="black" />
               {suggestion.name}
                 </Text>
              </TouchableHighlight>
              ))}
               </KeyboardAvoidingView>
            </ScrollView>
            
           
            </Animated.View>
          )}
           
          </View>
          {!isLoading ? (
      <ScrollView>
          
        <Text style={styles.sectionTitle}>Cuisines</Text>
        <FlatList
  data={cuisines}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => {handleSearch(item.name,false);setRestaurantName(''); }}>
      <View style={styles.cuisineCard}>
        <Image source={item.image} style={styles.cuisineImage} />
        <Text style={styles.cuisineText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  )}
  keyExtractor={(item, index) => `cuisine-${index}`}
  horizontal={true}
/>
        <Text style={styles.sectionTitle}>Restaurants</Text>
        {results.map(item => (
          <View key={item.id} style={styles.card}>
            {renderRestaurant({ item })}
          </View>

        ))}
         
  <View style={styles.noResultsContainer}>
    <Image
      source={require('../Images/noresultsearchicon.png')}
      style={styles.noResultsImage}
    />
    <Text style={styles.noResultsText}>
      No results found for "{searchTerm}"
    </Text>
  </View>

        {/* Conditional rendering of the FilterScreen */}
      {isFilterScreenVisible && (
        <View style={StyleSheet.absoluteFill}>
          <FilterScreen navigation={{ closeDrawer: closeFiltersDrawer }}
           onApplyFilters={handleApplyFilters}
            />
         
        </View>
      )}
    
      </ScrollView>
    ) : (
      <ScrollView>
        {/* Render placeholders for the loading state */}
        {Array.from({ length: 5 }, (_, index) => (
          <CardLoader key={index}
          backgroundColor="#E0E0E0" // Background color for Screen 1
  baseColor="#C0C0C0" // Base color for animation
  highlightColor="#A9A9A9" />
        ))}
      </ScrollView>
    )}
    
        </View>
    )}
        
        </View>
        </TouchableWithoutFeedback>
      );
      
  };
  const styles = StyleSheet.create({
          
    container: {
        flex: 1,
        
        backgroundColor: 'grey', 
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 10,
      paddingLeft: 10,
      paddingBottom: 10,
      paddingRight: 0, // Set right padding to 0
      borderBottomWidth: 0.5,
      borderColor: 'lightgray',
      paddingHorizontal: 0, // Add this for horizontal padding

    },
    searchContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      marginVertical: 10,
      paddingHorizontal: 15,
      paddingTop: 15,
    },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9', // Light grey background for the input field to stand out on the white background
        borderRadius: 25, // More pronounced rounded corners
        borderWidth: 0, // No border for a cleaner look
        elevation: 3, // Subtle shadow for a floating effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginVertical: 10,
      },
      drawerContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 300, // Width of the drawer
        height: '100%', // Full height of the screen
        backgroundColor: 'white',
        zIndex: 1000, // Ensure it's above other content
        // Add your own styling for the drawer content here
      },
      searchIcon: {
        marginLeft: 15, // Consistent spacing from the edge
        marginRight: 10, // A little space before the text input starts
        width: 20,
        height: 20,
      },
  universityName: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: 'lightgray', 
},
    searchForm: {
        flex: 1,
        paddingTop: 10,
    paddingLeft: 2,
    paddingBottom: 10,
    paddingRight: 0, // Set right padding to 0
        
    },
    searchInput: {
        flex: 1, // Take up remaining space
        paddingVertical: 8, // Enough vertical padding to make it easy to tap
        paddingHorizontal: 10, // Not to close to the border
        fontSize: 16, // Readable font size
        color: '#333', // Dark grey color for contrast
        backgroundColor: 'transparent', // Maintain background from the container
      },
    filterIcon: {
      
      position: 'absolute',
      right: 20,
      zIndex: 1,
      width: 20,
      height: 20,
    },
    flatListContainer: {
      paddingHorizontal: 0, // Remove horizontal padding if any
    },

    // Styles for the recent searches container
recentSearchesContainer: {
  position: 'relative',
  top: 0, // Adjust according to your layout
  left: 0,
  right: 0,
  maxHeight: 200, // Limit the height of the recent searches container
  backgroundColor: 'lightgrey',
  zIndex: 0, // Keep this low if you want other components to overlap it
  overflow: "scroll", // Hide overflow content
},
    
    ratingContainer: {
      flexDirection: 'row', // Align items in a row
      alignItems: 'center', // Center align vertically
      justifyContent: 'flex-start', // Align to the left
      paddingVertical: 5,
      paddingHorizontal: 10,
      backgroundColor: '#FFF', // White background for a clean look
      borderRadius: 5, // Slightly rounded corners
      borderWidth: 1, // Thin border for definition
      borderColor: '#E0E0E0', // Light grey border
      marginVertical: 10, // Spacing from other elements
      marginHorizontal: 10, // Spacing from card edges
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 1.5,
      elevation: 2, // Subtle elevation for Android
  },
  materialicon: {
    marginRight: 10, // Space between icon and text
  },
  suggestionsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    position: 'absolute',
    top: '110%', // This positions the container right below the input field
    zIndex: 3000,
    left: 10,
  right: 0,
    maxHeight:400
  },

  suggestionItem: {
    flexDirection: 'row', // Align icon and text in a row
    alignItems: 'center', // Center align vertically
    paddingVertical: 10,
    paddingHorizontal: 15,
    // For adding underline under every suggestion
    // borderBottomWidth: 1,
    // borderBottomColor: '#E0E0E0',
    fontSize: 22,
    color: '#333',
  },
  

  suggestionText: {
    fontSize: 22,
    color: '#333333', // Darker text for readability
    marginTop:10
  },
  customChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // This ensures that the content and the icon are at opposite ends
    backgroundColor: '#EDE7F6', // Light purple background for contrast
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7E57C2', // Purplish border color
    paddingVertical: 5, // Shortened vertical padding
    paddingHorizontal: 20, // Adjust horizontal padding if needed
    margin: 5,
  },
  chipContent: {
    justifyContent: 'right',
    alignItems: 'right',
    color:"#7E57C2"
  },
  closeIcon: {
    padding: 5, // Add padding for easier touch 
  },
  // Add a touchable highlight effect
touchableHighlight: {
  underlayColor: '#DDDDDD', // Light grey for touch feedback
},
  addRatingText: {
      marginRight: 8, // Space between text and rating stars
      fontWeight: '600', // Semi-bold for emphasis
      fontSize: 14, // Appropriate font size for readability
      color: '#333', // Dark grey for contrast
  },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject, // This ensures it covers the whole screen
        justifyContent: 'center', // Centers the spinner vertically
        alignItems: 'center', // Centers the spinner horizontally
        backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent background
        zIndex: 100, // Make sure it covers other elements
      },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        color:'white',
        paddingHorizontal: 0,
    },
    resultsList: {
        flex: 1,
        paddingTop: 10,
    },
    resultItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 0.5,
        borderColor: 'lightgray',
    },
    restaurantImage: {
        width: '100%',
        height: 180, // Adjust as per your requirement
        borderTopLeftRadius: 10, // Match card's border radius
        borderTopRightRadius: 10, // Match card's border radius
      },
      restaurantDetails: {
        padding: 10, // Padding inside the details container
      },
      restaurantName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333', // Dark color for contrast
      },
      restaurantInfo: {
        fontSize: 14,
        color: '#757575', // A lighter shade for less important text
        marginTop: 5,
      },
    restaurantPrice: {
      fontSize: 16,
      color: 'green',
      marginTop: 5,
      fontWeight: '500',
    },
    icon: {
      width: 20,
      height: 20,
      marginLeft: 5,
      marginRight: 10,
  },
  microphoneIcon: {
    width: 40,
    height: 40,
    marginLeft: 5,


},
recentSearchesLabel: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 10, // Space between the label and chips
  marginLeft: 10,
},
chipsContainer: {
  flexDirection: 'row', // Align chips in a row
  flexWrap: 'wrap', // Enable wrapping for overflow
  justifyContent: 'flex-start', // Start alignment of chips
  alignItems: 'flex-start', // Align items to the start
  marginVertical: 5,
  paddingHorizontal: 10,
  
},

chip: {
  margin: 5,
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 20
},
chipPressed: {
  backgroundColor: 'darkgrey', // Or any other color you want for the feedback
},
  restaurantCard: {
    flexDirection: 'column',
    backgroundColor: '#fff', // A clean white background
    borderRadius: 10, // Rounded corners
    borderWidth: 2, // Slightly thicker border for prominence
    borderColor: '#FF5722', // Choose a vibrant color for the border
    overflow: 'hidden', // Ensures nothing overflows from the card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginVertical: 12, // Vertical spacing between cards
    marginHorizontal: 10, // Horizontal spacing from screen edges
  },
  voiceSearchOverlay: {
    ...StyleSheet.absoluteFillObject, // Fill the entire parent view
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000, // Ensure it's above other content
  },
  pulseCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginBottom: 20,
   
  },
  listeningText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
    
  },
  transcribedText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
   
  },
  stopListeningButton: {
    backgroundColor: '#ff5252',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
   
  },
  stopListeningButtonText: {
    color: 'white',
    fontSize: 18,
    
  },

  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9', // Light grey background
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20, // Space between text and image
    color: '#333', // Dark grey for contrast
  },
  noResultsImage: {
    width: 150, // Adjust the size as needed
    height: 150, // Adjust the size as needed
    resizeMode: 'contain', // Ensures the image fits within the dimensions
  },
  
  restaurantAddress: {
    fontSize: 14,
    color: '#666', // You can choose a color that fits your design
    marginTop: 5, // Spacing from the restaurant name
    marginBottom: 10, // Spacing before other details
},
  
  restaurantRating: {
    fontSize: 20,  // You can adjust this as needed
    marginTop: 5,
    // ... other styling properties you'd like to apply ...
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
},
orderButton: {
  backgroundColor: '#004D40', // A professional dark teal color
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
  alignItems: 'center', // Center the text inside the button
  justifyContent: 'center',
  elevation: 2, // Adds a subtle shadow on Android
  shadowColor: '#000', // Also for iOS shadow
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 1.5,
  marginTop: 10, // Give some space from other elements
},
loaderContainer: {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: [{ translateX: -50 }, { translateY: -50 }], // Center the loader
  alignItems: 'center',
  color:'white'
},
orderButtonText: {
  color: 'white', // White color for the text
  fontSize: 16,
  fontWeight: '600', // Semi-bold
},
sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  cuisineCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E0', // Light background color for cuisine card
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    borderColor: '#FFB74D', // Border color
    borderWidth: 1, // Border width
  },
  
  cuisineImage: {
    width: 100, // Adjust as per your design
    height: 100, // Adjust as per your design
    borderRadius: 25, // Circular image
  },
  cuisineText: {
    marginTop: 5,
  },
  menuImage: {
    width: 300,
    height: 400,
  }
});
  export default SearchResultsScreen;