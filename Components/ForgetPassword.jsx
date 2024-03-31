import React, { useState } from 'react';
import styled from 'styled-components/native';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert,ImageBackground,ScrollView } from 'react-native';
import { API_IP_ADDRESS } from '../api/config';


const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleSendCode = () => {
        // Endpoint URL
        console.log("Sending reset code for email:", email);
        const endpoint = `http://${API_IP_ADDRESS}/reset-password`;
    
        // Making a POST request to the backend
        fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Alert.alert(`Code sent to ${email}`);
    
                // Navigate to OTP screen
                navigation.navigate('OTP', { email });
            } else {
                // Handle any errors or failures in sending the email
                Alert.alert(data.message || "Failed to send code. Please try again.");
            }
        })
        .catch(error => {
            // Handle errors in the request itself
            Alert.alert(error.toString());
            console.error("There was an error sending the reset code:", error);
        });
    };
    
    

    return (
        <View style={styles.container}>
             <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.leftArrowContainer}>
                <ImageBackground source={require('../Images/arrow-left.png')} style={styles.leftarrowStyle} resizeMode="contain" />
            </TouchableOpacity>
            <View style={styles.contentArea}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>

            <View style={styles.mainContent}>
            
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../Images/forgot-password.png')} />
                </View>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>Don’t worry, it happens! Please enter registered email</Text>
                <View style={styles.inputContainer}>
                    <Image source={require('../Images/email.png')} style={styles.emailIcon} />
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        placeholderTextColor="grey"
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSendCode}>
                    <Text style={styles.buttonText}>Send Code</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}>By Continuing you agree to</Text>
                <View style={styles.linkContainer}>
                    <TouchableOpacity onPress={() => console.log('Privacy Policy clicked')}>
                        <Text style={styles.footerLink}>Privacy Policy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('Terms & Conditions clicked')}>
                        <Text style={styles.footerLink}>Terms & Conditions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('Content Policy clicked')}>
                        <Text style={styles.footerLink}>Content Policy</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'space-between', // This will push the footer to the bottom
        alignItems: 'stretch', // Ensure children stretch to full width
        padding: 20,
    },
    contentArea: {
        flex: 1,
        paddingTop: 80, // Pushes content down, adjust as needed
      },
    mainContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    spacer: {
    height: 80, // Height of the spacer, adjust as needed
  },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'space-between', // Ensures footer sticks to the bottom
        padding: 20,
      },
    subtitle: {
        fontSize: 25,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftArrowContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
    },

    logoContainer: {
        marginBottom: 20,
    },
    leftarrowStyle: {
        width: 40, // adjust this based on the size you want for the icon
        height: 40, // adjust this based on the size you want for the icon
      
      },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
        color:'red',
    },
    input: {
        flex: 1,
        padding: 10,
        paddingLeft: 50,
        borderRadius: 20,
    },
    emailIcon: {
        width: 30,
        height: 30,
        position: 'absolute',
        left: 10,
        zIndex: 1, // to ensure the icon is on top
    },

    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#ff0000',
        borderRadius: 9,
        alignItems: 'center',
        marginBottom:50,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 25,
    },
    footer: {
        alignItems: 'center',
    
    },
    footerText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#827777',
        
        
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerLink: {
        marginHorizontal: 10,
        color: 'lightgrey',
        textDecorationLine: 'underline',
    },
});

export default ForgotPassword;
