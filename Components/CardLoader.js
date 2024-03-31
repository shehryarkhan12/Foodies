import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const CardLoader = ({ backgroundColor,baseColor, highlightColor }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    const startAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: false
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: false
                })
            ])
        ).start();
    };

    useEffect(() => {
      startAnimation();
      return () => {
          console.log("CardLoader is unmounting");
          // Any cleanup you might want to do
      };
  }, []);

    const cardLoaderStyle = {
      height: 200,
      width: '100%',
      backgroundColor: backgroundColor, // Use dynamic background color
      borderRadius: 10,
      marginVertical: 0,
      padding: 16,
      justifyContent: 'center',
  };

  

    const animatedStyle = {
      backgroundColor: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [baseColor, highlightColor] // Use passed colors for animation
      }),
  };
    return (
        <View style={cardLoaderStyle}>
            <Animated.View style={[styles.skeletonHeader, animatedStyle]}></Animated.View>
            <View style={styles.skeletonDetails}>
                <Animated.View style={[styles.skeletonImage, animatedStyle]}></Animated.View>
                <View style={styles.skeletonTextContainer}>
                    <Animated.View style={[styles.skeletonText, animatedStyle]}></Animated.View>
                    <Animated.View style={[styles.skeletonText, animatedStyle]}></Animated.View>
                    <Animated.View style={[styles.skeletonText, animatedStyle]}></Animated.View>
                </View>
            </View>
        </View>
    );
};
  const styles = StyleSheet.create({
    skeletonHeader: {
      height: 20, // Height of the header skeleton
      backgroundColor: '#e0e0e0', // Slightly different color for contrast
      marginBottom: 10, // Space below the header
      borderRadius: 4, // Rounded edges
    },
    skeletonDetails: {
      flexDirection: 'row', // Elements side by side
    },
    skeletonImage: {
      height: 60, // Height of the image skeleton
      width: 60, // Width of the image skeleton
      backgroundColor: '#e0e0e0',
      borderRadius: 30, // Circular shape
      marginRight: 10, // Space after the image
    },
    skeletonTextContainer: {
      flex: 1, // Take up remaining space
    },
    skeletonText: {
      height: 10, // Height of the text skeleton
      backgroundColor: '#e0e0e0',
      marginBottom: 6, // Space between lines
      borderRadius: 4,
    },
    // Reuse the Loader component you already created
  });
  export default CardLoader;