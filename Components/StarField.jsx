import React from 'react';
import { View, StyleSheet } from 'react-native';
import TwinklingStar from './TwinklingStar';

const rainbowColors = [
    '#FF0000', // Red
    '#FF7F00', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#9400D3', // Violet
];

// Function to get a random color from the rainbowColors array
const getRandomRainbowColor = () => {
    const index = Math.floor(Math.random() * rainbowColors.length);
    return rainbowColors[index];
};

const calculateStarPositions = (layout) => {
    if (!layout) return [];
  
    const {x, y, width, height} = layout;
    // Corner positions based on the layout
    const positions = [
      {left: x, top: y}, // Top-left
      {left: x + width, top: y}, // Top-right
      {left: x, top: y + height}, // Bottom-left
      {left: x + width, top: y + height}, // Bottom-right
    ];
  
    return positions.map(position => ({
      duration: Math.random() * 1000 + 1000,
      delay: Math.random() * 300,
      size: Math.random() * 15 + 5,
      position,
      tintColor: getRandomRainbowColor(),
    }));
  };


  const StarField = ({ children, starPositions }) => {
    return (
      <View style={styles.container}>
        {starPositions.map((star, index) => (
          <TwinklingStar key={index} {...star} />
        ))}
        {children}
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});

export default StarField;