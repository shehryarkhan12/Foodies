
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet,ScrollView, Animated, ActivityIndicator  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { ImageBackground } from 'react-native';
import * as Facebook from 'expo-facebook';
import ForgetPassword from './ForgetPassword';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonWithLoader from './ButtonWithLoader';

// Import your API client, make sure to point to the correct file
import api from '../api/api';




const Login = (props,{route}) => {

  
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true); // Start loading
    try {
        const { username, password } = formData;

        if (!username || !password) {
          Alert.alert("Input Error", "Please enter both username/email and password.");
          setIsLoading(false);
          return;
      }
      if (!username.trim() || !password.trim()) {
        Alert.alert("Input Error", "Please enter both username/email and password.");
        setIsLoading(false);
        return;
    }
        
        let body = { password };

        // Check if input is an email or username
        if (username.includes('@')) {
            body.email = username;
        } else {
            body.username = username;
        }

        const response = await api.post('/login', body);
        console.log("Server Response:", response.data);

        // Check if response.data exists and it contains a token
        if (response.data && response.data.token) {
            await AsyncStorage.setItem('token', response.data.token);
            
            // Extract email, username, and id from the response
            const userEmail = response.data.profile.email;
            const userName = response.data.profile.username;
            const userId = response.data.profile.id;  // Extracting the id

            props.setUserEmail(response.data.profile.email);
        props.setUserName(response.data.profile.username);
        props.setUserId(response.data.profile.id);

            // If userId exists, save to AsyncStorage
            if (userId) {
                await AsyncStorage.setItem('userId', userId); 
            } else {
                console.warn("User ID not found in the response");
                setIsLoading(false);
            }
            if (userEmail) {
              await AsyncStorage.setItem('userEmail', userEmail); 
              console.log("Email setted correctly in AsyncStorage:",userEmail);
          } else {
              console.warn("User Email not found in the response");
              setIsLoading(false);
          }
            const avatarSource = await getAvatarFromAsyncStorage();
            
            console.log("Navigating with:", userName, userEmail,userId);  // Logging the extracted data
            //navigation.navigate('RestaurantSearch');
            // Navigate to the Profile screen with username, email, and id
            navigation.navigate('RestaurantSearch', {
                email: userEmail,
                username: userName,
                id: userId,
                avatarSource: avatarSource
            });
        // Optionally, delay resetting isLoading to ensure the user sees the transition
        setTimeout(() => {
          setIsLoading(false); // Stop loading after initiating navigation
      }, 500); // Adjust the delay as needed based on user experience
  } else {
      setIsLoading(false); // Stop loading if no token received
      throw new Error('No token received');
  }
    } catch (error) {
        console.log(error);
        Alert.alert('Login Error', 'Invalid username/email or password.');
        setIsLoading(false); // Ensure loading state is reset on error
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
      <Text style={styles.header}>Login</Text>
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
      <View style={styles.loginButton}>
      <ButtonWithLoader
        onPress={handleLogin}
        buttonText="Login"
        isLoading={isLoading}
        style={{ margin: 10, height: 50 }} // Customize as needed
        textStyle={{ color: '#fff',fontSize:25 }} // Customize as needed
        gradientColors={['#F87575', '#E63946', '#B51700']}
      />
      </View>
      <View style={styles.footer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
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
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    marginBottom:50,
    paddingTop: 20, // Adjust top padding as needed
    paddingBottom: 0, // Reduced bottom padding
    backgroundColor: '#fff',
  },
appIcon: {
  width: 120,
  height: 120,
  borderRadius: 20, // Slightly rounded corners for the icon
},
appName: {
    fontSize: 35, // Consider making it larger for a bold appearance
    fontWeight: 'bold',
    marginLeft:0, // Space between the icon and the text
    color: '#B51902',
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
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30, // Reduced margin for better responsiveness
    color: '#B51700',
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
    marginBottom: 0,
  },
  loginText: {
    color: 'white',
    fontSize: 20, // Adjusted for better readability across devices
  },
  forgotPassword: {
    color: '#B51902',
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
    color: '#B51902',
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


