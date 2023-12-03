import React,{useState,useRef} from "react";
import { Alert,Animated,View, TextInput, Button, StyleSheet, Text,Image,FlatList,TouchableOpacity,ScrollView,Modal,Linking} from 'react-native';
import { useFavourites } from '../favouritesContext';
import { onRestaurantCardClick } from "./onRestaurantCardClick";
import { toggleLike } from "./toggleLike";
import { toggleFavourite } from "./toggleFavourite";
import { mapPriceLevelToText } from "./mapPriceLevelToText";
import { handleCallPress } from "./handleCallPress";
import { handleMenuButtonClick } from "./handleMenuButtonClick";
import { useItems } from '../ItemsContext';

const renderRestaurant = ({ item,props }) => {

  const [likedRestaurants, setLikedRestaurants] = useState({});
const animatedValue = useRef(new Animated.Value(0)).current;
const [restaurantName, setRestaurantName] = useState("");
const [mapCenter, setMapCenter] = useState(null);
const filledHeart = require('../../Images/filledheart.png');  // replace with your actual path
const unfilledHeart = require('../../Images/unfillledheart.png');  // replace with your actual path
const { deviceLocation,setDeviceLocation,mapKey,setMapKey,token,setToken } = useItems(); 
const [isMenuModalVisible, setMenuModalVisible] = useState(false);

  
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
        source={require('../../Images/call.png')} 
        style={{ width: 50, height: 50 }}
      />
      <Text style={{ marginTop: 5,marginLeft:10 }}>Call</Text>
    </TouchableOpacity>
  ) : null}
                 
                <Button 
                  title="Order" 
                  onPress={() => handleMenuButtonClick(item,deviceLocation.latitude,deviceLocation.longitude)}
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
                      source={require('../../Images/cross_icon.png')}
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

  export default renderRestaurant;