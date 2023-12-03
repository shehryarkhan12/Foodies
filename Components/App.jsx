import React,{useState} from 'react';
import { Image,View, Text, TextInput, Button, StyleSheet,Alert,ScrollView, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer'; // Adjust the path accordingly
import { FavouritesProvider } from './favouritesContext';
import Login from './Login';
import Register from './Register';
import StartScreen from './StartScreen';
import newLogin from './newLogin';
import RestaurantDetails from './RestaurantDetails';
import ForgetPassword from './ForgetPassword';
import OTP from './OTP';
import NewPassword from './NewPassword';
import Profile from './Profile';
import Zoom from './Zoom';
import UpdatedRestaurantSearch from './UpdatedRestaurantSearch';
import RestaurantSearch from './RestaurantSearch';  // I assume you already have this imported
import MyFavourites from './MyFavourites';
import CameraContext from './CameraContext.js';
import AvatarContext from './AvatarContext';
import MenuScreen from './MenuScreen';
import RestaurantDashboard from './RestaurantDashboard';
import RestaurantLogin from './RestaurantLogin';
import RestaurantRegister from './RestaurantRegister';
import { NotificationProvider } from './NotificationContext';
import NotificationScreen from './NotificationScreen';
import ConfirmOrderScreen from './ConfirmOrder';
import { ItemsProvider } from './ItemsContext';
import { PriceProvider } from './PriceContext';
import OrderScreen from './OrderDetails';
import RestaurantSearch2 from './RestaurantSearch2';
import CustomTabNavigator from './CustomTabNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddressScreen from './AddressScreen';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Settings from './Settings';
import { ThemeProvider } from './ThemeContext';
import { useTheme } from './ThemeContext'; // Import useTheme

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


const RestaurantSearchWithDrawer = ({ route}) => {
  const { isDarkMode } = useTheme(); // Use the isDarkMode value from the context
  const [activeTab, setActiveTab] = useState('Home');
  const [clickedStates, setClickedStates] = useState({
    Home: true,
    Profile: false,
    Favourites: false,
    Settings: false,
  });
  const navigation = useNavigation();
  const { userEmail, userName, userId,avatarSource } = route.params;
  console.log("avatarSource:",route.params.avatarSource);
  const getTabBarStyle = () => {
    if (isDarkMode) {
      return {
        backgroundColor: '#121212', // Dark mode background color
        borderTopColor: '#333333', // Dark mode top border color
      };
    } else {
      return {
        backgroundColor: 'white',
      };
    }
  };

  const getIconColor = (isFocused, iconName) => {
    if (isDarkMode) {
      return isFocused ? '#4ecca3' : '#bbbbbb'; // Adjust focused and unfocused colors for dark mode
    } else {
      return clickedStates[iconName] ? 'blue' : 'black'; // Original colors
    }
  };

  const iconStyle = {
    width: 30, // Set the width of the icon
    height: 30, // Set the height of the icon
    resizeMode: 'contain', // Ensure the entire image fits within the dimensions
  };
  const handleIconClick = (iconName, params) => {
    if (params) {
      navigation.navigate(iconName, params);
    } else {
      navigation.navigate(iconName);
    }
    setActiveTab(iconName);
  
    // Update the clicked state for only the clicked icon and reset others
    setClickedStates(prevStates => ({
      Home: iconName === 'Home' ? !prevStates.Home : false,
      Profile: iconName === 'Profile' ? !prevStates.Profile : false,
      Favourites: iconName === 'Favourites' ? !prevStates.Favourites : false,
      Settings: iconName === 'Settings' ? !prevStates.Settings : false,
    }));
  };
  
 
  
  return (
    <ItemsProvider>
      <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} userEmail={route.params.email} userName={route.params.username} userId={route.params.id} />}>
        
        <Drawer.Screen name="home" options={{ headerShown: false }}>
          {() => (
            <Tab.Navigator 
            screenOptions={{
              headerShown: false,
              tabBarStyle: getTabBarStyle(),
            }}
          >
            <Tab.Screen 
              name="Home" 
              component={RestaurantSearch}
              listeners={{
                tabPress: (e) => {
                  // This prevents the default action
                  //e.preventDefault();
                  setActiveTab('Home');
                  // Add navigation to switch to the corresponding tab
                  navigation.navigate('Home');
                }
              }}
              options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color,focused,size }) => (
                  
                  <TouchableOpacity onPress={() => handleIconClick('Home')}>
      <Ionicons
        name="home-outline"
        color={getIconColor(focused, 'Home')}
       
        size={size}
      />
    </TouchableOpacity>
                  
                ),
              }} 
            />
            <Tab.Screen 
              name="Profile" 
              component={Profile}
              initialParams={{
                 email: route.params.email,
                  username: route.params.username,
                  id: route.params.id,
                  avatarSource: avatarSource
              }}
              listeners={{
                tabPress: (e) => {
                  // This prevents the default action
                 // e.preventDefault();
                  setActiveTab('Profile');
                  // Add navigation to switch to the corresponding tab
                  navigation.navigate('Profile');
                }
              }}
              options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color,focused,size }) => (
                  
                  <TouchableOpacity
  onPress={() => handleIconClick('Profile', {
    email: route.params.email,
    username: route.params.username,
    id: route.params.id,
    avatarSource: avatarSource,
  })}
>
  <Ionicons
    name="person-outline"
    color={getIconColor(focused, 'Home')}
    size={size}
  />
</TouchableOpacity>
                  
                ),
              }} 
            />
            <Tab.Screen 
              name="Favourites" 
              component={MyFavourites}
              listeners={{
                tabPress: (e) => {
                  // This prevents the default action
                 // e.preventDefault();
                  setActiveTab('Favourites');
                  // Add navigation to switch to the corresponding tab
                  navigation.navigate('Favourites');
                }
              }}
              options={{
                tabBarLabel: 'Favourites',
                tabBarIcon: ({ color,focused,size }) => (
                  
                  <TouchableOpacity onPress={() => handleIconClick('Favourites')}>
      <Ionicons
        name="heart-outline"
        color={getIconColor(focused, 'Home')}
        size={size}
      />
    </TouchableOpacity>
                  
                ),
              }} 
            />
            <Tab.Screen 
              name="Settings" 
              component={Settings}
              listeners={{
                tabPress: (e) => {
                  // This prevents the default action
                  //e.preventDefault();
                  setActiveTab('Settings');
                  // Add navigation to switch to the corresponding tab
                  navigation.navigate('Settings');
                }
              }}
              options={{
                tabBarLabel: 'Settings',
                tabBarIcon: ({ color,focused,size }) => (
                  
                  <TouchableOpacity onPress={() => handleIconClick('Settings')}>
      <Ionicons
        name="settings-outline"
        color={getIconColor(focused, 'Home')}
        size={size}
      />
    </TouchableOpacity>
                  
                ),
              }} 
            />
          </Tab.Navigator>
          )}
        </Drawer.Screen>

        {/* Add more Drawer Screens here if needed */}
      </Drawer.Navigator>
    </ItemsProvider>
  );
};
const RestaurantDashboardWithDrawer = ({ route }) => {
  console.log('Params in RestaurantDashboardWithDrawer:', route.params);
  const { userEmail, userName, id } = route.params;

  return (
    <ItemsProvider>
    <Drawer.Navigator 
      drawerContent={props => 
        <CustomDrawer 
          {...props} 
          userEmail={route.params.email} 
          userName={route.params.username} 
          userId={route.params.id} 
        />
      }
    >
      <Drawer.Screen name="home" component={RestaurantDashboard}  />
    </Drawer.Navigator>
    </ItemsProvider>
  );
};


const App = () => {
  const [selectedItems, setSelectedItems] = useState([]);  // State definition here
  const [userEmail, setUserEmail] = useState('default@email.com');
  const [userName, setUserName] = useState('Default Name');
  const [userId, setUserId] = useState('');
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [avatarSource, setAvatarSource] = useState(null);
  const [orderId, setOrderId] = useState(null);

  return (
    <ThemeProvider>
    <PriceProvider>
    <ItemsProvider>
    <NotificationProvider>
    <AvatarContext.Provider value={{ avatarSource, setAvatarSource }}>
    <CameraContext.Provider value={{
      isCameraVisible,
      showCamera: () => setIsCameraVisible(true),
      hideCamera: () => setIsCameraVisible(false),
  }}>
    <FavouritesProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      
      <NavigationContainer>
        <Stack.Navigator initialRouteName="StartScreen">
          <Stack.Screen name="Login" options={{ headerShown: false }} >
          {props => <Login {...props} setUserEmail={setUserEmail} setUserName={setUserName} setUserId={setUserId} />}
            </Stack.Screen>
            <Stack.Screen name="Drawer" options={{ headerShown: false }}>
   {props => <RestaurantSearchWithDrawer {...props} userEmail={userEmail} userName={userName} userId={userId} />}
</Stack.Screen>
            
          <Stack.Screen name="Register" component={Register} options={{ title: '' }} />
          <Stack.Screen name="CustomTabNavigator" component={CustomTabNavigator} options={{ title: '' }} />
          <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RestaurantSearch" component={RestaurantSearchWithDrawer} options={{ headerShown: false }} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown: false }} />
          <Stack.Screen name="OTP" component={OTP} options={{ headerShown: false }} />
          <Stack.Screen name="NewPassword" component={NewPassword} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
          <Stack.Screen name="Zoom" component={Zoom} options={{ headerShown: false }} />
          <Stack.Screen name="MyFavourites" component={MyFavourites} options={{ headerShown: false }} />
          <Stack.Screen name="MenuScreen" component={MenuScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AddressScreen" component={AddressScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
          <Stack.Screen name="RestaurantLogin" component={RestaurantLogin} options={{ headerShown: false }} />
          
          <Stack.Screen name="RestaurantDashboard" component={RestaurantDashboardWithDrawer} options={{ headerShown: false }} />
          <Stack.Screen name="RestaurantRegister" component={RestaurantRegister}  />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ConfirmOrder" component={ConfirmOrderScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OrderDetails" component={OrderScreen} options={{ headerShown: false }} />

        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
    </FavouritesProvider>
    </CameraContext.Provider>
    </AvatarContext.Provider>
    </NotificationProvider>
    </ItemsProvider>
    </PriceProvider>
    </ThemeProvider>
  );
};

export default App;
