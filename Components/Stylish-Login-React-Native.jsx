
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MongoClient } from 'mongodb'; // You'll need to install the MongoDB Node.js driver

const handleLogin = async () => {
  // MongoDB connection setup (Replace 'your-database-url' and 'your-database-name')
  const client = new MongoClient('your-database-url');
  await client.connect();
  const db = client.db('your-database-name');

  try {
    const response = await api.post('/login', { username, password });
    if (response.data && response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        Alert.alert('Logged in!');
    } else {
        throw new Error('No token received');
    }
} catch (error) {
    console.log(error);
    Alert.alert('Login failed!');
}
};

const Login = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={formData.username}
          onChangeText={(text) => handleInputChange("username", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => handleInputChange("password", text)}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
          <Text style={styles.submitButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('RestaurantSearch')}
      >
        <Text style={styles.buttonText}>Restaurant Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
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
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
  },
  registerButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#f44336',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
});

export default Login;
