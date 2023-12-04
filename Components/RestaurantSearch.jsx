import React, { useEffect, useState, useRef,useCallback } from 'react';
import { RefreshControl,ImageBackground,Alert,Animated,View, TextInput, Button, StyleSheet, Text,Image,FlatList,TouchableOpacity,ScrollView,Modal,Linking, StatusBar} from 'react-native';
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



const RestaurantSearch = (props,item) => {
  const filledHeart = require('../Images/filledheart.png');  // replace with your actual path
const unfilledHeart = require('../Images/unfillledheart.png');  // replace with your actual path
  const navigation = useNavigation();
  // const [deviceLocation, setDeviceLocation] = useState({
  //   latitude: null,
  //   longitude: null,
  // });
  const [refreshing, setRefreshing] = useState(false);
  const [data,setData]=useState(null);

  const [restaurantLocation, setRestaurantLocation] = useState({
    latitude: null,
    longitude: null,
  });
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
  const [likedRestaurants, setLikedRestaurants] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [liked, setLiked] = React.useState(false);
  const [myData,SetMyData] = useState([]);
  //console.log("myData =",myData);
  
  const [places, setPlaces] = useState([]);

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
const [filters, setFilters] = useState({
  vegan: false,
  openNow: false,
  priceLevel: null,
  // Add more filters here...
});
const { deviceLocation,setDeviceLocation,mapKey,setMapKey,token,setToken } = useItems(); 



//console.log("Device Location=",deviceLocation.latitude);
  const prevRestaurantLocationRef = useRef();

  const animatedValue = useRef(new Animated.Value(0)).current;

  const { favourites, setFavourites,saveFavouritesToStorage,removeFavourite,lastRemovedFavouriteId } = useFavourites();

  

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
  if (lastRemovedFavouriteId === item.id) {
    // Trigger the animation to show the unfilled heart
    Animated.spring(animatedValue, {
      toValue: likedRestaurants[id] ? 0 : 1, // assuming 0 is the value for an unfilled heart
      useNativeDriver: false,
    }).start();
  }
}, [lastRemovedFavouriteId, item.id, animatedValue]);


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
  //name: place.name,

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
  
  const menuCardDataset = {
    "Papa Johns": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fmenuprices.pk%2Fpapa-johns-johar-town%2F&psig=AOvVaw35qbOpXJJJ2W7t5qgTK6kx&ust=1698098746416000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCNDBgffUioIDFQAAAAAdAAAAABAE",
    "McDonald's": "https://b.zmtcdn.com/data/menus/651/18825651/1c8b5bbc79c6c0be6d76424d4771220b.jpg",
    "Pizza Cottage":"https://scontent.flhe3-2.fna.fbcdn.net/v/t39.30808-6/245218319_173420301617231_9147399596934600362_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHQTK4z2UvncSnvsQztwMlp5e4op2yXmDrl7iinbJeYOlXuNW2oHMYj1wrj_jUcztGkSGk2zLL40092c6Op_N3t&_nc_ohc=sQ8h3-WB2aMAX9hzuF4&_nc_ht=scontent.flhe3-2.fna&oh=00_AfBQkdl-eyG_f3rPGz1Pn1kSoIbfJqDxv_-4wzbifxufQA&oe=653B6E00",
    "Yousaf Broast": "https://scontent.flhe9-1.fna.fbcdn.net/v/t1.6435-9/120602424_1219859395050575_2434868366877103612_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=7f8c78&_nc_ohc=3RQSnnB-XgYAX-FOK5w&_nc_ht=scontent.flhe9-1.fna&oh=00_AfCi7pL1e7Tg9hEH7ulVvbUiY8l_qzX0aw9zNkx-6Ss3Jw&oe=656057B3",

};
const getMatchingMenuUrl = (searchTerm) => {
  console.log(`Searching for term: ${searchTerm}`);
  const lowerCaseSearchTerm = searchTerm.toLowerCase().split(' ');

  const matchingRestaurant = Object.keys(menuCardDataset).find(restaurantName => {
    const lowerCaseRestaurantName = restaurantName.toLowerCase();
    return lowerCaseSearchTerm.some(term => lowerCaseRestaurantName.includes(term));
  });

  console.log(`Found matching restaurant: ${matchingRestaurant}`);
  setMenuUrl(matchingRestaurant ? menuCardDataset[matchingRestaurant] : 'default_menu_image_uri');
};






const handleMenuButtonClick = async (item,lati,longi) => {
  let menuCategory = '';
  
  if (item.name.includes('pizza')||item.name.includes('Pizza')) {
    menuCategory = 'Pizza';
    console.log("Fetching Pizza menu"); // Debugging statement
  } else if (item.name.includes('burger')||item.name.includes('Burger')) {
    menuCategory = 'Burger';
  } else if (item.name.includes('BBQ')||item.name.includes('bbq')) {
    menuCategory = 'BBQ';
  } 
  else if (item.name.includes('Biryani')||item.name.includes('biryani')) {
    menuCategory = 'Biryani';
  } 

  // If no keyword matches, set menuCategory to 'All' or keep it empty
  // depending on how your server handles fetching all menus.
  if (!menuCategory) {
    menuCategory = 'All';  // Modify this as per your server's requirement
  }

  try {
    console.log(`Fetching menu for category: ${menuCategory}`); // Debugging statement
    const menuData = await fetchMenuFromServer(menuCategory);
    //console.log("Menu Data:", JSON.stringify(menuData, null, 2));
    NavigateToMenuScreen(menuData,lati,longi);
    //console.log(menuData);
  } catch (error) {
    console.error("Failed to fetch menu data:", error);
  }
}


const NavigateToMenuScreen = (menuData,lati,longi)=>{
  console.log("Navigating to MenuScreen with data:", menuData); // Debugging statement
  navigation.navigate('MenuScreen', { menuData: menuData,lati:lati,longi:longi });
}


const handleApplyFilters = async () => {
  // Base URL for Google Places API
  const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=25000&type=restaurant&key=${api_key}`;

  // Your API key
  const apiKey = 'AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U';

  // Other necessary parameters for your API call
  const location = `${latitude},${longitude}`;  // replace with actual lat and long
  const radius = '5000';  // replace or adjust as necessary

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
const BASE_URL = "https://maps.googleapis.com/maps/api/place";
const API_KEY = "AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U"; // Replace with your actual API key

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


const fetchNearbyPlaces = (latitude, longitude, searchTerm) => {
  const params = {
    query: searchTerm,
    location: `${latitude},${longitude}`,
    radius: 1500,
    key: API_KEY
  };
  
  return axios.get(`${BASE_URL}/textsearch/json`, { params });
};


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
  

  

  useEffect(() => {
    const loadSearchedRestaurants = async () => {
      try {
        //console.log('Current state of searchedRestaurants:', searchedRestaurants);
        const storedSearchedRestaurants = await AsyncStorage.getItem('searchedRestaurants');
        //console.log('Initial Load:', storedSearchedRestaurants);
        if (storedSearchedRestaurants) {
          setSearchedRestaurants(JSON.parse(storedSearchedRestaurants));
          searchedRestaurants.forEach((restaurant, index) => {
            //console.log(`Contact details for restaurant at index ${index}:`, restaurant.contactDetails);
            //console.log(`Phone for restaurant at index ${index}:`, restaurant.contactDetails?.phone);
          });
        }
      } catch (error) {
        console.error('Failed to load previously searched restaurants:', error);
      }
    };
    loadSearchedRestaurants();
  }, []);


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

    console.log("mapCenter changed:", mapCenter);
  }, [restaurantLocation, mapCenter]);


  useEffect(() => {
    //console.log('Searched Restaurants State:', searchedRestaurants);
  }, [searchedRestaurants]);

  useEffect(() => {
    // Get the previous restaurantLocation from the ref
    const prevRestaurantLocation = prevRestaurantLocationRef.current;

    // Check if the location has truly changed
    if (
      !prevRestaurantLocation || 
      (prevRestaurantLocation.latitude !== restaurantLocation.latitude ||
       prevRestaurantLocation.longitude !== restaurantLocation.longitude)
    ) {
      if (restaurantLocation.latitude && restaurantLocation.longitude) {
        fetchRestaurants(restaurantLocation.latitude, restaurantLocation.longitude);
      }
    }

    // Update the ref with the current restaurantLocation
    //prevRestaurantLocationRef.current = restaurantLocation;
  }, [restaurantLocation]);

  useEffect(() => {
    console.log("mapCenter changed:", mapCenter);  // Debugging line
  }, [mapCenter]);

  useEffect(() => {
    const latitude = restaurantLocation.latitude || deviceLocation.latitude;
    const longitude = restaurantLocation.longitude || deviceLocation.longitude;
    console.log("Latitude:", latitude, "Longitude:", longitude);
    if (latitude && longitude) {
      fetchRestaurants(latitude, longitude)
        .then(newResults => {
          setResults(newResults);
          const topRated = newResults
            .filter(restaurant => restaurant.rating >= 4.3)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 10);
          setTop10RatedRestaurants(topRated);
        })
        .catch(error => {
          console.error('Error in fetching:', error);
        });
    }
  }, [restaurantLocation, deviceLocation]); 

  // const handleSearch = async (restaurantName) => {
  //   if (restaurantName) {
  //     fetchRestaurants(location.latitude, location.longitude);
  //   } else {
  //     setResults([]);  // Clear the results if no restaurant name is given
  //   }
  // };

  const handleCallPress = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== 'Not available') {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      console.warn("No phone number available or phone number is 'Not available'");
    }
  };
  
  const handleSearch = async (searchTerm) => {
    return new Promise(async (resolve, reject) => {
      console.log('handleSearch called'); 
  
      if (!searchTerm) {
        console.warn("Search term parameter is missing");
        return reject(new Error("Search term parameter is missing"));
      }
      //const api_key = 'AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U';
       const location = deviceLocation;

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
        console.log("data:",data);
        //setMyData(response.data);
        const detailedPromises = data.results.map(place => fetchDetailedInfo(place.place_id));
        const detailedResults = await Promise.all(detailedPromises);
  
        if (data.results.length > 0) {
          //console.log('API response:', response);
          
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

const onRestaurantCardClick = (restaurantLatitude, restaurantLongitude) => {
  setRestaurantLocation({
    latitude: restaurantLatitude,
    longitude: restaurantLongitude
  });
};

const clearFilters = () => {
  setSelectedPrice('Any');
  setIsOpenNow(false);
  setSelectedRating(0);
}

const topRatedRestaurants = [...results]
    .filter(restaurant => restaurant.rating >= 4.3)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

    const checkIfLiked = (restaurant, likedList) => {
      return !!likedList[restaurant.id];
  }

  
  

  const fetchMenuFromServer = async (menuCategory) => {
    try {
      // Include the section in the query string if it is not 'All'
      //const sectionQuery = menuSection !== 'All' ? `&section=${menuSection}` : '';
      const response = await axios.get(`http://${API_IP_ADDRESS}/menus?category=${menuCategory}`);
      if (response.data) {
        return response.data;
      } else {
        console.warn('No menu data found for the category');
        return null;
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      return null;
    }
};
  



const renderRestaurant = ({ item }) => {
  
  const isLiked = !!likedRestaurants[item.id];
  //console.log("Menu URL:", menuUrl);
  //console.log("Results:", results);
  if (item && item.name) {
    if (!restaurantName || item.name.toLowerCase().includes(restaurantName.toLowerCase())) {
      return (
        
        <View>
          <TouchableOpacity 
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
          >
            <Image 
              source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'default_image_uri' }} 
              style={styles.restaurantImage} 
              resizeMode="cover"
            />
            <View style={styles.restaurantDetails}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.restaurantName}>{item.name}</Text>
 {/* Add Animated Heart Icon here */}
 <Animated.View
  style={{
    marginTop: 10, // Adding a top margin to move the heart image down
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.5], // scale from 1 to 1.5 when liked
        }),
      },
    ],
  }}
>
<TouchableOpacity onPress={() => {
    const wasLikedBefore = likedRestaurants[item.id];
    toggleLike(item.id);  // This will toggle the like state for the restaurant.
    toggleFavourite(item);  // This will add or remove the restaurant from favourites.
    
    // Display alert based on whether the restaurant was added or removed.
    if (wasLikedBefore) {
        Alert.alert('Notification', `${item.name} removed from favourites!`);
    } else {
        Alert.alert('Favourite', `${item.name} saved as favourite!`);
    }
}}>
<Image
            source={isLiked ? filledHeart : unfilledHeart}
            style={{ width: 24, height: 24 }}
          />
</TouchableOpacity>
</Animated.View>
</View>

              <Text style={styles.restaurantInfo}>Price: {mapPriceLevelToText(item.price_level || 'default')}</Text>

              <StarRating rating={item.rating || 0} />
 {/* Here is the new call button */}
              {item.contactDetails && item.contactDetails.phone ? (
  <TouchableOpacity onPress={() => handleCallPress(item.contactDetails.phone)} style={{ alignItems: 'flex-start' }}>
    <Image 
      source={require('../Images/call.png')} 
      style={{ width: 50, height: 50 }}
    />
    <Text style={{ marginTop: 5,marginLeft:10 }}>Call</Text>
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
          </TouchableOpacity>

          {/* Modal to show the menu card */}
          <Modal
    animationType="slide"
    transparent={true}
    visible={isMenuModalVisible}
    onRequestClose={() => {
        setMenuModalVisible(false);
    }}
>
    <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center'}}>
        
        {/* Adding the clickable cross image on the top right corner */}
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
</Modal>
        </View>
      );
    }
  }
  return null;
};


const fetchData = async () => {
  try {
    // Example URL for Google Places API (adjust parameters as needed)
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=YOUR_LATITUDE,YOUR_LONGITUDE&radius=5000&type=restaurant&key=${API_KEY}`;
    
    const response = await fetch(url);
    const jsonData = await response.json();
    
    if (jsonData.results) {
      setData(jsonData.results);
    } else {
      throw new Error('No data found');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  fetchData().then(() => setRefreshing(false));
  setRestaurantName('');
}, []);


  

return (
  
  
  
  <FavouritesProvider>  
    
    
  <ScrollView style={styles.container}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  }>
  <ImageBackground 
            source={backgroundImg}
            style={styles.container}
            resizeMode="cover"
        >
    <View style={styles.searchForm}>
      <View style={styles.topBar}>
      <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
    <Image source={require('../Images/menuIcon.png')} style={styles.icon} />
  </TouchableOpacity>
  <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 80  }}>
  <Text style={styles.universityName}>          Comsats University</Text>
  <Text style={styles.universityName}>      Lahore</Text>
</View>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => {
            handleSearch(restaurantName);
            setRestaurantName('');} }>
            <Image source={require('../Images/whiteSearch.png')} style={styles.icon} />
          </TouchableOpacity>
          <TextInput
            placeholder="Search for restaurants, cuisines and cafes"
            placeholderTextColor="lightgray" // This sets the placeholder text to a gray color
            style={styles.searchInput}
            onChangeText={text => setRestaurantName(text)}
            value={restaurantName}
          />
          <Text style={styles.divider}>|</Text>
          <TouchableOpacity onPress={() => setIsVisible(true)}>
         <Image source={require('../Images/whiteFilter.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      

      <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 20 }}>Filter</Text>

          {/* Price Filter */}
          <Text>Price</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {['Any', '$', '$$', '$$$', '$$$$'].map((price) => (
              <TouchableOpacity key={price} onPress={() => setSelectedPrice(price)}>
                <Text style={{ fontWeight: selectedPrice === price ? 'bold' : 'normal' }}>{price}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Rating Filter */}
          <Text>Rating at least</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <StarRating
    disabled={false}
    maxStars={5}
    rating={selectedRating}
    selectedStar={(rating) => setSelectedRating(rating)}
    fullStarColor={'gold'}
        />
          </View>

          {/* Hours Filter */}
          <Text>Hours</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Any</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                value={isOpenNow}
                onValueChange={setIsOpenNow}
              />
              <Text>Open now</Text>
            </View>
          </View>

          {/* Apply and Clear Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <TouchableOpacity onPress={() => { clearFilters}}>
              <Text>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {handleApplyFilters}}>
              <Text>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>


      {/* Render MapView after the search field */}
      <MapView
  style={{ height: 300 }}
  region={{
    latitude: restaurantLocation.latitude || deviceLocation.latitude,
    longitude: restaurantLocation.longitude || deviceLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
  key={mapKey}
>
        {deviceLocation.latitude && deviceLocation.longitude ? (
          <Marker
            key={`${deviceLocation.latitude}-${deviceLocation.longitude}`}
            coordinate={deviceLocation}
            title="Your Location"
          />
        ) : null}
       {restaurantLocation.latitude && restaurantLocation.longitude && (
        <Marker
          key={`${restaurantLocation.latitude}-${restaurantLocation.longitude}`}
          coordinate={restaurantLocation}
          title="Selected Restaurant"
        />
      )}

      </MapView>

      <Text style={styles.sectionTitle}>Top rated restaurants</Text>
<FlatList
  horizontal
  data={top10RatedRestaurants}
  renderItem={(props) => renderRestaurant(props, likedRestaurants)}
  keyExtractor={(item, index) => item.id ? `${item.id}-${index}` : index.toString()}
  contentContainerStyle={styles.flatListContainer} // Add this line
  initialNumToRender={10} // Number of items to render in the initial batch
  maxToRenderPerBatch={10}  // Number of items to render per batch
/>

<Text style={styles.sectionTitle}>Previously searched restaurants</Text>
<FlatList
  horizontal
  data={results} // use searchedRestaurants here
  renderItem={(props) => renderRestaurant(props, likedRestaurants)}
  keyExtractor={(item, index) => item.id ? `${item.id}-${index}` : index.toString()}
  contentContainerStyle={styles.flatListContainer} // Add this line
  initialNumToRender={5} // Number of items to render in the initial batch
  maxToRenderPerBatch={3}  // Number of items to render per batch
/>


      
    

    </View>
    </ImageBackground>
  </ScrollView>
  
  </FavouritesProvider>  
 
  
  
);
 }

        const styles = StyleSheet.create({
          
          container: {
              flex: 1,
              
              backgroundColor: 'white', // Pastel Red
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
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
          marginVertical: 10,
        },
        inputContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 0.5,
          borderColor: 'gray',
          borderRadius: 20,
          marginVertical: 10,
          overflow: 'hidden',
        },
      
        searchIcon: {
          position: 'relative',
          left: 10,
          zIndex: 1,
          width: 20,
          height: 20,
        },
        universityName: {
          textAlign: 'center',
          fontSize: 14,
          fontWeight: '500',
          color: 'lightgray', // Dark teal for contrast
      },
          searchForm: {
              flex: 1,
              paddingTop: 10,
          paddingLeft: 2,
          paddingBottom: 10,
          paddingRight: 0, // Set right padding to 0
              
          },
          searchInput: {
            flex: 1, 
            height: '100%',
            borderColor: 'transparent',
            borderWidth: 0,
            paddingLeft: 0, // space between text and search icon
            paddingRight: 30, // space to accommodate the filter icon and divider
            color: 'white', // Dark teal for contrast
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
            height: 200,
            borderRadius: 8,
            
          },
          restaurantDetails: {
              flex: 1,
          },
          restaurantName: {
            fontSize: 18,
            fontWeight: 'bold',
            marginTop: 10,
          },
          restaurantInfo: {
            fontSize: 14,
            color: 'gray',
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
        restaurantCard: {
          flexDirection: 'column',   // Added this line to arrange child components vertically.
          width: '100%',
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 4,
          backgroundColor: 'white',
          paddingTop: 10,
          paddingLeft: 0,
          paddingBottom: 10,
          paddingRight: 8, // Set right padding to 0
          marginVertical: 15,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10, // Apply right margin between cards
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
    
      orderButtonText: {
        color: 'white', // White color for the text
        fontSize: 16,
        fontWeight: '600', // Semi-bold
      },
        menuImage: {
          width: 300,
          height: 400,
        }
      });
      
         

export default RestaurantSearch;

