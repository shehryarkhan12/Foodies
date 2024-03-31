// HeartAnimationContext.js
import React, { createContext, useRef, useContext } from 'react';
import { Animated } from 'react-native';

const HeartAnimationContext = createContext();

export const useHeartAnimation = () => useContext(HeartAnimationContext);

export const HeartAnimationProvider = ({ children }) => {
  const heartAnimationValues = useRef({}).current;

  const updateHeartAnimation = (id, value) => {
    if (heartAnimationValues[id]) {
      heartAnimationValues[id].setValue(value);
    } else {
      heartAnimationValues[id] = new Animated.Value(value);
    }
  };

  return (
    <HeartAnimationContext.Provider value={{ heartAnimationValues, updateHeartAnimation }}>
      {children}
    </HeartAnimationContext.Provider>
  );
};
