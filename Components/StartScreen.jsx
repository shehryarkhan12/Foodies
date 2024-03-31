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

const StartScreen = () => {
    const navigation = useNavigation();

    // const signInWithFB = async () => {
    //     // Attempt login with permissions
    //     const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    //     if (result.isCancelled) {
    //       throw 'User cancelled the login process';
    //     }
    //     // Once signed in, get the users AccesToken
    //     const data = await AccessToken.getCurrentAccessToken();
    //     if (!data) {
    //       throw 'Something went wrong obtaining access token';
    //     }
        
    //      const auth = getAuth(app);
    
    //     // Create a Firebase credential with the AccessToken
    //     const facebookAuthProvider = FacebookAuthProvider.credential(data.accessToken);
    //     // console.log("provider ",facebookAuthProvider);
    //     // const credential = facebookAuthProvider.credential(data.accessToken);
    //     // Sign-in with credential from the Facebook user.
    //     signInWithCredential(auth, facebookAuthProvider)
    //     .then(() => {
    
    //     })
    //     .catch(error => {
    //       // Handle Errors here.]
    //       console.log(error);
    //     });
    
    
    //   }

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
            <TouchableOpacity style={styles.emailButton} onPress={handleEmailLogin}> 
            <Image source={require('../Images/gmail.png')} style={styles.icon} />
                <Text style={styles.buttonText}>Continue with Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emailButton} onPress={handleRestaurantEmailLogin}> 
            <Image source={require('../Images/gmail.png')} style={styles.icon} />
                <Text style={styles.buttonText}>Continue as Restaurant Admin</Text>
            </TouchableOpacity>
            <View style={styles.terms}>
    <Text style={styles.terms}>By Continuing you agree to</Text>
    <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => {/* Handle Privacy Policy link click */}}>
            <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text>  </Text>
        <TouchableOpacity onPress={() => {/* Handle Terms & Conditions link click */}}>
            <Text style={styles.linkText}>Terms & Conditions</Text>
        </TouchableOpacity>
        <Text>  </Text>
        <TouchableOpacity onPress={() => {/* Handle Content Policy link click */}}>
            <Text style={styles.linkText}>Content Policy</Text>
        </TouchableOpacity>
    </View>
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
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    linkText: {
        color: 'lightgrey',
        textDecorationLine: 'underline',
    },
    terms: {
        marginTop: 130,
        alignItems: 'center',
        color:'#827777',
      },
    icon: {
        width: 30,  // You can adjust this
        height: 30, // And this too
        marginRight: 10,
    },
    
});

export default StartScreen;
