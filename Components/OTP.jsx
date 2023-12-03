import React, { useState,createRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_IP_ADDRESS } from '../api/config';

const OTP = ({route}) => {
    console.log(route.params); // Log to debug
    const email = route.params?.email;
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

  const verifyCode = async () => {
    const otpCode = otp.join(''); // Concatenating the individual digits to form the OTP

   
    // POST request to verify reset code
    const response = await fetch(`http://${API_IP_ADDRESS}/verify-reset-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, code: otpCode }), // Replace with dynamic email
    });

    const data = await response.json();

    if (data.success) {
      Alert.alert("Success", "Code verified successfully");
      navigation.navigate('NewPassword', { email: email });
    } else {
      Alert.alert("Error", data.message || "Failed to verify code.");
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
    const response = await fetch(`http://${API_IP_ADDRESS}/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),  // Replace with dynamic email
    });
  
    const data = await response.json();
  
    if (data.success) {
      Alert.alert("Success", "OTP resent successfully");
    } else {
      Alert.alert("Error", data.message || "Failed to resend OTP.");
    }
  
    // Hide loading or spinner here
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        <Text style={styles.otpText}>Enter OTP!</Text>
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
  

export default OTP;
