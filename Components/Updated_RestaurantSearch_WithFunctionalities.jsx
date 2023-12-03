import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Text,Image,FlatList,TouchableOpacity,ScrollView,Modal, ImageBackground } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Zoom from './Zoom';

import StarRating from './StarRating'; 


const RestaurantSearch = () => {
  
  const [deviceLocation, setDeviceLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [restaurantLocation, setRestaurantLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [mapCenter, setMapCenter] = useState(null);

  const [restaurantName, setRestaurantName] = useState("");
  
  const [results, setResults] = useState([]);

  const [mapKey, setMapKey] = useState(1);

  const [isMenuModalVisible, setMenuModalVisible] = useState(false);

  const [menuUrl, setMenuUrl] = useState('default_menu_image_uri');

  const [searchedRestaurants, setSearchedRestaurants] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  const prevRestaurantLocationRef = useRef();

  
  
  const mapPriceLevelToText = (priceLevel) => {
    switch (priceLevel) {
      case 0:
        return 'Free';
      case 1:
        return '100 - 500 PKR per person';
      case 2:
        return '500 - 1500 PKR per person';
      case 3:
        return '1500 - 3000 PKR per person ';
      case 4:
        return '3000 PKR and above per person';
      default:
        return '100 - 500 PKR per person';
    }
  };
  //name: place.name,

  const debounce = (func, delay) => {
    let inDebounce;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
  };

  function getRandomRating(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  const menuCardDataset = {
    "Papa Johns": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fmenuprices.pk%2Fpapa-johns-johar-town%2F&psig=AOvVaw35qbOpXJJJ2W7t5qgTK6kx&ust=1698098746416000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCNDBgffUioIDFQAAAAAdAAAAABAE",
    "McDonald's": "https://b.zmtcdn.com/data/menus/651/18825651/1c8b5bbc79c6c0be6d76424d4771220b.jpg",
    "Pizza Cottage":"https://scontent.flhe3-2.fna.fbcdn.net/v/t39.30808-6/245218319_173420301617231_9147399596934600362_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHQTK4z2UvncSnvsQztwMlp5e4op2yXmDrl7iinbJeYOlXuNW2oHMYj1wrj_jUcztGkSGk2zLL40092c6Op_N3t&_nc_ohc=sQ8h3-WB2aMAX9hzuF4&_nc_ht=scontent.flhe3-2.fna&oh=00_AfBQkdl-eyG_f3rPGz1Pn1kSoIbfJqDxv_-4wzbifxufQA&oe=653B6E00"
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






const handleMenuButtonClick = (item) => {
  console.log("Current item:", JSON.stringify(item));
  console.log("Current item.id:", item?.id);
  console.log("Current menuUrl:", item?.menuUrl || 'default_menu_image_uri');

  // Get the restaurant name from the clicked item
  const restaurantName = item.name;
  
  // Debug log
  console.log(`Restaurant Name: "${restaurantName}"`);

  // Debug: Check if restaurantName exists in menuCardDataset keys
  if (Object.keys(menuCardDataset).includes(restaurantName)) {
    console.log("restaurantName exists in menuCardDataset");
  } else {
    console.log("restaurantName does NOT exist in menuCardDataset");
  }

  // Call the getMatchingMenuUrl function to set the menuUrl
  getMatchingMenuUrl(restaurantName);
  setMenuModalVisible(true);
};


  

  const onRestaurantCardClick = (restaurantLatitude, restaurantLongitude) => {
    setRestaurantLocation({
      latitude: restaurantLatitude,
      longitude: restaurantLongitude
    });
  };

  

  const fetchRestaurants = async (latitude, longitude) => {
    const api_key = 'AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U';
    const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=restaurant&key=${api_key}`;
    
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if ('results' in data) {
        const restaurants = data.results.map(place => ({
          id: place.place_id,
          name: place.name || 'Not available',
          address: place.vicinity || 'Not available',
          contactDetails: {
            phone: place.formatted_phone_number || 'Not available',  // Requires more detailed request
            email: 'Not available',  // Not provided by API
            website: place.website || 'Not available',  // Requires more detailed request
          },
          openingHours: {
            // Requires more detailed request
            // You would typically loop through the API's array to populate this
          },
          images: place.photos ? place.photos.map(photo => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${api_key}`) : [],
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
        }));
        setResults(restaurants);
      } else {
        console.error('Results key missing in API data:', data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

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
    const loadSearchedRestaurants = async () => {
      try {
        const storedSearchedRestaurants = await AsyncStorage.getItem('searchedRestaurants');
        console.log('Initial Load:', storedSearchedRestaurants);
        if (storedSearchedRestaurants) {
          setSearchedRestaurants(JSON.parse(storedSearchedRestaurants));
        }
      } catch (error) {
        console.error('Failed to load previously searched restaurants:', error);
      }
    };
    loadSearchedRestaurants();
  }, []);

  useEffect(() => {
    console.log('Searched Restaurants State:', searchedRestaurants);
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
    console.log("Results Array: ", results);  // Point 1
    const topRatedRestaurants = [...results]
      .filter(restaurant => {
        console.log("Checking restaurant rating: ", restaurant.rating);  // Point 3 & 4
        return restaurant.rating >= 4.3;
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
    
    console.log("Top Rated Restaurants: ", topRatedRestaurants);  // Point 2 & 5
  }, [results]);

  // const handleSearch = async (restaurantName) => {
  //   if (restaurantName) {
  //     fetchRestaurants(location.latitude, location.longitude);
  //   } else {
  //     setResults([]);  // Clear the results if no restaurant name is given
  //   }
  // };
  
  const handleSearch = debounce(async (restaurantName) => {
    console.log('handleSearch called'); // Debugging line

    if (!restaurantName) {
        console.warn("Restaurant name parameter is missing");
        return;
    }

    console.log("Searching restaurants by name:", restaurantName);

    console.log('Location:', restaurantLocation); // Debugging line

    const params = {
      name: String(restaurantName),
      latitude: restaurantLocation?.latitude || deviceLocation.latitude,
      longitude: restaurantLocation?.longitude || deviceLocation.longitude
  };
    console.log(typeof restaurantName);
    console.log('Sending parameters:', params);

    try {
  const response = await api.get('/search', { params });
  if (response.data && response.data.length > 0) {
    console.log('API response:', response); 
    setResults(response.data);  // Update only if new data exists
    
    const newSearchedRestaurants = [...searchedRestaurants, ...response.data];
    setSearchedRestaurants(newSearchedRestaurants);
    
    await AsyncStorage.setItem('searchedRestaurants', JSON.stringify(newSearchedRestaurants));
  } else {
    console.log('No restaurants found for the current search, keeping the previous state.');
    // Do not update setResults or setSearchedRestaurants
  }
} catch (error) {
  console.error('API Error:', error);
}
},500);

const topRatedRestaurants = [...results]
    .filter(restaurant => restaurant.rating >= 4.3)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);


const renderRestaurant = ({ item }) => {
  
  //console.log("Menu URL:", menuUrl);
  //console.log("Results:", results);
  if (item && item.name) {
    if (!restaurantName || item.name.toLowerCase().includes(restaurantName.toLowerCase())) {
      return (
        <View>
          <TouchableOpacity 
            onPress={() => {
              if (item.location && item.location.coordinates) {
                const [longitude, latitude] = item.location.coordinates;
                onRestaurantCardClick(latitude, longitude);
                setMapCenter({
                  latitude,
                  longitude,
                });
                setMapKey(prevKey => prevKey + 1);
              } else {
                console.warn("Location or coordinates are undefined for this item:", item);
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
              <Text style={styles.restaurantName}>{item.name}</Text>
              <Text style={styles.restaurantInfo}>Price: {mapPriceLevelToText(item.price_level || 'default')}</Text>
              <StarRating rating={item.rating || 0} />
              <Button 
                title="Check Menu Card" 
                onPress={() => handleMenuButtonClick(item)}
              />
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





  

return (
  
      
  <ScrollView style={styles.container}>
    <View style={styles.searchForm}>
      <View style={styles.topBar}>
        <Image source={require('../Images/menu.png')} style={styles.icon} />
        <Text style={styles.universityName}>Comsats University Lahore</Text>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => handleSearch(restaurantName)}>
            <Image source={require('../Images/search.png')} style={styles.icon} />
          </TouchableOpacity>
          <TextInput
            placeholder="Search for restaurants, cuisines"
            style={styles.searchInput}
            onChangeText={text => setRestaurantName(text)}
            value={restaurantName}
          />
          <Text style={styles.divider}>|</Text>
          <Image source={require('../Images/filter.png')} style={styles.icon} />
        </View>
      </View>

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
        data={topRatedRestaurants}
        renderItem={renderRestaurant}
        keyExtractor={item => item.id}
        initialNumToRender={10} // Number of items to render in the initial batch
  maxToRenderPerBatch={5}  // Number of items to render per batch
      />

      <Text style={styles.sectionTitle}>Previously searched restaurants</Text>
      <FlatList
  horizontal
  data={searchedRestaurants} // use searchedRestaurants here
  renderItem={renderRestaurant}
  keyExtractor={item => item.id}
  initialNumToRender={20} // Number of items to render in the initial batch
  maxToRenderPerBatch={5}  // Number of items to render per batch
/>
    </View>
  </ScrollView>
  
);
 }

        const styles = StyleSheet.create({
          container: {
              flex: 1,
              backgroundColor: 'white',
          },
          topBar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
            borderBottomWidth: 0.5,
            borderColor: 'lightgray',
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
          flex: 1,
          textAlign: 'center',
          fontSize: 14,
          fontWeight: '500',
          color: 'black',
      },
          searchForm: {
              flex: 1,
              padding: 15,
          },
          searchInput: {
            flex: 1, 
            height: '100%',
            borderColor: 'transparent',
            borderWidth: 0,
            paddingLeft: 10, // space between text and search icon
            paddingRight: 30, // space to accommodate the filter icon and divider
          },
          
          filterIcon: {
            position: 'absolute',
            right: 20,
            zIndex: 1,
            width: 20,
            height: 20,
          },
          sectionTitle: {
              fontSize: 18,
              fontWeight: 'bold',
              marginVertical: 10,
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
            marginRight: 5,
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
          padding: 10,
          marginVertical: 15,
          alignItems: 'center',
          justifyContent: 'center',
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
        menuImage: {
          width: 300,
          height: 400,
        }
      });
      
         

export default RestaurantSearch;

