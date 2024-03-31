// ThemeContext.js
import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setDarkMode] = useState(false);
  const [isNotificationsMuted, setNotificationsMuted] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!isDarkMode);
  };
  const toggleNotifications = () => {
    setNotificationsMuted(!isNotificationsMuted);
    console.log("Notifications Muted Toggled: ", !isNotificationsMuted); // Log notifications muted state change
  };



  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleTheme, 
      isNotificationsMuted, 
      toggleNotifications 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
