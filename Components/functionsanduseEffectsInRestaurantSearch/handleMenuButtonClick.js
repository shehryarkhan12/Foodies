import React,{useRef} from "react";
import { Alert,Animated,View, TextInput, Button, StyleSheet, Text,Image,FlatList,TouchableOpacity,ScrollView,Modal,Linking} from 'react-native';
import { fetchMenuFromServer } from "./fetchMenuFromServer";

export const handleMenuButtonClick = async (item,lati,longi) => {
    let menuCategory = '';
    let menuSection = item.section || 'All';
    if (item.name.includes('Pizza') || item.name.includes('pizza') ) {
      menuCategory = 'Pizza';
    } else if (item.name.includes('Burger') || item.name.includes('burger')) {
      menuCategory = 'Burger';
    } else if (item.name.includes('BBQ') || item.name.includes('bbq')) {
      menuCategory = 'BBQ';
    } 
  
    // If no keyword matches, set menuCategory to 'All' or keep it empty
    // depending on how your server handles fetching all menus.
    if (!menuCategory) {
      menuCategory = 'All';  // Modify this as per your server's requirement
    }
  
    try {
      const menuData = await fetchMenuFromServer(menuCategory, menuSection);
      NavigateToMenuScreen(menuData,lati,longi);
      //console.log(menuData);
    } catch (error) {
      console.error("Failed to fetch menu data:", error);
    }
  }
  
  
  const NavigateToMenuScreen = (menuData,lati,longi)=>{
    navigation.navigate('MenuScreen', { menuData: menuData,lati:lati,longi:longi });
  }
  