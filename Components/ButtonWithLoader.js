import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ButtonWithLoader = ({ onPress, buttonText, isLoading, textStyle, gradientColors }) => {
  const buttonContent = isLoading ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={textStyle}>{buttonText}</Text>
  );

  if (gradientColors) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.buttonContainer}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  } else {
    // Fallback to a simple button if no gradient colors are provided
    return (
      <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, styles.fallbackButton]} activeOpacity={0.6}>
        {buttonContent}
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 5, // Ensures the touchable area has rounded corners
    marginTop: 10, // Space from other elements
  },
  gradient: {
    paddingHorizontal: 150,
    paddingVertical: 10,
    borderRadius: 25, // Matches the buttonContainer to ensure the gradient also has rounded corners
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackButton: {
    backgroundColor: '#004D40', // Fallback color if no gradient is provided
    paddingHorizontal: 50,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  // textStyle is received via props and doesn't need default styling here
});

export default ButtonWithLoader;
