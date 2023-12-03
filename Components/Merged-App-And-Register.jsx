
// Register Component

// import React from 'react';
// import { View, Text, TouchableOpacity, Linking } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const handleRegister = () => {
//   // Perform your registration logic here
// };

// const Register = () => {
//   const navigation = useNavigation();
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Register Screen</Text>
//       <TouchableOpacity
//         onPress={() => navigation.navigate('Login')}
//         style={{ backgroundColor: 'blue', padding: 10, marginTop: 20 }}
//       >
//         <Text style={{ color: 'white' }}>Go to Login</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={handleRegister}
//         style={{ backgroundColor: 'green', padding: 10, marginTop: 20 }}
//       >
//         <Text style={{ color: 'white' }}>Register</Text>
//       </TouchableOpacity>
//       <View style={{ flexDirection: 'row', marginTop: 20 }}>
//         <TouchableOpacity onPress={() => Linking.openURL('https://www.google.com/accounts/ServiceLogin')}>
//           <Text style={{ color: 'blue' }}>Google</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/login/')}>
//           <Text style={{ color: 'blue', marginLeft: 20 }}>Facebook</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/login')}>
//           <Text style={{ color: 'blue', marginLeft: 20 }}>Twitter</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default Register;


// // App Component with Form

// import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
// import Login from "./Login";
// import Register from "./Register";
// import RestaurantSearch from "./RestaurantSearch";

// const App = () => {
//   const history = useHistory();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = () => {
//     // Do your registration logic here with formData
//     // After registration is complete, you can navigate to another route
//     history.push("/");
//   };

//   return (
//     <Router>
//       <Switch>
//         <Route exact path="/" component={Login} />
//         <Route path="/register" component={Register} />
//         <Route path="/restaurant-search" component={RestaurantSearch} />
//       </Switch>
//       <div>
//         <h1>Register Form</h1>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleInputChange}
//             placeholder="Username"
//           />
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             placeholder="Email"
//           />
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleInputChange}
//             placeholder="Password"
//           />
//           <button type="submit">Register</button>
//         </form>
//       </div>
//     </Router>
//   );
// };

// export default App;

