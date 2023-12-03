
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = () => {
    // Perform your registration logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Screen</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={formData.username}
          onChangeText={(text) => handleInputChange("username", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => handleInputChange("email", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => handleInputChange("password", text)}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.submitButton} onPress={() => { /* Your submit logic here */ }}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.googleButton} onPress={() => Linking.openURL('https://www.google.com/accounts/ServiceLogin')}>
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.facebookButton} onPress={() => Linking.openURL('https://www.facebook.com/login/')}>
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.twitterButton} onPress={() => Linking.openURL('https://twitter.com/login')}>
          <Text style={styles.socialButtonText}>Twitter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: 'green',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  socialButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  googleButton: {
    backgroundColor: '#db4437',
    padding: 10,
    borderRadius: 5,
  },
  facebookButton: {
    backgroundColor: '#3b5998',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  twitterButton: {
    backgroundColor: '#1da1f2',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  socialButtonText: {
    color: 'white',
  },
});

export default Register;
