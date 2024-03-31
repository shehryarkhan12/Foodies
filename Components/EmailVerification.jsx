import React, { useState,createRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert,ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_IP_ADDRESS } from '../api/config';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EmailVerification = ({route}) => {
    console.log(route.params); // Log to debug
    const email = route.params?.email;
    const username = route.params?.username;
    const password = route.params?.password
  const [otp, setOtp] = useState(Array(4).fill('')); // Initialize with an array of 4 empty strings
  const navigation = useNavigation(); // Use the useNavigation hook to get the navigation object
  const inputRefs = Array(4).fill(null).map(() => createRef());
  const [backspace, setBackspace] = useState(false);
  // Function to handle OTP input
  const handleOtpChange = (value, index) => {
    otp[index] = value;
    setOtp([...otp]);

    if (value !== '' && index < 3) {
        inputRefs[index + 1].current.focus();
      }
      setBackspace(false);
  };

  const postTokenToServer = async (token, username) => {
    console.log("Sending to server - Token:", token, "Username:", username);
    
    const response = await fetch(`http://${API_IP_ADDRESS}/saveExpoPushToken`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              token: token,
              username: username,
          }),
      });
      const responseData = await response.json();
      console.log("Response from server:", responseData);
  
      if (!response.ok) {
          console.log('Failed to save push token on server');
      }
  };
  const sendTokenToServerAfterRegistration = async (username) => {
    try {
        const token = await AsyncStorage.getItem('expoPushToken');
        if (token && token !== 'null') { // Check that token is not null
            await postTokenToServer(token, username);
            await AsyncStorage.removeItem('expoPushToken'); // Clear the token from storage after sending
            return true;
        }
        return false; // No valid token to send
    } catch (e) {
        console.error('Failed to get the token from AsyncStorage', e);
        return false;
    }
};


  const verifyCode = async () => {
    const otpCode = otp.join(''); // Concatenating the individual digits to form the OTP

     // Check if verification code is valid
     if (otpCode.length < 4) {
      Alert.alert("Error", "Invalid verification code. Please enter the complete code.");
      return;
  }

    // POST request to verify the verification code
    const verifyResponse = await fetch(`http://${API_IP_ADDRESS}/verify-verification-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, code: otpCode }),
    });

    const verifyData = await verifyResponse.json();

    if (verifyData.success) {
      Alert.alert("Success", "Email verified successfully");

     // POST request to register the user
const registerResponse = await fetch(`http://${API_IP_ADDRESS}/register`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ username, email, password }),
});

await sendTokenToServerAfterRegistration(username);

      if (!registerResponse.ok) {
        console.error('API Response not OK', registerResponse);
        // Handle error here
        return;
      }
  
      const registerData = await registerResponse.json(); // Parse the JSON response
      console.log('API Response Data: ', registerData);
      Alert.alert('Success', 'Registered successfully!');
      // After successful registration

      navigation.navigate('Login', { email: email });
    } else {
      Alert.alert("Error", verifyData.message || "Failed to verify code.");
    }
};



  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
        setBackspace(true); 
      // If it's not the first box, focus the previous box
      if (index > 0 && otp[index] === '') { // Check that it's not the first box and the current box is empty
        otp[index - 1] = '';  // Remove the last character from the previous box
        setOtp([...otp]);  // Update the state
        inputRefs[index - 1].current.focus();  // Focus the previous box
      }
    }
  };

  const resendOtp = async () => {
    // Show some kind of loading or spinner here if you'd like
  
    // POST request to resend OTP
    const response = await fetch(`http://${API_IP_ADDRESS}/resend-verification-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),  // Replace with dynamic email
    });
  
    const data = await response.json();
  
    if (data.success) {
      Alert.alert("Success", "Verification code resent successfully");
    } else {
      Alert.alert("Error", data.message || "Failed to resend Verification code.");
    }
  
    // Hide loading or spinner here
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftArrowContainer}>
                <ImageBackground source={require('../Images/arrow-left.png')} style={styles.leftarrowStyle} resizeMode="contain" />
            </TouchableOpacity>
      <View style={styles.otpContainer}>
        <Text style={styles.otpText}>Verify your Email!</Text>
        <Text style={styles.subText}>Enter code shared on your email</Text>
        <View style={styles.inputContainer}>
          {otp.map((d, i) => (
            <TextInput
              key ={i.toString()}
              ref={inputRefs[i]}
              style={styles.input}
              maxLength={1}
              onChangeText={(value) => handleOtpChange(value, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}  // Add this line
              value={d}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={verifyCode}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
        <Text style={styles.resendText}>
          Didn't receive code?{' '}
          <TouchableOpacity onPress={resendOtp}>
       <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        </Text>
      </View>
      <View style={styles.footerContainer}>
      <Text style={styles.footer}>By Continuing you agree to</Text>
      {/* These links can be wrapped with TouchableOpacity for interactivity */}
      <View style={styles.linkContainer}>
      <Text onPress={() => { /* Link to Privacy Policy here */ }} style={styles.link}>Privacy Policy</Text>
      <Text onPress={() => { /* Link to Terms & Conditions here */ }} style={styles.link}>Terms & Conditions</Text>
      <Text onPress={() => { /* Link to Content Policy here */ }} style={styles.link}>Content Policy</Text>
      </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    otpContainer: {
      width: '80%',
      alignItems: 'center',
      paddingHorizontal: 20, // Added padding for consistent spacing
    },
    otpText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: 'red', // Adjusted for clarity
    },
    subText: {
      fontSize: 16,
      marginBottom: 30,
      color: 'black', // Adjusted for clarity
    },
    leftarrowStyle: {
      width: 40, // adjust this based on the size you want for the icon
      height: 40, // adjust this based on the size you want for the icon
    
    },
    leftArrowContainer: {
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 1,
  },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
    },
    input: {
      width: 50,
      height: 40,
      borderWidth: 2, // Slightly thicker border
      borderColor: 'lightgrey',
      textAlign: 'center',
      fontSize: 18,
      borderRadius: 8, // Rounded corners
      color: 'black', // Adjusted for clarity
      marginHorizontal: 5,
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16, // More rounded corners
      marginBottom: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold', // Bold text for emphasis
    },
    resendText: {
      fontSize: 16,
      color: 'black', // Adjusted for clarity
       
      alignItems: 'center', 
    },
    resendLink: {
      fontSize: 16,
      color: 'red',
      fontWeight: 'bold', // Bold for emphasis
      fontWeight: 'bold',
      alignSelf: 'center', 
      
    },
    footer: {
      marginTop: 5,
      fontSize: 14,
      color: 'grey', // Adjusted for a more muted look
    },
    link: {
      marginHorizontal: 5,
      fontSize: 14,
      color: 'lightgrey',
      marginTop: 5,
      textDecorationLine: 'underline', // Underlined for clarity
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        width: '70%',
        alignItems: 'center',
        paddingBottom: 20,  // You can adjust this value
      },
      linkContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 2,  // You can adjust this value
      },
  });
  

export default EmailVerification;
