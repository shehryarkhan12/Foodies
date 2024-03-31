import React, { useEffect, useState, useRef,useCallback } from 'react';
import { RefreshControl,ImageBackground,Alert,Animated,View, TextInput,ActivityIndicator, Button, StyleSheet, Text,Image,FlatList,TouchableOpacity,ScrollView,Modal,Linking, StatusBar} from 'react-native';
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
import { Picker } from '@react-native-picker/picker';
import { Console } from 'console';
import { useRestaurants } from './RestaurantsContext';
import { Rating } from 'react-native-ratings'; // Import the rating component
import { useHeartAnimation } from './HeartAnimationContext';
import { MaterialIcons,MaterialCommunityIcons } from '@expo/vector-icons'; 


const RestaurantDetailsScreen = ({ route },item) => {

    const { restaurant,latitude,longitude, location,deviceLocation } = route.params;
    // Use location data as needed, for example:
// Now you can use these values
console.log("Restaurant details:", restaurant);
console.log("Latitude and Longitude:", latitude, longitude);
console.log("Location object:", location);
console.log("Device Location in ResDetails:", deviceLocation);
    console.log('Received Restaurant:', restaurant); // Debugging: Check if restaurant has the correct data

    const [reviews, setReviews] = useState([]); // State for storing reviews
    const [newReview, setNewReview] = useState('');
const [userRating, setUserRating] = useState(0);
    const { searchTerm } = route.params;
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [ratings, setRatings] = useState({}); // State to store ratings for each restaurant
    const mapRef = useRef(null);
const navigation = useNavigation();
    const filledHeart = require('../Images/filledheart.png');  // replace with your actual path
const unfilledHeart = require('../Images/unfillledheart.png');  // replace with your actual path
const { heartAnimationValues, updateHeartAnimation } = useHeartAnimation();
  // const [deviceLocation, setDeviceLocation] = useState({
  //   latitude: null,
  //   longitude: null,
  // });
  const [refreshing, setRefreshing] = useState(false);
  const [data,setData]=useState(null);

  const [mapCenter, setMapCenter] = useState(null);

  const{restaurantName,setRestuarantName} = useRestaurants();
  
  const [results, setResults] = useState([]);

 // const [mapKey, setMapKey] = useState(1);
 const [selectedDietaryOption, setSelectedDietaryOption] = useState('vegetarian'); // Default value
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
//const { deviceLocation,setDeviceLocation,mapKey,setMapKey,token,setToken,restaurantLocation} = useItems(); 
const loadingTimeoutRef = useRef(null);



  const prevRestaurantLocationRef = useRef();


  const animatedValue = useRef(new Animated.Value(0)).current;

  const { favourites, setFavourites,saveFavouritesToStorage,removeFavourite,lastRemovedFavouriteId,likedRestaurants, setLikedRestaurants } = useFavourites();

 
  // const uniqueRestaurants = restaurant.reduce((unique, item) => {
  //   return unique.find(restaurant => restaurant.id === item.id) ? unique : [...unique, item];
  // }, []);

  const toggleLike = async (id) => {
   
    setLikedRestaurants({
      ...likedRestaurants,
      [id]: !likedRestaurants[id],
    });

    if (likedRestaurants[id]) {
      removeFavourite(id);
      Alert.alert('Notification', `${restaurant.name} removed from favourites!`);
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
            Alert.alert("Error", "Failed to load liked restaurants.");
        }
    };

    loadLikedRestaurants();
}, []);

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
    if (restaurant && restaurant.id && lastRemovedFavouriteId === restaurant.id) {
      // Check if 'likedRestaurants' is defined and has the 'id' property as a key
      if (likedRestaurants && likedRestaurants.hasOwnProperty(item.id)) {
        // Trigger the animation to show the unfilled heart
        Animated.spring(animatedValue, {
          toValue: likedRestaurants[restaurant.id] ? 0 : 1, // assuming 0 is the value for an unfilled heart
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

    const submitReview = () => {
      // Add logic to submit the review
      const userReview = {
        author_name: "ShehryarKhan", // Replace with actual user name if available
        text: newReview,
        rating: userRating,
      };
      setReviews([...reviews, userReview]);
      setNewReview('');
      setUserRating(0);
    };

    // Effect hook to call fetchReviews when component mounts
  useEffect(() => {
    if (restaurant && restaurant.id) {
      fetchReviews(restaurant.id);
    }
  }, [restaurant]);

    // Function to fetch reviews from Google Places API
  const fetchReviews = async (placeId) => {
    try {
      const apiKey = 'AIzaSyDu_ikrzuCSjDJh3h0LDoz79ooMNzbKxwc'; // Replace with your API key
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;
      const response = await axios.get(url);
      console.log('API Response:', response.data); // Debugging: Log the API response
      if (response.data && response.data.result && response.data.result.reviews) {
        setReviews(response.data.result.reviews);
      } else {
        console.log('No reviews found or invalid response format');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const renderReviews = () => {
    console.log('Rendering reviews:', reviews); // Log to see if reviews are as expected
    return (
      <FlatList
        data={reviews}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewAuthor}>{item.author_name}</Text>
            <StarRating rating={item.rating} />
            <Text style={styles.reviewText}>{item.text}</Text>
          </View>
        )}
        horizontal={true} // This will make the list horizontal

      />
    );
  };


    const handleMenuButtonClick = async (item,lati,longi) => {
        setIsMenuLoading(true); // Show loader
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
        setIsMenuLoading(false); // Hide loader when done
      }
      
      
      const NavigateToMenuScreen = (menuData,lati,longi)=>{
        console.log("Navigating to MenuScreen with data:", menuData); // Debugging statement
        navigation.navigate('MenuScreen', { menuData: menuData,lati:lati,longi:longi });
      }

    const handleCallPress = (phoneNumber) => {
        if (phoneNumber && phoneNumber !== 'Not available') {
          Linking.openURL(`tel:${phoneNumber}`);
        } else {
          console.warn("No phone number available or phone number is 'Not available'");
        }
      };

      const haversineDistance = (coords1, coords2) => {
        const toRad = (x) => (x * Math.PI) / 180;
    
        const lat1 = coords1.latitude;
        const lon1 = coords1.longitude;
        const lat2 = coords2.latitude;
        const lon2 = coords2.longitude;
    
        const R = 6371; // km
        const x1 = lat2 - lat1;
        const dLat = toRad(x1);
        const x2 = lon2 - lon1;
        const dLon = toRad(x2)
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);  
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        const d = R * c; 
    
        return d;
    };

    const handleRating = (rating) => {
      setUserRating(rating);
    };
  
  const renderRestaurant = ({ item }) => {
  
    const isLiked = !!likedRestaurants[item.id];
    const handleRatingCompleted = (newRating) => {
      setRatings(prevRatings => ({ ...prevRatings, [item.id]: newRating }));
      console.log("Rating for " + item.name + " is: " + newRating);
      Alert.alert(`Thank you for rating ${item.name}`);
      // Handle the logic to send the rating to your backend
    };
    //console.log("Menu URL:", menuUrl);
    //console.log("Results:", results);

      // Assuming deviceLocation is the user's current location
      const distance = haversineDistance(deviceLocation, { latitude: item.location.coordinates[0], longitude: item.location.coordinates[1] });
    if (item && item.name) {
      if (!restaurantName || item.name.toLowerCase().includes(restaurantName.toLowerCase())) {
        return (
           

          <View>
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
  <Text style={styles.distanceText}>{distance.toFixed(2)} km away</Text>
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
          </View>
        );
      }
    }
    return null;
  };

  //console.log("Restaurant coordinates:", restaurant.location.latitude, restaurant.location.longitude);
console.log("Device coordinates:", deviceLocation.latitude, deviceLocation.longitude);
   // Use restaurant details to render the screen
return (
    <ScrollView style={styles.container}>
      {/* Top Navigation Bar */}
        
      <View style={styles.topNavBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ImageBackground source={require('../Images/arrow-left.png')} style={styles.leftArrowStyle} resizeMode="contain" />
            </TouchableOpacity>
            <Text style={styles.navBarTitle}>Restaurant Details</Text>
           
        </View>
      <MapView
      ref={mapRef}
      style={{ height: 300 }}
      region={{
        latitude: deviceLocation?.latitude || 0,
        longitude: deviceLocation?.longitude || 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      onRegionChangeComplete={region => {
        // Optionally handle region changes
      }}
    >
         {/* Marker for User's Location */}
      {deviceLocation && (
        <Marker
          coordinate={{ latitude: deviceLocation.latitude, longitude: deviceLocation.longitude }}
          title="User Location"
        />
      )}
       {/* Marker for Restaurant's Location */}
{restaurant?.location?.coordinates && (
    <Marker
        coordinate={{
            latitude: latitude,
            longitude: longitude
        }}
        title={restaurant.name || "Restaurant Location"}
        pinColor='orange'
    />
)}
    </MapView>
             
    <View>
        <Picker
          selectedValue={selectedDietaryOption}
          onValueChange={(itemValue, itemIndex) => setSelectedDietaryOption(itemValue)}>
          <Picker.Item label="Vegetarian" value="vegetarian" />
          <Picker.Item label="Vegan" value="vegan" />
          {/* ... other options ... */}
        </Picker>
      </View>
          <View style={styles.card}>
           {renderRestaurant({ item: restaurant })}
          </View>

           {/* Render reviews */}
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 18, margin: 10 }}>User Reviews</Text>
        {renderReviews()}
      </View>

      <View style={styles.addReviewContainer}>
  <TextInput
    style={styles.reviewInput}
    placeholder="Write a review..."
    value={newReview}
    onChangeText={setNewReview}
  />
  <View style={styles.ratingRowContainer}>
  <Text style={styles.addRatingText}>Add Rating: {userRating.toFixed(1)}</Text>
  <Rating
    type="star"
    ratingCount={5}
    imageSize={30}
    startingValue={userRating}
    onFinishRating={setUserRating}
    style={styles.ratingStyle} // Apply the custom style
  />
</View>
  <TouchableOpacity onPress={submitReview} style={styles.submitButton}>
  <Text style={styles.submitButtonText}>Add Review</Text>
</TouchableOpacity>

</View>
      
    </ScrollView>
  );
  
  };


  const styles = StyleSheet.create({
   

    map: {
      width: '100%',
      height: 200, // Adjust as needed
    },
    container: {
        flex: 1,
        
        backgroundColor: 'white', 
    },
    topNavBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF',
      paddingHorizontal: 10,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
      zIndex: 5, // Ensure this is less than the cart icon's zIndex
    },
    backButton: {
      marginRight: 15, // Space between the back button and the title
  },
  leftArrowStyle: {
    width: 40,  // Adjust size as needed
    height: 40,
},
navBarTitle: {
  fontSize: 25,
  fontWeight: 'bold',
  color:'red'
  // Adjust other styling as needed
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
        paddingHorizontal: 15, // Add some horizontal padding
        paddingTop:15
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
    ratingRowContainer: {
      flexDirection: 'row', // Align items horizontally
      alignItems: 'flex-start',
      marginVertical:8 
     
      // Add any additional padding or margins as needed
    },
    submitButton: {
      backgroundColor: 'red', // Example background color
      padding: 10, // Example padding
      borderRadius: 5, // Example border radius
      alignItems: 'center', // Center the text horizontally
    },
    submitButtonText: {
      color: 'white', // Example text color
      fontSize: 16, // Example font size
    },
    reviewCard: {
      backgroundColor: '#ffffff', // Use a light background color
      borderRadius: 8,
      padding: 10,
      marginHorizontal: 5,
      width: 250, // Adjust width as needed
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3, // Adds a subtle shadow for depth
      borderWidth: 1,
      borderColor: '#ddd', // Light border color
    },
    reviewAuthor: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#333', // Dark color for the author's name
      marginBottom: 5, // Spacing between author's name and review text
    },
    reviewText: {
      fontSize: 14,
      color: '#555', // Dark grey for readability
      textAlign: 'justify', // Justify the review text
    },
    addReviewContainer: {
      padding: 10,
      backgroundColor: '#fff',
    },
    reviewInput: {
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    ratingStyle: {
      // Add your custom styles here
     
      // You can add margins, background color, etc.
    },
    
    addRatingText: {
        marginTop: 5, // Space between text and rating stars
        fontWeight: '600', // Semi-bold for emphasis
        fontSize: 20, // Appropriate font size for readability
        color: '#333', // Dark grey for contrast
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
export default RestaurantDetailsScreen;