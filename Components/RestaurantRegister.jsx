
import React, { useState,useEffect  } from 'react';
import { View, Text, TouchableOpacity, Linking, TextInput, StyleSheet,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { ImageBackground } from 'react-native';
import api from '../api/api';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';
const Register = () => {
  const navigation = useNavigation();
  const [isUsernameValid, setUsernameValid] = useState(null);
  const [isEmailValid, setEmailValid] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "", // Added this
  });

  const storeTokenLocally = async (token) => {
    try {
        await AsyncStorage.setItem('expoPushToken', token);
    } catch (e) {
        console.error('Failed to save the token to AsyncStorage', e);
    }
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


const handleInputChange = (name, value) => {
  setFormData({
    ...formData,
    [name]: value,
  });

  if (name === "username") {
    checkUsernameUnique(value);
  } else if (name === "email") {
    checkEmailUnique(value);
  }
};

const checkUsernameUnique = async (username) => {
  // Return early or set a default state if the username is empty
  if (!username.trim()) {
    setUsernameValid(null); // or set to true/false based on your logic
    return;
  }

  try {
    const response = await api.get(`/checkUsername/${username}`);
    setUsernameValid(response.data.unique);
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    setUsernameValid(false); // Handle the error as needed
  }
};


  
const checkEmailUnique = async (email) => {
  // Return early or set a default state if the email is empty
  if (!email.trim()) {
    setEmailValid(null); // or set to true/false based on your logic
    return;
  }
 
  try {
    const response = await api.get(`/checkEmail/${email}`);
    setEmailValid(response.data.unique); // Assuming the API returns 'unique' property
  } catch (error) {
    console.error("Error checking email uniqueness:", error);
    setEmailValid(false); // Handle the error as needed
  }
};


  const registerForPushNotificationsAsync = async () => {
    let finalStatus = await checkNotificationStatus(); // Check or request permissions

    if (finalStatus !== 'granted') {
        Alert.alert('Permission not granted.');
        return;
    }

    // Get the token that uniquely identifies this device
    const token = await getExpoPushTokenWithProjectId(); // This should be just a string
    console.log("Token in registerForPushNotificationsAsync:", token);
    if (!token) {
        Alert.alert('Failed to get push token for push notification!');
        return null;
    }
    // Assume username is stored in your app state
    //const username = formData.username;
    
    if (token) {
      console.log('Push Token to be sent:', token);
      await storeTokenLocally(token);
      return token; // Ensure to return the token
      //await postTokenToServer(token, username);
  } else {
      console.log('Push token registration failed.');
  }
};



const getExpoPushTokenWithProjectId = async () => {
  // Replace 'your-project-id' with your actual Expo project ID
  const projectId = '0d53d6ad-d49d-42ea-a76c-beea06e9ceed';
  const tokenResponse = await Notifications.getExpoPushTokenAsync({ experienceId: projectId });
  console.log("Retrieved Expo Push Token:", tokenResponse.data);
  return tokenResponse.data;
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

const handleSendCode = () => {
  // Endpoint URL
  console.log("Sending verification code for email:", formData.email);
  const endpoint = `http://${API_IP_ADDRESS}/verify-email`;

  // Making a POST request to the backend
  fetch(endpoint, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: formData.email }),
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          Alert.alert(`Code sent to ${formData.email}`);

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

useEffect(() => {
  console.log("Current username validity state:", isUsernameValid);
}, [isUsernameValid]);


const handleRegister = async () => {
  const { username, email, password, confirmPassword } = formData; // Destructure from formData
  // Check if passwords match
  if (formData.password !== formData.confirmPassword) {
    Alert.alert('Error', 'Passwords do not match!');
    return;
  }
  // Check if all fields are filled
if (!username || !email || !password || !confirmPassword) {
  Alert.alert('Error', 'Please fill in all fields.');
  return;
}

// Check if username and email are valid
if (!isUsernameValid) {
  Alert.alert('Error', 'Username is already taken.');
  return;
}
if (!isEmailValid) {
  Alert.alert('Error', 'Email is already in use.');
  return;
  
}
 // Check if email format is valid
 if (!emailValidator.validate(email)) {
  setEmailValid(false); // Set to false as email format is invalid
  Alert.alert('Invalid Email/Email do not Exist', 'Please enter a valid email address.');
  return;
}


  try {
    const pushToken = await registerForPushNotificationsAsync();
    if (pushToken) {
        console.log('Push Token:', pushToken);
        // Proceed to send the token to the server
    } else {
        console.log('Push token registration failed.');
        // Handle the case where no token is retrieved
    }

    navigation.navigate("EmailVerificationFR",{
      username : formData.username,
      email : formData.email,
      password : formData.password
    })

   
    console.log('Form Data: ', formData);

  
  } catch (error) {
    console.error('Registration Error: ', error);
    Alert.alert('Registration failed!', error.message);
  }
};

const handlePress = () => {
  handleRegister();
  handleSendCode();
};

return (
  <ScrollView
contentContainerStyle={styles.scrollViewContentContainer}
scrollEnabled={true} // Ensures that scrolling is enabled
keyboardShouldPersistTaps='handled' // Useful if you have TextInputs inside the ScrollView
>
<View style={styles.mainContent}>
    <TouchableOpacity onPress={() => navigation.navigate('RestaurantLogin')}>
    <ImageBackground source={require('../Images/arrow-left.png')} style={styles.leftarrowStyle} resizeMode="contain"></ImageBackground>
  </TouchableOpacity>
    <Text style={styles.title}>Res Sign up</Text>
    
    <View style={styles.inputContainer}>
    <View style={styles.inputWithValidation}>
  <TextInput
    style={styles.input}
    placeholder="Enter Username"
    placeholderTextColor="#aaa"
    value={formData.username}
    onChangeText={(text) => handleInputChange("username", text)}
  />
  {isUsernameValid !== null && (
    <Text style={styles.validationText}>
      {isUsernameValid ? '✅ Unique' : '❌ Taken'}
    </Text>
  )}
</View>

<View style={styles.inputWithValidation}>
  <TextInput
    style={styles.input}
    placeholder="Enter Email"
    placeholderTextColor="#aaa"
    value={formData.email}
    onChangeText={(text) => handleInputChange("email", text)}
  />
  {isEmailValid !== null && (
    <Text style={styles.validationText}>
      {isEmailValid ? '✅ Unique' : '❌ Taken'}
    </Text>
  )}
</View>

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
      onPress={handlePress}
    >
      <Text style={styles.buttonText}>Sign up</Text>
    </TouchableOpacity>

    <Text style={styles.footerText}>
      Already have an account? 
      <Text style={styles.linkText} onPress={() => navigation.navigate('RestaurantLogin')}> Login</Text>
    </Text>

    </View>
    
    <Text style={styles.footerPolicyText}>
      By Continuing you agree to
      <Text style={styles.linkText} onPress={() => Linking.openURL('#')}> Privacy Policy</Text>,
      <Text style={styles.linkText} onPress={() => Linking.openURL('#')}> Terms & Conditions</Text>, and 
      <Text style={styles.linkText} onPress={() => Linking.openURL('#')}> Content Policy</Text>.
    </Text>
  </ScrollView>
);
};

const styles = StyleSheet.create({
scrollViewContentContainer: {
  flexGrow: 1, // Use flexGrow instead of flex
  alignItems: 'stretch', // Change to 'stretch' to allow content to fill the space
  justifyContent: 'flex-start', // Adjusted for better content alignment
  backgroundColor: '#fff',
  padding: 20,
},
title: {
  fontSize: 32,
  fontWeight: 'bold',
  marginBottom: 40,
  color: 'red', // Change color to red
  alignSelf: 'center', // Center-align the title
},
inputContainer: {
  width: '100%',
},
mainContent: {
  flex: 1, // This will make the main content take up all available space
},
input: {
  flex:1,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 10,
  paddingLeft: 20,
  paddingRight: 10, // Adjust as needed
  height: 50,
  fontSize: 16,
  marginBottom: 20,
  backgroundColor: '#f8f8f8',
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

inputWithValidation: {
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 10,
  backgroundColor: '#f8f8f8',
},
validationText: {
  fontSize: 16,
  marginLeft: 10,
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
  marginLeft:5
},
linkText: {
  color: '#ff3b30',
},
footerPolicyText: {
  fontSize: 14,
  textAlign: 'center',
  marginTop: 10, // Add some top margin for spacing if needed
},
leftarrowStyle: {
  width: 40, // adjust this based on the size you want for the icon
  height: 40, // adjust this based on the size you want for the icon

},
});

export default Register;
