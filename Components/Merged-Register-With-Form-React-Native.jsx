
// Register Component with Form

import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const handleRegister = () => {
  // Perform your registration logic here
};

const Register = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Register Screen</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={{ backgroundColor: 'blue', padding: 10, marginTop: 20 }}
      >
        <Text style={{ color: 'white' }}>Go to Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleRegister}
        style={{ backgroundColor: 'green', padding: 10, marginTop: 20 }}
      >
        <Text style={{ color: 'white' }}>Register</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.google.com/accounts/ServiceLogin')}>
          <Text style={{ color: 'blue' }}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/login/')}>
          <Text style={{ color: 'blue', marginLeft: 20 }}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/login')}>
          <Text style={{ color: 'blue', marginLeft: 20 }}>Twitter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;



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

// Inside your component's return statement
<View>
  <TextInput
    placeholder="Username"
    value={formData.username}
    onChangeText={(text) => handleInputChange("username", text)}
  />
  <TextInput
    placeholder="Email"
    value={formData.email}
    onChangeText={(text) => handleInputChange("email", text)}
  />
  <TextInput
    placeholder="Password"
    value={formData.password}
    onChangeText={(text) => handleInputChange("password", text)}
    secureTextEntry={true}
  />
  <TouchableOpacity onPress={() => { /* Your submit logic here */ }}>
    <Text>Submit</Text>
  </TouchableOpacity>
</View>

