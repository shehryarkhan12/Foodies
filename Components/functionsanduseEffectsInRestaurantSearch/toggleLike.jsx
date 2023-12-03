import React,{useState,useRef} from "react";
import { Alert,Animated,View, TextInput, Button, StyleSheet, Text,Image,FlatList,TouchableOpacity,ScrollView,Modal,Linking} from 'react-native';

const toggleLike = async (id) => {
  const [likedRestaurants, setLikedRestaurants] = useState({});
  const animatedValue = useRef(new Animated.Value(0)).current;
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
  export default toggleLike;