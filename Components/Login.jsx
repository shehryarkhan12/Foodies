
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { ImageBackground } from 'react-native';
import * as Facebook from 'expo-facebook';
import ForgetPassword from './ForgetPassword';


// Import your API client, make sure to point to the correct file
import api from '../api/api';




const Login = (props,{route}) => {

  
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
            }
            const avatarSource = await getAvatarFromAsyncStorage();
            
            console.log("Navigating with:", userName, userEmail);  // Logging the extracted data
            //navigation.navigate('RestaurantSearch');
            // Navigate to the Profile screen with username, email, and id
            navigation.navigate('RestaurantSearch', {
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
        Alert.alert('Login failed!');
    }
};





  return (

    <ScrollView contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('StartScreen')}>
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
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
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
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    color: '#FF2147',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: 'white',
    fontSize: 25,
  },
  forgotPassword: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 50,
    marginRight:260,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: 'red',
    textDecorationLine: 'underline',
    marginBottom:240,
  },
  terms: {
    marginTop: 20,
    alignItems: 'center',
    color:'#827777',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
},
linkText: {
    color: 'lightgrey',
    textDecorationLine: 'underline',
},
inputContainer: {
  flexDirection: 'row',
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,
  padding: 10,
  marginBottom: 20,
  alignItems: 'center',
},
iconStyle: {
  width: 24, // adjust this based on the size you want for the icon
  height: 24, // adjust this based on the size you want for the icon
  marginRight: 10,
},
inputWithIcon: {
  flex: 1, // to ensure the input takes up the remaining width
  fontSize: 18,
},
leftarrowStyle: {
  width: 40, // adjust this based on the size you want for the icon
  height: 40, // adjust this based on the size you want for the icon
  marginRight: 10,
},
});

export default Login;


