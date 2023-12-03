import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_IP_ADDRESS } from '../api/config';


const NewPassword = ({route}) => {
  const navigation = useNavigation();
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordUpdate = async () => {
    // Check if password and confirmPassword are the same
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
  
    // Endpoint URL for updating password
    const endpoint = `http://${API_IP_ADDRESS}/set-new-password`; // Replace with your actual endpoint
  
    // Making a POST request to the backend
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        email: email, // Replace with the actual email
        newPassword: password 
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        Alert.alert("Success", "Password updated successfully.");
        navigation.navigate('Login'); 
      } else {
        Alert.alert("Error", data.message || "Failed to update password.");
      }
    })
    .catch(error => {
      Alert.alert("An error occurred. Please try again.");
      console.error("There was an error updating the password:", error);
    });
  };

  return (
    <View style={styles.container}>
    <Text style={styles.headerText}>Create New Password</Text>
    <Text style={styles.subHeaderText}>Create a new unique password</Text>
    <ImageBackground source={require('../Images/lock.png')} style={[styles.iconStyle, { top: 340 }]} resizeMode="contain" />
    <TextInput 
      style={styles.input}
      placeholder="Enter Password"
      secureTextEntry={true}
      onChangeText={setPassword}
    />
    <ImageBackground source={require('../Images/lock.png')} style={[styles.iconStyle, { top: 405 }]} resizeMode="contain" />
    <TextInput 
      style={styles.input}
      placeholder="Enter Confirm Password"
      secureTextEntry={true}
      onChangeText={setConfirmPassword}
    />
      <TouchableOpacity style={styles.confirmButton} onPress={handlePasswordUpdate}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
      
      <Text style={styles.footerText}>By Continuing you agree to</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
      <Text style={styles.linkText}>Privacy Policy</Text>
      
      <Text style={styles.linkText}>Terms & Conditions</Text>
      <Text style={styles.linkText}>Content Policy</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 200,
    color: 'red'
  },
  subHeaderText: {
    fontSize: 18,
    marginBottom: 40,
    color: 'grey',
    fontWeight: '500',
  },
  input: {
    width: '90%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 40,
    fontSize: 18,
    
  },
  confirmButton: {
    width: '50%',
    height: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 30,
    marginTop:30,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    
  },
  footerText: {
    fontSize: 16,
    marginTop:150,
    marginBottom: 10,
    color: 'grey',
  },
  linkText: {
    fontSize: 16,
    color: 'lightgrey',
    textDecorationLine: 'underline',
    marginBottom: 2,
    marginLeft: 10,
  },
  iconStyle: {
    position: 'absolute',
    width: 24, // adjust this based on the size you want for the icon
    height: 24, // adjust this based on the size you want for the icon
    right: 340,
    zIndex: 1,
  },
});


export default NewPassword;