import React, { useRef, useMemo, useEffect, useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  FontAwesome5,
  Fontisto,
  MaterialIcons,
  Ionicons
} from "@expo/vector-icons";
import orders from "../Components/data/orders.json";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation } from "@react-navigation/native";

const order = orders[0];

const ORDER_STATUSES = {
  ACCEPTED: "ACCEPTED",
  DELIVERED: "DELIVERED",
};

const OrderDelivery = ({ route }) => {
  const { orderId, orders,data } = route.params;
  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [deliveryStatus, setDeliveryStatus] = useState(ORDER_STATUSES.ACCEPTED);
  const [isDriverClose, setIsDriverClose] = useState(false);
  const destination = { latitude: order.lat, longitude: order.lng };
  //const { deviceLocation,setDeviceLocation,mapKey,setMapKey,token,setToken,restaurantLocation,setRestaurantLocation } = useItems(); 
const API_KEY="AIzaSyDu_ikrzuCSjDJh3h0LDoz79ooMNzbKxwc"

  console.log(" orderId in OrderDelivery:", orderId);
  console.log(" orders in OrderDelivery:", orders);
  const bottomSheetRef = useRef();
  const mapRef = useRef(null);
  const { width, height } = useWindowDimensions();

  const snapPoints = useMemo(() => ["12%", "95%"], []);
  const Navigation = useNavigation();

  const updateDistanceAndTime = async (newLocation) => {
    const destination = { latitude: order.lat, longitude: order.lng }; // Destination coordinates
  
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${newLocation.latitude},${newLocation.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch distance and time');
      }
  
      const data = await response.json();
      console.log('API Response:', data);
      if (data.rows[0].elements[0].status === "OK") {
        const distance = data.rows[0].elements[0].distance.text; // e.g., "14.5 km"
        const duration = data.rows[0].elements[0].duration.text; // e.g., "22 mins"
  
        setTotalKm(parseFloat(distance));
        setTotalMinutes(parseFloat(duration));
      } else {
        console.log('Error in response:', data);
      }
    } catch (error) {
      console.error('Error fetching distance and time:', error);
    }
  };
  

  useEffect(() => {
    let isMounted = true;
    let foregroundSubscription;

    const getLocationUpdates = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission not granted");
        return;
      }

      foregroundSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          distanceInterval: 100, // Update every 100 meters
        },
        (updatedLocation) => {
          if (isMounted) {
            const newLocation = {
              latitude: updatedLocation.coords.latitude,
              longitude: updatedLocation.coords.longitude,
            };
            setDriverLocation(newLocation);
            updateDistanceAndTime(newLocation); // Function to recalculate distance and time
          }
        }
      );
    };

    getLocationUpdates();

    return () => {
      isMounted = false;
      if (foregroundSubscription) {
        foregroundSubscription.remove();
      }
    };
  }, []);

  if (!driverLocation) {
    return <ActivityIndicator size={"large"} />;
  }

  

  const onButtonPressed = () => {
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED) {
      bottomSheetRef.current?.collapse();
      mapRef.current.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      // Check if the driver is close to the destination
    if (isDriverClose) {
      setDeliveryStatus(ORDER_STATUSES.DELIVERED);
    } else {
      // Optionally, you can provide feedback to the user that they are not close enough
      // to the destination to complete the delivery.
      console.warn("You are not close enough to the destination.");
    }
  } else if (deliveryStatus === ORDER_STATUSES.DELIVERED) {
    // Complete the delivery process
    bottomSheetRef.current?.collapse();
    Navigation.goBack();
    console.warn("Delivery Finished");
  }
};

  const RenderButtonTitle = () => {
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED) {
      return "Accept Order";
    }
    if (deliveryStatus === ORDER_STATUSES.DELIVERED) {
      return "Complete Delivery";
    }
  };

  const isButtonDisable = () => {
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED) {
      return false;
    }
    if (deliveryStatus === ORDER_STATUSES.DELIVERED && isDriverClose) {
      return false;
    }

    return true;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        ref={mapRef}
        style={{ height, width }}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}
      >
        {data.map((ordered, index) => (
          <React.Fragment key={index}>
            <MapViewDirections
              origin={driverLocation}
              destination={{
                latitude: ordered.lati,
                longitude: ordered.longi,
              }}
              strokeWidth={2}
              strokeColor="black"
              apikey={API_KEY}
              onReady={(result) => {
                if (result.distance <= 0.01) {
                  setIsDriverClose(true);
                }
                // You might want to handle totalMinutes and totalKm differently
                // since you have multiple destinations
                setTotalMinutes(result.duration);
                setTotalKm(result.distance);
              }}
            />
            <Marker
              coordinate={{
                latitude: 31.421381,
                longitude: 74.229974,
              }}
              title='Selected Restaurant'
              description={ordered.address}
            >
              <View
                style={{
                  backgroundColor: "red",
                  padding: 5,
                  borderRadius: 15,
                }}
              >
                <MaterialIcons name="restaurant" size={30} color="white" />
              </View>
            </Marker>
          </React.Fragment>
        ))}
      </MapView>
      {deliveryStatus === ORDER_STATUSES.ACCEPTED && (
        <Ionicons 
          onPress={() => Navigation.goBack()}
          name= "arrow-back-circle"
          size={45}
          color="black"
          style={{top:40, left:14, position:'absolute'}}
        />
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        handleIndicatorStyle={{ backgroundColor: "grey", width: 100 }}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{totalMinutes.toFixed(0)} min</Text>
          <FontAwesome5
            name="shopping-bag"
            size={30}
            color="red" 
            style={styles.icon}
          />
          <Text style={styles.infoText}>{totalKm.toFixed(1)} km</Text>
        </View>
        <View style={styles.productDetailsContainer}>
          <Fontisto name="shopping-store" style={styles.iconStore} />
          <Text style={styles.heading}>Product Details:</Text>
          {orders.map((ordered, index) => (
    <View key={index}>
      <Text style={styles.productName}>{ordered.name}</Text>
      <Text style={styles.productPrice}>Price: {ordered.price}Rs</Text>
      {/* Uncomment and modify the following line if you have rating data
      <Text style={styles.productRating}>
        Rating: {order.rating}
      </Text>
      */}
      <Fontisto name="map-marker-alt" style={styles.iconLocation} />
      <View style={styles.destinationContainer}>
        <Text style={styles.destinationHeading}>Destination Address:</Text>
        {/* Modify this line according to your data structure */}
        <Text style={styles.destinationAddress}>{ordered.name}</Text>
        <Text style={styles.destinationAddress}>
              {order.Clinic.address}
            </Text>
      </View>
    </View>
  ))}
</View>
        <Pressable
        
          style={{
            ...styles.acceptButtonContainer,
            backgroundColor: isButtonDisable() ? "grey" : "red",
          }}
          onPress={onButtonPressed}
          disabled={isButtonDisable()}
        >
          <Text style={styles.acceptButtonText}>Track Order</Text>
        </Pressable>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
},
infoContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 15,
  backgroundColor: '#F9FAFB',
  borderRadius: 10,
  margin: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
infoText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#111827',
},
    icon: {
      marginHorizontal: 10,
    },
    productDetailsContainer: {
      paddingHorizontal: 20,
    },
    iconStore: {
      fontSize: 22,
      color: 'red',
    },
    heading: {
      fontSize: 20,
      fontWeight: '600',
    },
    productName: {
      fontSize: 20,
      fontWeight: '600',
      letterSpacing: 1,
      paddingVertical: 5,
    },
    productPrice: {
      fontSize: 20,
      fontWeight: '600',
      color: 'grey',
    },
    productRating: {
      fontSize: 20,
      fontWeight: '600',
      paddingBottom: 20,
      color: 'grey',
    },
    iconLocation: {
      fontSize: 22,
      color: 'red',
    },
    destinationContainer: {
      borderTopWidth: 1,
      borderColor: 'lightgrey',
      marginTop: 10,
    },
    destinationHeading: {
      fontSize: 20,
      fontWeight: '600',
    },
    destinationAddress: {
      fontSize: 20,
      color: 'grey',
      fontWeight: '600',
      letterSpacing: 1,
    },
    acceptButtonContainer: {
      backgroundColor: 'red',
      marginTop: 'auto',
      marginVertical: 30,
      marginHorizontal: 10,
      borderRadius: 20,
    },
    acceptButtonText: {
      color: 'white',
      textAlign: 'center',
      letterSpacing: 0.5,
      fontSize: 30,
      paddingVertical: 15,
      fontWeight: '700',
    },
  });
export default OrderDelivery;
