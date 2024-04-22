import React, { createContext, useState, useContext } from 'react';

// Create the context
const AppContext = createContext({
  hasSplashBeenShown: false,
  setHasSplashBeenShown: () => {}
});

// Provider component that wraps your app and provides the state
export const AppProvider = ({ children }) => {
  const [hasSplashBeenShown, setHasSplashBeenShown] = useState(false);

  return (
    <AppContext.Provider value={{ hasSplashBeenShown, setHasSplashBeenShown }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

export default AppContext;
