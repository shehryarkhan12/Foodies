import React, { useState, useEffect, useRef } from 'react';
import { Alert,View, Text, Image, StyleSheet, TouchableOpacity, Button, Modal } from 'react-native';

const RestaurantCard = () => {
    const [likedRestaurants, setLikedRestaurants] = useState({});
  
    const toggleLike = (id) => {
      setLikedRestaurants({
        ...likedRestaurants,
        [id]: !likedRestaurants[id]
      });
    };
  
    // ...
    return (
      <View>
        {/* Render restaurant cards */}
        {restaurantData.map((item) => (
          <RestaurantCard
            key={item.id}
            item={item}
            isLiked={!!likedRestaurants[item.id]}
            toggleLike={() => toggleLike(item.id)}
          />
        ))}
      </View>
    );
  };
