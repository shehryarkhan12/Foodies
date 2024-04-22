import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image } from 'react-native';

const TwinklingStar = ({ duration, delay, size, position, tintColor }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Define the opacity animation sequence
    const opacitySequence = Animated.sequence([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: duration / 4,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: duration / 4,
        useNativeDriver: true,
      }),
    ]);

    // Loop the opacity animation
    const opacityLoop = Animated.loop(opacitySequence);

    // Start the opacity animation
    opacityLoop.start();

    // Define and start the rotation animation loop
    const rotationLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    rotationLoop.start();

    // Set a timeout to stop all animations and fade out after 5 seconds
    const timer = setTimeout(() => {
      // Stop the animations
      rotationLoop.stop();
      opacityLoop.stop();

      // Start a final fade out animation
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 5000);

    return () => {
      clearTimeout(timer);
      // Make sure animations are stopped when the component unmounts
      rotationLoop.stop();
      opacityLoop.stop();
    };
  }, [rotateAnim, opacityAnim, duration, delay]);

  // Calculate rotation from the animated value
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Image
      source={require('../Images/star.png')}
      style={{
        width: size,
        height: size,
        tintColor,
        opacity: opacityAnim,
        transform: [{ rotate: rotation }],
        position: 'absolute',
        ...position,
      }}
      resizeMode="cover"
    />
  );
};

export default TwinklingStar;
