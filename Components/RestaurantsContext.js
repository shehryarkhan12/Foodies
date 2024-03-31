// RestaurantsContext.js
import React, { createContext, useState, useContext } from 'react';

const RestaurantsContext = createContext();

export const RestaurantsProvider = ({ children }) => {
  const [restaurantName, setRestaurantName] = useState("");

  return (
    <RestaurantsContext.Provider value={{ restaurantName, setRestaurantName }}>
      {children}
    </RestaurantsContext.Provider>
  );
};

export const useRestaurants = () => useContext(RestaurantsContext);
