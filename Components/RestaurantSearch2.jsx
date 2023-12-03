import React, { useEffect, useState, useRef,useCallback } from 'react';
import { Alert,Animated,View, TextInput, Button, StyleSheet, Text,Image,FlatList,TouchableOpacity,ScrollView,Modal,Linking} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Checkbox from 'expo-checkbox';
import { FavouritesProvider } from './favouritesContext';
import { useRoute } from "@react-navigation/native";
import StarRating from './StarRating'; 
import  handleSearch  from './functionsanduseEffectsInRestaurantSearch/handleSearch';
import renderRestaurant from './functionsanduseEffectsInRestaurantSearch/renderRestaurant';
import {fetchRestaurants}  from './functionsanduseEffectsInRestaurantSearch/fetchRestaurants';
import { useLoadLikedRestaurants } from './functionsanduseEffectsInRestaurantSearch/useLoadLikedRestaurants';
import { useAnimateFavouriteToggle } from './functionsanduseEffectsInRestaurantSearch/useAnimateFavouriteToggle';
import { useFetchDeviceLocation } from './functionsanduseEffectsInRestaurantSearch/useFetchDeviceLocation';
import { useSearchedRestaurantsState } from './functionsanduseEffectsInRestaurantSearch/useSearchedRestaurantsState';
import { useRestaurantLocationChange } from './functionsanduseEffectsInRestaurantSearch/useRestaurantLocationChange';
import { useMapCenterChangeDebug } from './functionsanduseEffectsInRestaurantSearch/useMapCenterChangeDebug';
import { useFetchRestaurantsOnLocationChange } from './functionsanduseEffectsInRestaurantSearch/useFetchRestaurantsOnLocationChange';
import  {useLoadSearchedRestaurants } from './functionsanduseEffectsInRestaurantSearch/useLoadSearchedRestaurants';
import { useNavigation } from '@react-navigation/native';
import { useFavourites } from './favouritesContext';
import { useItems } from './ItemsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useSearchedRestaurants } from './functionsanduseEffectsInRestaurantSearch/useSearchedRestaurants';
import { useFetchRestaurantsOnMount } from './functionsanduseEffectsInRestaurantSearch/useFetchRestaurantsOnMount';


const RestaurantSearch2 = (props,item) => {

    const [restaurantName, setRestaurantName] = useState("");
    [searchTerm, setSearchTerm] = useState(""); // Define searchTerm state
    //const [searchedRestaurants, setSearchedRestaurants] = useState([]);
    //console.log("Searched restaurant= ",searchedRestaurants);;
    const [top10RatedRestaurants, setTop10RatedRestaurants] = useState([]);
    //console.log("top10= ",top10RatedRestaurants);
    const [likedRestaurants, setLikedRestaurants] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [isOpenNow, setIsOpenNow] = useState(false);
    const [mapCenter, setMapCenter] = useState({ latitude: null, longitude: null });
    const [results, setResults] = useState([]);
    //const [lastRemovedFavouriteId, setLastRemovedFavouriteId] = useState(null);
    const [itemId, setItemId] = useState(null);
    //const [isLiked, setIsLiked] = useState(false);
    const navigation = useNavigation();
  // const [deviceLocation, setDeviceLocation] = useState({
  //   latitude: null,
  //   longitude: null,
  // });
  const [restaurantLocation, setRestaurantLocation] = useState({
    latitude: null,
    longitude: null,
  });
  
  const prevRestaurantLocationRef = useRef();
  const { deviceLocation,setDeviceLocation,mapKey,setMapKey,token,setToken } = useItems(); 
  const { favourites, setFavourites,saveFavouritesToStorage,removeFavourite,lastRemovedFavouriteId } = useFavourites();
  const isLiked = !!likedRestaurants[item.id];
  const animatedValue = useRef(new Animated.Value(0)).current;

  



    useLoadLikedRestaurants();
    useAnimateFavouriteToggle(lastRemovedFavouriteId, itemId, isLiked);
     useFetchDeviceLocation(setDeviceLocation, restaurantLocation);
    //  useEffect(() => {
    //     const latitude = restaurantLocation.latitude || deviceLocation.latitude;
    //     const longitude = restaurantLocation.longitude || deviceLocation.longitude;

    //     if (latitude && longitude) {
    //         fetchRestaurants(latitude, longitude)
    //             .then(newResults => {
    //                 setResults(newResults);
    //                 const topRated = newResults.filter(restaurant => restaurant.rating >= 4.3)
    //                                           .sort((a, b) => b.rating - a.rating)
    //                                           .slice(0, 10);
    //                 setTop10RatedRestaurants(topRated);
    //             })
    //             .catch(error => {
    //                 console.error('Error in fetching:', error);
    //             });
    //     }
    // }, [restaurantLocation,deviceLocation]); // Depend on location props

    //const { results, top10RatedRestaurants } = useFetchRestaurantsOnMount(restaurantLocation, deviceLocation);
     const { searchedRestaurants,setSearchedRestaurants, loading } = useSearchedRestaurants();

    
    //useLoadSearchedRestaurants(setSearchedRestaurants);
    //useSearchedRestaurantsState(searchedRestaurants);
    useRestaurantLocationChange(restaurantLocation, prevRestaurantLocationRef);
     useMapCenterChangeDebug(mapCenter);
     const onSearchPress = async () => {
        if (!deviceLocation || deviceLocation.latitude === undefined || deviceLocation.longitude === undefined) {
            console.error("Device location is not defined or is missing latitude/longitude");
            return; // Stop further execution
        }
        handleSearch(restaurantName, searchTerm, deviceLocation, setResults, setSearchedRestaurants, searchedRestaurants)
            .then(newResults => {
                // Update searchedRestaurants with new results
                setSearchedRestaurants(newResults);
            })
            .catch(error => {
                // Handle error
                console.error('Search error:', error);
            });
    };

    
     console.log("Device Location lati=",deviceLocation.latitude);
     console.log("Device Location longi=",deviceLocation.longitude);
    //useFetchRestaurantsOnLocationChange(setResults, setTop10RatedRestaurants, restaurantLocation, deviceLocation);





    return (
  
        <FavouritesProvider>  
        <ScrollView style={styles.container}>
          <View style={styles.searchForm}>
            <View style={styles.topBar}>
            <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
          <Image source={require('../Images/menu.png')} style={styles.icon} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 85  }}>
        <Text style={styles.universityName}>Comsats University</Text>
        <Text style={styles.universityName}>Lahore</Text>
      </View>
            </View>
            <View style={styles.searchContainer}>
              <View style={styles.inputContainer}>
              <TouchableOpacity onPress={onSearchPress}>
                  <Image source={require('../Images/search.png')} style={styles.icon} />
                </TouchableOpacity>
                <TextInput
                  placeholder="Search for restaurants, cuisines"
                  style={styles.searchInput}
                  onChangeText={text => setRestaurantName(text)}
                  value={restaurantName}
                />
                <Text style={styles.divider}>|</Text>
                <TouchableOpacity onPress={() => setIsVisible(true)}>
               <Image source={require('../Images/filter.png')} style={styles.icon} />
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
              renderItem={(item) => renderRestaurant(item, likedRestaurants)}
              keyExtractor={(item, index) => item.id ? `${item.id}-${index}` : index.toString()}
      
      
              initialNumToRender={10} // Number of items to render in the initial batch
        maxToRenderPerBatch={10}  // Number of items to render per batch
            />
      
            <Text style={styles.sectionTitle}>Previously searched restaurants</Text>
            <FlatList
        horizontal
        data={searchedRestaurants} // use searchedRestaurants here
        renderItem={(item) => renderRestaurant(item, likedRestaurants)}
        keyExtractor={(item, index) => item.id ? `${item.id}-${index}` : index.toString()}
      
      
        initialNumToRender={5} // Number of items to render in the initial batch
        maxToRenderPerBatch={3}  // Number of items to render per batch
      /> 
          </View>
        </ScrollView>
        </FavouritesProvider>  
        
      );
       }
      
              const styles = StyleSheet.create({
                container: {
                    flex: 1,
                    backgroundColor: 'white',
                },
                topBar: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  borderBottomWidth: 0.5,
                  borderColor: 'lightgray',
                  paddingHorizontal: 20, // Add this for horizontal padding
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
            
               
      
      export default RestaurantSearch2;
      