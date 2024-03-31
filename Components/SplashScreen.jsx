import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
    const navigation = useNavigation(); // Hook to get the navigation object

    useEffect(() => {
        // Set a timer for 3 seconds to navigate to another screen
        const timer = setTimeout(() => {
            navigation.navigate('Pagination'); // Replace 'Home' with the name of your target screen
        }, 3000); // Number of milliseconds to wait

        // Clear the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [navigation]);
    return (
        <LinearGradient
            colors={['#FFA726', '#FF5722']} // Gradient colors
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />
            <Image
                source={require('../Images/Foodies-removebg-preview.png')} // Replace with your logo image file
                style={styles.logo}
            />
            <Text style={styles.title}>FoodiesHub</Text>
            <Text style={styles.slogan}>DISCOVER DELIGHT IN EVERY BITE!</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
         
        fontSize: 50, // Adjust font size as needed
        fontWeight: 'bold',
        color: 'white', // Color of the text
    },
    slogan: { // Style for the slogan text
        fontSize: 14, // Adjust font size as needed
        color: 'white', // Color of the text
        marginTop: 10, // Space between title and slogan
    },
    logo: {
        width: 130, // Adjust as needed
        height: 130, // Adjust as needed
        resizeMode: 'contain',
    },
});

export default SplashScreen;
