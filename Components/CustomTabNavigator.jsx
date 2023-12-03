import { useEffect, useState,useContext, useRef  } from 'react';
import { Image,View, Text, TextInput, Button, StyleSheet,Alert,ScrollView } from 'react-native';
import RestaurantSearch from './RestaurantSearch';
import MyFavourites from './MyFavourites';
import Profile from './Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

const CustomTabNavigator = (route) => {
  const [activeTab, setActiveTab] = useState('Home');

  const getTabBarStyle = () => {
    switch (activeTab) {
      case 'Home': return { backgroundColor: 'blue' };
      case 'Profile': return { backgroundColor: 'green' };
      case 'Favourites': return { backgroundColor: 'red' };
      case 'Settings': return { backgroundColor: 'white' };
      default: return {};
    }
  };

  const iconStyle = {
    width: 30, // Set the width of the icon
    height: 30, // Set the height of the icon
    resizeMode: 'contain', // Ensure the entire image fits within the dimensions
  };

  return (
    <Tab.Navigator 
      screenOptions={{
        headerShown: false,
        tabBarStyle: getTabBarStyle(),
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={RestaurantSearch}
        listeners={{ tabPress: () => setActiveTab('Home') }}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../Images/homeicon2.png')}
              style={[iconStyle, { tintColor: focused ? 'lightblue' : 'black' }]}
            />
          ),
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        initialParams={{
            email:route.params.email,
            username: route.params.username,
            id: route.params.id,
            avatarSource:route.params.avatarSource
        }}
        listeners={{ tabPress: () => setActiveTab('Profile') }}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../Images/profileicon2.png')}
              style={[iconStyle, { tintColor: focused ? 'lightgreen' : 'black' }]}
            />
          ),
        }} 
      />
      <Tab.Screen 
        name="Favourites" 
        component={MyFavourites}
        listeners={{ tabPress: () => setActiveTab('Favourites') }}
        options={{
          tabBarLabel: 'Favourites',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../Images/hearticon2.png')}
              style={[iconStyle, { tintColor: focused ? 'red' : 'black' }]}
            />
          ),
        }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={RestaurantSearch}
        listeners={{ tabPress: () => setActiveTab('Settings') }}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../Images/settingsicon.png')}
              style={[iconStyle, { tintColor: focused ? 'red' : 'black' }]}
            />
          ),
        }} 
      />
    </Tab.Navigator>
  );
};
export default CustomTabNavigator;