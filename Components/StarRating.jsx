import React from 'react';
import { View, Text,StyleSheet, Image } from 'react-native';
const halfStar = require('../Images/halfStar.jpg'); // The path to the half-star image
const StarRating = ({ rating, maxStars = 5 }) => {
  // Create an array of stars to render filled, half-filled, or unfilled based on the rating
  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    if (i <= rating) {
      stars.push(
        <Text key={i} style={styles.starEmoji}>⭐</Text>
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <Image
          key={i}
          source={halfStar}
          style={styles.starImage} // Define this style in your StyleSheet
          resizeMode="cover" // Optional: Change resizeMode according to your needs
        />
      );
    } else {
      stars.push(
        <Text key={i} style={styles.starEmoji}>✩</Text>
      );
    }
  }

  return (
    <View style={styles.container}>
      {stars}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starEmoji: {
    fontSize: 24, 
    color: '#FFD700'
  },
  starImage: {
    width: 24, // Match the size of the text stars
    height: 24,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StarRating;
