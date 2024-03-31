import React,{useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {useSharedValue, useAnimatedStyle, withSpring,withTiming,runOnJS } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

const TabButton = ({ item, onPress, accessibilityState }) => {
  const focused = accessibilityState.selected;
const {isDarkMode} = useTheme();
 // const iconSize = focused ? 25 : 20; // Larger icon when focused
  // Use `withSpring` for a more dynamic effect on icon size change
  //const iconSize = useSharedValue(focused ? 30 : 20);
  const getIconColor = (focused, isDarkMode) => {
    if (focused) {
        return '#ffffff'; // Color for focused icon remains the same regardless of theme
    } else if(focused && isDarkMode) {
        // Use different colors for inactive icons based on the theme
        return '#ffffff' // Example: Lighter gray for dark mode, darker gray for light mode
    }
   else if(isDarkMode) {
    // Use different colors for inactive icons based on the theme
    return '#ffffff' // Example: Lighter gray for dark mode, darker gray for light mode
}
else if(!isDarkMode) {
  // Use different colors for inactive icons based on the theme
  return '#37474F' // Example: Lighter gray for dark mode, darker gray for light mode
}
};
  
  // This shared value is used to animate the shadow opacity
  const shadowOpacity = useSharedValue(focused ? 1 : 0); // Initialize based on focus
// React to focus changes
useEffect(() => {
  shadowOpacity.value = focused ? 1 : 0; // Adjust shadow based on focus
}, [focused, shadowOpacity]);


 
  // Function to handle touch events and animate the shadow
  // Function to animate shadow opacity on press
   // Function to handle touch events and animate the shadow
   // handlePressIn: Start the shadow opacity animation on press
   const scale = useSharedValue(1);

   const handlePressIn = () => {
    shadowOpacity.value = withTiming(0.1, { duration: 100 }); // Dim the shadow on press
  };

  const handlePressOut = () => {
    shadowOpacity.value = withTiming(0, { duration: 100 }, () => {
     
      // Optionally trigger any subsequent animations or actions here
    });
  };
   
   const buttonAnimatedStyle = useAnimatedStyle(() => {
       return {
           transform: [{ scale: scale.value }],
       };
   });

  const viewStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(focused ? 140 : 40, { damping: 10 }),
      alignItems: 'center',
      flexDirection: 'row', // to align icon and text in a row
      height: 50,
      borderRadius: 20,
      backgroundColor: focused ? 'red' : 'transparent',
      justifyContent: 'center',
      marginLeft: focused ? 20 : 10,
      marginRight: focused ? 20 : 10,
      // Drop shadow properties
      shadowColor: !isDarkMode? 'black' : 'white',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: shadowOpacity.value, // Animated shadow opacity
      shadowRadius: 7,
      elevation: shadowOpacity.value * 7, // for Android elevation
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(focused ? 1 : 0.5, { duration: 200 }),
      transform: [{ scale: withTiming(focused ? 1.25 : 1, { duration: 200 }) }], // Scale icon for focused state
    };
  });
  const textStyle = useAnimatedStyle(() => {
    return {
      color: focused ? 'white' : 'black',
      marginLeft: focused ? 8 : 0,
      fontWeight: 'bold',
      fontSize:17,
      opacity: focused ? 1 : 0, // only show text if focused
    };
  });
  return (
    <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={[styles.button, {flexDirection: 'row'}]}>
        
      <Animated.View style={[styles.animatedContainer, viewStyle]}>
      
      <Animated.View style={iconAnimatedStyle}>
       {/* Render the icon */}
       <Ionicons
          name={focused ? item.activeIconName : item.inactiveIconName} // Use different icons for active/inactive if you want
          size={20}
          color={getIconColor(focused,isDarkMode)}
         
        
        />
        </Animated.View>
        {/* Conditionally render the label next to the icon */}
        {focused && (
          <Animated.Text style={textStyle}>
            {item.name}
          </Animated.Text>
        )}
       
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
   
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedContainer: {
    flexDirection:"row",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

export default TabButton;
