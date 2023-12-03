/**
 * @format
 */

import React, { useState, useEffect } from 'react';
import { registerRootComponent } from 'expo';
import App from './Components/App';
import * as Font from 'expo-font';
import * as Facebook from 'expo-facebook';

Facebook.initializeAsync({
  appId: '839998817606915',
});

//import { name as appName } from './app.json';


const AppWithFonts = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        ...require('@expo/vector-icons/fonts/FontAwesome.ttf'),
      });
      setFontLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontLoaded) {
    return null; // Return null or a loading screen while fonts are being loaded
  }

  return <App />;
};

registerRootComponent(AppWithFonts);