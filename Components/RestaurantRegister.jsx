
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { ImageBackground } from 'react-native';
import api from '../api/api';
import * as Notifications from 'expo-notifications';
const Register = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "", // Added this
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const registerForPushNotificationsAsync = async () => {
    console.log('Checking notification status...');
    let finalStatus = await checkNotificationStatus();
    
    console.log(`Notification status: ${finalStatus}`);
    if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        return;
    }
    
    console.log('Getting Expo push token...');
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(`Received Expo push token: ${token}`);
    
    console.log('Posting token to server...');
    return postTokenToServer(token, 'Asfandyarkhan').then(() => {
        console.log('Token posted successfully');
    }).catch(error => {
        console.error('Failed to post token to server:', error);
    });
};

const checkNotificationStatus = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    return finalStatus;
};

const getExpoPushTokenWithProjectId = async () => {
    // Replace 'your-project-id' with your actual Expo project ID
    const projectId = 'foodies';
    return (await Notifications.getExpoPushTokenAsync({ experienceId: projectId })).data;
};

const postTokenToServer = async (token, username) => {
  
   await fetch('http://192.168.1.5:4000/saveExpoPushTokenFR', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: token,
            username: username,
        }),
    });
    
};


  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
  
    try {
      const pushToken = await registerForPushNotificationsAsync();
      if (!pushToken) {
        // Handle the case where the user did not allow notifications
        console.log('Push token registration failed.');
        // Depending on your app's requirement you may want to alert the user or proceed with the registration without the push token.
      }
  
      const { username, email, password } = formData; 
      console.log('Form Data: ', formData);
      console.log('Attempting to register with API');
  
      // Attempting to post to the server
      const response = await api.post('/registerRestaurant', { username, email, password, expoPushTokens: pushToken ? [pushToken] : [] });
      
      if (!response.ok) {
        // If the response is not ok, log the entire response
        console.error('API Response not OK', response);
      }
  
      const data = await response.json(); // This assumes response is from Fetch API
      console.log('API Response Data: ', data);
  
      if (data.msg) {
        Alert.alert('Success', 'Registered successfully!');
        // Navigate to login after successful registration
        navigation.navigate('RestaurantLogin');
      } else {
        // Handle any messages from the server (e.g., user already exists)
        Alert.alert('Registration Issue', data.message || 'Failed to register.');
      }
    } catch (error) {
      console.error('Registration Error: ', error);
      Alert.alert('Registration failed!', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('RestaurantLogin')}>
      <ImageBackground source={require('../Images/arrow-left.png')} style={styles.leftarrowStyle} resizeMode="contain"></ImageBackground>
    </TouchableOpacity>
      <Text style={styles.title}>ResSign up</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          placeholderTextColor="#aaa"
          value={formData.username}
          onChangeText={(text) => handleInputChange("username", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          placeholderTextColor="#aaa"
          value={formData.email}
          onChangeText={(text) => handleInputChange("email", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="#aaa"
          value={formData.password}
          onChangeText={(text) => handleInputChange("password", text)}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Re-enter Password"
          placeholderTextColor="#aaa"
          // Assuming you would have a 'confirmPassword' in your formData
           value={formData.confirmPassword}
           onChangeText={(text) => handleInputChange("confirmPassword", text)}
          secureTextEntry={true}
        />
      </View>
      
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already have an account? 
        <Text style={styles.linkText} onPress={() => navigation.navigate('RestaurantLogin')}> Login</Text>
      </Text>
      
      <Text style={styles.footerPolicyText}>
        By Continuing you agree to
        <Text style={styles.linkText} onPress={() => Linking.openURL('#')}> Privacy Policy</Text>,
        <Text style={styles.linkText} onPress={() => Linking.openURL('#')}> Terms & Conditions</Text>, and 
        <Text style={styles.linkText} onPress={() => Linking.openURL('#')}> Content Policy</Text>.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    height: 50,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
  },
  registerButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 16,
    marginBottom: 10,
  },
  linkText: {
    color: '#ff3b30',
  },
  footerPolicyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  leftarrowStyle: {
    width: 40, // adjust this based on the size you want for the icon
    height: 40, // adjust this based on the size you want for the icon
    marginRight: 10,
  },
});

export default Register;
