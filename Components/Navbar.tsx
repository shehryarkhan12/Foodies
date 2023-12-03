import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RestaurantSearch from './RestaurantSearch';
import Login from './Login';
const Stack = createNativeStackNavigator();

function SearchScreen() {
  return (
    <RestaurantSearch />
  );
}

function DeliveryScreen() {
  return (
    <Login />
  );
}

function Navbar() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ff6347',  // Tomato color for the navbar
          },
          headerTintColor: '#fff',  // White color for the navbar text and icons
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: 'Foodies Hub - Search',
          }}
        />
        <Stack.Screen
          name="Delivery"
          component={DeliveryScreen}
          options={{
            title: 'Foodies Hub - Delivery',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navbar;
 