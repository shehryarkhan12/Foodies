import React,{useState,useRef} from "react";
import { Alert,Animated,View, TextInput, Button, StyleSheet, Text,Image,FlatList,TouchableOpacity,ScrollView,Modal,Linking} from 'react-native';


const onRestaurantCardClick = (restaurantLatitude, restaurantLongitude) => {
  const [restaurantLocation, setRestaurantLocation] = useState({
    latitude: null,
    longitude: null,
  });
    setRestaurantLocation({
      latitude: restaurantLatitude,
      longitude: restaurantLongitude
    });
  };
  export default onRestaurantCardClick;