//     GoogleSignin.configure({
//         // It's mandatory to call this method before attempting to call signIn()
//         webClientId: '1007292960701-li7aearjb3ljlto80dn8570b0tq8tpcg.apps.googleusercontent.com', // Client ID of type WEB for your server (needed to verify user ID and offline access)
//         offlineAccess: true, // If you want to access Google API on behalf of the user FROM YOUR SERVER
//     });

    
// const handleGoogleLogin = async () => {
//     try {
//         await GoogleSignin.hasPlayServices();
//         const userInfo = await GoogleSignin.signIn();
//         // You can now use userInfo object to get user's information
//         navigation.navigate('RestaurantSearch');
//     } catch (error) {
//         console.error(error);
//     }
// };


import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking, Alert, AsyncStorage } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import * as Facebook from 'expo-facebook';

const StartScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        async function initializeFacebook() {
            if (Facebook && Facebook.initializeAsync) {
                await Facebook.initializeAsync({appId: '839998817606915'});
            }
        }
        initializeFacebook();
    }, []);

    // Your existing logic for login
    const handleFacebookLogin = async () => {
        try {
            const { type, token } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', 'email'],
            });

            if (type === 'success') {
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('loginMethod', 'facebook');
                Alert.alert('Logged in with Facebook!');
                navigation.navigate('Profile');
            }
        } catch ({ message }) {
            console.log(`Facebook Login Error: ${message}`);
        }
    };

    const handleEmailLogin = () => {
        navigation.navigate('Login');
    };
    const handleRestaurantEmailLogin = () => {
        navigation.navigate('RestaurantLogin');
    };
     const handleLinkPress = (link) => {
        // Navigate or open a web view based on the link
        switch (link) {
            case 'Privacy Policy':
                // Navigate to the Privacy Policy screen or open a web view
                break;
            case 'Terms & Conditions':
                // Navigate to the Terms & Conditions screen or open a web view
                break;
            case 'Content Policy':
                // Navigate to the Content Policy screen or open a web view
                break;
            default:
                break;
        }
    };



    return (
           

        <View style={styles.container}>
            <Text style={styles.title}>Foodies Hub</Text>
            <Image source={require('../Images/delicious-fried-chicken-plate-1.png')} style={styles.image} />
            <TouchableOpacity style={styles.googleButton} >
            <Image source={require('../Images/google.png')} style={styles.icon} />
                <Text style={styles.buttonText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.facebookButton} onPress={handleFacebookLogin} > 
            <Image source={require('../Images/download.png')} style={styles.icon} />
                <Text style={styles.buttonText}>Continue with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emailButton} onPress={handleEmailLogin}> 
            <Image source={require('../Images/gmail.png')} style={styles.icon} />
                <Text style={styles.buttonText}>Continue with Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emailButton} onPress={handleRestaurantEmailLogin}> 
            <Image source={require('../Images/gmail.png')} style={styles.icon} />
                <Text style={styles.buttonText}>Continue with RestaurantAdmin Email</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
                <Text>By Continuing you agree to</Text>
                <Text> </Text>
                <Text style={styles.link} onPress={() => handleLinkPress('Privacy Policy')}>
            Privacy Policy
        </Text>
                <Text> </Text>
                <Text style={styles.link} onPress={() => handleLinkPress('Terms & Conditions')}>
            Terms & Conditions
        </Text>
                <Text> </Text>
                <Text style={styles.link} onPress={() => handleLinkPress('Content Policy')}>
                Content Policy
        </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 32,
        color: 'red',
        fontWeight: 'bold',
        marginBottom: 50,
       
        
    },
    image: {
        width: 200,
        height: 100,
        marginBottom: 50,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 20,  // Make corners more rounded
        width: '80%',
        marginBottom: 10,
        borderWidth: 2,    // Add border width
        borderColor: 'grey',  // Set border color
    },
    facebookButton: {
    flexDirection:'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20, // Make corners more rounded
    width: '80%',
    marginBottom: 10,
    borderWidth: 2, // Add border width
    borderColor: 'grey', // Set border color
    },
    emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20, // Make corners more rounded
    width: '80%',
    marginBottom: 10,
    borderWidth: 2, // Add border width
    borderColor: 'grey', // Set border color
    },
    buttonText: {
        color: 'black',
        marginLeft: 15,
        fontSize: 16,
        zIndex: 1,
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    link: {
        color: 'red',
        textDecorationLine: 'underline',
    },
    icon: {
        width: 30,  // You can adjust this
        height: 30, // And this too
        marginRight: 10,
    },
    
});

export default StartScreen;
