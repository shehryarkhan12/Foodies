import { useEffect, useState,useContext, useRef  } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Alert,ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useItems } from './ItemsContext';
import { usePrice } from './PriceContext';
import MapView, { Marker } from 'react-native-maps';
import { priceUpdateEmitter } from './EventEmitter';
import axios from 'axios';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { useRoute } from "@react-navigation/native";
import * as Location from 'expo-location';
import { API_IP_ADDRESS } from '../api/config';
const ConfirmOrderScreen = ({ navigation }) => {
    const [userAddress, setUserAddress] = useState([]);
   
    const mapRef = useRef(null);
    const { selectedItems, setSelectedItems, orderId, setOrderId,subtotal,setSubtotal,mapKey } = useItems();
    
    const [deviceLocation, setDeviceLocation] = useState({
    latitude: null,
    longitude: null,
  });
const[data,setData]=useState([]);
const[price,setMyPrice]=useState(0);
const route = useRoute();
let lati = route.params?.lati;
  let longi = route.params?.longi;

    const { prices, updatePrice } = usePrice(); // Directly use prices and updatePrice

    const handlePriceChange = (itemName, price) => {
        updatePrice(itemName, parseFloat(price)); // Use the updatePrice from the context
    };

    useEffect(() => {
        const fetchDeviceLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }
    
            const newLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    
            setDeviceLocation({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
            });
        };
    
        fetchDeviceLocation();
    }, []);

      console.log("device Location:",deviceLocation);
    const OnConfirm = async (updatedPrices) => {
        setSelectedItems(prevItems => {
            let updatedItems = { ...prevItems };
            for (let itemName in updatedPrices) {
                if (updatedItems[itemName]) {
                    updatedItems[itemName] = {
                        ...updatedItems[itemName],
                        price: updatedPrices[itemName]
                    };
                }
            }
            return updatedItems;
            
        });
         // Store the updated prices in AsyncStorage
    try {
        await AsyncStorage.setItem('confirmedPrices', JSON.stringify(updatedPrices));
    } catch (error) {
        console.error("Error storing confirmed prices: ", error);
    }
    }

    const sendConfirmedPrices = async () => {
        try {
            await axios.put('http://your-api-endpoint.com/confirm-prices', {
                orderId: orderId,
                prices: prices
            });
            console.log('Prices sent successfully');
        } catch (error) {
            console.error('Error sending confirmed prices: ', error);
        }
    };

    const confirmPrices = async (id) => {
        console.log("id",id);
        // OnConfirm(prices);  // Use the prices from the context directly
        // await sendConfirmedPrices();
        // Alert.alert('Prices Confirmed', 'The prices have been successfully updated and sent back to MenuScreen.');
        // // Emitting event after confirming prices
        // priceUpdateEmitter.emit('pricesConfirmed', prices);
        axios.put(`http://${API_IP_ADDRESS}/api/order/add/`+ id, {
                        price,
                      })
                      .then((res) => {
                        console.log("res.data=",res.data);
                        

                        
                      })
                      .catch((err) => {
                        console.log(err);
                      });
    };

    // Example function to call the API endpoint to get the order items

    async function getOrderItems() {
        try {
          const response = await axios.get(`http://${API_IP_ADDRESS}/api/order/items`);
          setData(response.data);
          console.log("Order Data: " + JSON.stringify(response.data));
        
          // Adding addresses to each item
          const itemsWithAddress = await Promise.all(response.data.map(async (item) => {
            // Check if the item has latitude and longitude
            if ('lati' in item && 'longi' in item) {
              const address = await reverseGeocode(item.lati, item.longi);
              return { ...item, address };
            }
            return item;
          }));
        
          setData(itemsWithAddress);
          console.log("Updated Data with Addresses:", itemsWithAddress);
        } catch (error) {
          console.error(error);
        }
      }
      
      
  
  async function reverseGeocode(latitude, longitude) {
    try {
      const googleMapsApiKey = 'AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U';
      const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`);
      console.log("Geocoding response:", res.data);
      
      // Extracting the formatted address from the response
      if (res.data && res.data.results && res.data.results.length > 0) {
        console.log("Geocoding response:", res.data);
        return res.data.results[0].formatted_address;
       
        
      }
      return 'Address not found';
    }catch (error) {
        if (error.response) {
          console.error("Error Response:", error.response.data);
          return 'Address not found';
        } else {
          console.error("Error in reverse geocoding: ", error.message);
          return 'Address not found';
        }
      }
  }

  useEffect(() => {
    getOrderItems();
    // const fetchSelectedItems = async () => {
    //   try {
    //     // Call the getOrderItems function to retrieve items from your backend
    //     const fetchedSelectedItems = await getOrderItems();
  
    //     // If items are successfully fetched, update the state
    //     if (fetchedSelectedItems.length > 0) {
    //       setSelectedItems(fetchedSelectedItems);
    //       console.log("Fetched selected items: ", fetchedSelectedItems);
    //     } else {
    //       // Handle the case where no items are returned from the backend
    //       Alert.alert("Notice", "No selected items found for this order.");
    //     }
    //   } catch (error) {
    //     // If there's an error in fetching, log it and show an alert
    //     console.error("Error retrieving selected items: ", error);
    //     Alert.alert("Error", "Could not fetch selected items for the order.");
    //   }
    // };
  
    // fetchSelectedItems();
  }, []);


  return (
    <ScrollView style={styles.container}>
       
         {/* <MapView
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
      {deviceLocation && (
        <Marker
          coordinate={{ latitude: deviceLocation.latitude, longitude: deviceLocation.longitude }}
          title="User Location"
        />
      )}
    </MapView> */}
        {data.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                    <Text>{item.name} (x{item.quantity})</Text>
                    <Text>Original Price: {item.price}Rs</Text>
                    
                    {item.address && <Text>Address: {item.address}</Text>}
                </View>
                <TextInput 
                    style={styles.input} 
                    onChangeText={(pr) => setMyPrice(pr)}  
                    placeholder="Enter Price"
                />
                <Button 
                    title="Reconfirm" 
                    onPress={() => confirmPrices(item._id)} 
                    color="blue"
                />
            </View>
        ))}
    </ScrollView>
);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30
    },
    itemContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10
    },
    itemHeader: {
        flexDirection: 'column', // Changed from 'row' to 'column'
        alignItems: 'flex-start', // Align items to the start of the container
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 4,
        marginBottom: 10
    },
    button: {
        backgroundColor: 'blue',
        color: 'white',
        padding: 10,
        borderRadius: 4
    }
});


export default ConfirmOrderScreen;
