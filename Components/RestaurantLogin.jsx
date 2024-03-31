
import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Facebook from 'expo-facebook';



// Import your API client, make sure to point to the correct file
import api from '../api/api';




const Login = (props) => {

    const [userEmail, setUserEmail] = useState('default@email.com');
    const [userName, setUserName] = useState('Default Name');
    const [userId, setUserId] = useState('');
  const navigation = useNavigation();
  

  const [formData, setFormData] = useState({
    username: "",
    email:"",
    password: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getAvatarFromAsyncStorage = async () => {
    try {
      const savedAvatarUri = await AsyncStorage.getItem('avatarSource');
      if (savedAvatarUri !== null) {
        // We have data!!
        return JSON.parse(savedAvatarUri);
      }
    } catch (error) {
      console.error("Error retrieving avatar from AsyncStorage: ", error);
    }
  
    return null; // or a default value
  };

  
  
  const handleLogin = async () => {
    try {
      const { username, password } = formData;

      if (!username || !password) {
        Alert.alert("Input Error", "Please enter both username/email and password.");
        return;
    }
    if (!username.trim() || !password.trim()) {
      Alert.alert("Input Error", "Please enter both username/email and password.");
      return;
  }
      
      let body = { password };

      // Check if input is an email or username
      if (username.includes('@')) {
          body.email = username;
      } else {
          body.username = username;
      }
        const response = await api.post('/restaurantLogin', body);
        console.log("Server Response:", response.data);

        // Check if response.data exists and it contains a token
        if (response.data && response.data.token) {
            await AsyncStorage.setItem('token', response.data.token);
            
            // Extract email, username, and id from the response
            const userEmail = response.data.profile.email;
            const userName = response.data.profile.username;
            const userId = response.data.profile.id;  // Extracting the id

            setUserEmail(response.data.profile.email);
        setUserName(response.data.profile.username);
        setUserId(response.data.profile.id);

            // If userId exists, save to AsyncStorage
            if (userId) {
                await AsyncStorage.setItem('userId', userId); 
            } else {
                console.warn("User ID not found in the response");
            }
            if (userEmail) {
              await AsyncStorage.setItem('userEmail', userEmail); 
              console.log("Email setted correctly in AsyncStorage:",userEmail);
          } else {
              console.warn("User Email not found in the response");
          }
          const avatarSource = await getAvatarFromAsyncStorage();
            console.log("Navigating with:", userName, userEmail,userId);  // Logging the extracted data
            //navigation.navigate('RestaurantSearch');
            // Navigate to the Profile screen with username, email, and id
            navigation.navigate('RestaurantDashboard', {
                email: userEmail,
                username: userName,
                id: userId,
                avatarSource: avatarSource
            });
        } else {
            throw new Error('No token received');
        }
    } catch (error) {
        console.log(error);
        Alert.alert('Login Error', 'Invalid username/email or password.');
    }
};







    return (

      <ScrollView
    contentContainerStyle={styles.contentContainer}
    keyboardShouldPersistTaps='handled' // Helpful for forms
  >
  <View style={styles.mainContent}>
        <TouchableOpacity onPress={() => navigation.navigate('Question')}>
        <ImageBackground source={require('../Images/arrow-left.png')} style={styles.leftarrowStyle} resizeMode="contain"></ImageBackground>
      </TouchableOpacity>
        <Text style={styles.header}>ResLogin</Text>
        <View style={styles.inputContainer}>
        <ImageBackground source={require('../Images/email.png')} style={styles.iconStyle} resizeMode="contain"></ImageBackground>
        <TextInput
          style={styles.inputWithIcon}
          placeholder="Enter Username or Email"
          value={formData.username}
          onChangeText={(text) => handleInputChange("username", text)}
        />
        </View>
        <View style={styles.inputContainer}>
        <ImageBackground source={require('../Images/lock.png')} style={styles.iconStyle} resizeMode="contain"></ImageBackground>
        <TextInput
          style={styles.inputWithIcon}
          placeholder="Enter Password"
          value={formData.password}
          onChangeText={(text) => handleInputChange("password", text)}
          secureTextEntry={true}
        />
        </View>
        <TouchableOpacity  onPress={() => navigation.navigate('ForgetPassword')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <LinearGradient
    // Button Linear Gradient
    colors={['#F87575', '#E63946', '#B51700']} // A gradient of attractive reds
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    locations={[0.3, 0.6, 1]} // Adjust these to shift where the color changes occur
    style={styles.gradient}
  >
          <Text style={styles.loginText}>Login</Text>
         </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('RestaurantRegister')}>
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>
        </View>
  </View>
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
  
  </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    contentContainer: {
      flexGrow: 1,
      justifyContent: 'flex-start',
      padding: 20,
      backgroundColor: 'white',
    },
    header: {
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 30, // Reduced margin for better responsiveness
      color: '#FF2147',
    },
    inputContainer: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      padding: 10,
      marginBottom: 15, // Reduced margin for better responsiveness
      alignItems: 'center',
    },
    iconStyle: {
      width: 24,
      height: 24,
      marginRight: 10,
    },
    inputWithIcon: {
      flex: 1, // To ensure the input takes up the remaining width
      fontSize: 18,
    },
    loginButton: {
      paddingVertical: 15, // Changed to paddingVertical for better responsiveness
      borderRadius: 20,
      alignItems: 'center',
      marginBottom: 20,
    },
    loginText: {
      color: 'white',
      fontSize: 20, // Adjusted for better readability across devices
    },
    gradient: {
      paddingHorizontal: 100,
      paddingVertical: 12,
      borderRadius: 25, // This should match the borderRadius of button to maintain the shape
      justifyContent: 'center', // Center the text within the gradient
      alignItems: 'center', // Center the text horizontally
      minWidth: 350, // Ensures a minimum width for the button
      maxWidth: 450, // You can adjust maxWidth as needed or remove it if not necessary
    },
    forgotPassword: {
      color: '#B51700',
      textAlign: 'left', // Align text to the left
      alignSelf: 'flex-start', // Align the component to the start of the flex container
      marginBottom: 20, // Adjust margin as needed
      marginLeft:15,
      // Remove marginRight if previously set
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20, // Added margin to separate it from other elements
    },
    signUpText: {
      color: '#B51700',
      textDecorationLine: 'underline',
    },
    terms: {
      marginTop: 20,
      alignItems: 'center',
      color: '#827777',
    },
    linkContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    linkText: {
      color: 'lightgrey',
      textDecorationLine: 'underline',
    },
    mainContent: {
      flex: 1, // This ensures that mainContent takes up all available space
    },
    leftarrowStyle: {
      width: 40,
      height: 40,
      marginBottom: 20, // Added margin for spacing
    },
  });

export default Login;


