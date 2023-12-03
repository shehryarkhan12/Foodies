import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import api from '../api/api';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', { email, password });
      if (response.data && response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        Alert.alert('Logged in!');
        navigation.navigate('RestaurantSearch');
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Login failed!');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      <TouchableOpacity onPress={() => console.log('Forgot Password')}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => console.log('Sign Up')}>
        <Text style={{ color: 'white' }}>Don't have a login? Sign up</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => console.log('Privacy Policy')}>
          <Text style={styles.link}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Terms & Conditions')}>
          <Text style={styles.link}>Terms & Conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Content Policy')}>
          <Text style={styles.link}>Content Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  link: {
    color: 'gray',
    marginBottom: 10,
  },
});

export default Login;
