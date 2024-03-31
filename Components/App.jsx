import React,{useState} from 'react';
import { Image,View, Text, TextInput, Button, StyleSheet,Alert,ScrollView, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer'; 
import { FavouritesProvider } from './favouritesContext';
import Login from './Login';
import Register from './Register';
import StartScreen from './StartScreen';
import newLogin from './newLogin';
import ForgetPassword from './ForgetPassword';
import OTP from './OTP';
import NewPassword from './NewPassword';
import Profile from './Profile';
import Zoom from './Zoom';
import UpdatedRestaurantSearch from './UpdatedRestaurantSearch';
import RestaurantSearch from './RestaurantSearch';
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
import { useTheme } from './ThemeContext'; 
import HelpCenterScreen from './HelpCenterScreen';
import ChatScreen from './ChatScreen';
import SearchResultsScreen from './SearchResultsScreen';
import RestaurantDetailsScreen from './RestaurantDetails';
import SplashScreen from './SplashScreen';
import { RestaurantsProvider } from './RestaurantsContext';
import EmailVerification from './EmailVerification';
import FilterScreen from './FilterScreen';
import OrderDelivery from './OrderDelivery';
import OrderItem from './OrderItem';
import OrdersScreen from './OrdersScreen';
import NotificationScreenFU from './NotificationScreenFU';
import CombinedOrderScreen from './CombinedOrderScreen';
import PaymentScreen from './PaymentScreen';
import OrderComplete from './OrderComplete';
import CustomDrawerFR from './CustomDrawerFR';
import Pagination from './Pagination';
import Question from './Question';
import EmailVerificationFR from './EmailVerificationFR';
import { HeartAnimationProvider } from './HeartAnimationContext';
import { UserProvider } from './UserContext';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import TabButton from './TabButton';
import { useRestaurants } from './RestaurantsContext';
import CartScreen from './CartScreen';

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
  const {restaurantName} = useRestaurants();
  const navigation = useNavigation();
  const { userEmail, userName, userId,avatarSource } = route.params;


  // This state will track the animated value
  const tabWidths = {
    Home: useSharedValue(100),
    Profile: useSharedValue(100),
    Favourites: useSharedValue(100),
    Settings: useSharedValue(100),
  };



  const getTabBarStyle = () => {
    const baseStyle = {
      borderTopLeftRadius: 30, // Round the top left edge
      borderTopRightRadius: 30, // Round the top right edge
      position: 'absolute', // Needed to make sure the corners and shadow are visible
      
      elevation: 5, // Remove default shadow on Android
      shadowColor: '#000', // Shadow color for iOS
      shadowOffset: {
        width: 0,
        height: -10, // Shadow on top of the container
      },
      shadowOpacity: 1, // Subtle shadow opacity
      shadowRadius: 10, // Shadow blur radius
    };
    if (isDarkMode) {
      return {
        ...baseStyle,
        backgroundColor: '#121212', // Dark mode background color
        borderTopColor: '#333333', // Dark mode top border color
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: '#FFF',
        borderTopColor: '#ddd', // Light border color for top edge if needed
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

    
    Object.keys(tabWidths).forEach((key) => {
      tabWidths[key].value = withTiming(iconName === key ? 150 : 100, {
        duration: 250,
        easing: Easing.out(Easing.quad), // Easing function for a quicker response
      });
    });
  };
  
  const animatedTabStyle = (tabName) => useAnimatedStyle(() => {
    return {
      width: tabWidths[tabName].value,
      height: 50, // Fixed height for tabs
      justifyContent: 'center',
      alignItems: 'center',
      // Add shadow style here if you want
    };
  });
 
  
  return (
    <ItemsProvider>
      <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} userEmail={route.params.email} userName={route.params.username} userId={route.params.id} />}>
        
        <Drawer.Screen name="home" options={{ headerShown: false }}>
          {() => (
            <Tab.Navigator 
            screenOptions={{
              headerShown: false,
              lazy: true, // Render the tab screen only when it comes into focus
              tabBarStyle: [getTabBarStyle(), { height: 70 }], // Adjust height as needed
            }}
          >
            <Tab.Screen 
              name="Home" 
              component={RestaurantSearch}
              initialParams={{
                email: route.params.email,
                 username: route.params.username,
                 id: route.params.id,
                 avatarSource: avatarSource
             }}
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
                unmountOnBlur: true,
                tabBarButton: (props) => <TabButton {...props} item={{ name: 'Home', activeIconName: 'home', inactiveIconName: 'home-outline' }} />,
      tabBarShowLabel: false,
                
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
                unmountOnBlur: true, // Add this option to unmount the screen when it's not focused
                tabBarButton: (props) => <TabButton {...props} item={{ name: 'Profile', activeIconName: 'person', inactiveIconName: 'person-outline' }} />,
                tabBarShowLabel: false,
                
              }} 
            />
            <Tab.Screen 
              name="Search" 
              component={SearchResultsScreen}
              initialParams={{
                searchTerm: restaurantName
             }}
              listeners={{
                tabPress: (e) => {
                  // This prevents the default action
                 // e.preventDefault();
                  setActiveTab('Search');
                  // Add navigation to switch to the corresponding tab
                  navigation.navigate('SearchResultsScreen');
                }
              }}
              options={{
                tabBarLabel: 'Search',
                unmountOnBlur: true, // Add this option to unmount the screen when it's not focused
                tabBarButton: (props) => <TabButton {...props} item={{ name: 'Search', activeIconName: 'search', inactiveIconName: 'search-outline' }} />,
                
              }} 
            />
            <Tab.Screen 
              name="Favourites" 
              component={MyFavourites}
              listeners={{
                tabPress: (e) => {
                  // This prevents the default action
                 //e.preventDefault();
                  setActiveTab('Favourites');
                  // Add navigation to switch to the corresponding tab
                  navigation.navigate('Favourites');
                }
              }}
              options={{
                tabBarLabel: 'Favourites',
                unmountOnBlur: true, // Add this option to unmount the screen when it's not focused
                tabBarButton: (props) => <TabButton {...props} item={{ name: 'Favourites', activeIconName: 'heart', inactiveIconName: 'heart-outline' }} />,
                
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
                unmountOnBlur: true, // Add this option to unmount the screen when it's not focused
                tabBarButton: (props) => <TabButton {...props} item={{ name: 'Settings', activeIconName: 'settings', inactiveIconName: 'settings-outline' }} />,
                tabBarShowLabel: false,
                
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
        <CustomDrawerFR 
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
    <HeartAnimationProvider>
    <RestaurantsProvider>
    <ThemeProvider>
    <PriceProvider>
    <ItemsProvider>
    <UserProvider>
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
        <Stack.Navigator initialRouteName="CartScreen">
          <Stack.Screen name="Login" options={{ headerShown: false }} >
          {props => <Login {...props} setUserEmail={setUserEmail} setUserName={setUserName} setUserId={setUserId} />}
            </Stack.Screen>
            <Stack.Screen name="Drawer" options={{ headerShown: false }}>
   {props => <RestaurantSearchWithDrawer {...props} userEmail={userEmail} userName={userName} userId={userId} />}
</Stack.Screen>
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
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
          <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HelpCenterScreen" component={HelpCenterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RestaurantDashboard" component={RestaurantDashboardWithDrawer} options={{ headerShown: false }} />
          <Stack.Screen name="RestaurantRegister" component={RestaurantRegister} options={{ headerShown: false }}  />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NotificationScreenFU" component={NotificationScreenFU} options={{ headerShown: false }} />
          <Stack.Screen name="ConfirmOrder" component={ConfirmOrderScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OrderDetails" component={OrderScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SearchResultsScreen" component={SearchResultsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EmailVerification" component={EmailVerification} options={{ headerShown: false }} />
          <Stack.Screen name="FilterScreen" component={FilterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OrderDelivery" component={OrderDelivery} options={{ headerShown: false }} />
          <Stack.Screen name="OrderItem" component={OrderItem} options={{ headerShown: false }} />
          <Stack.Screen name="OrdersScreen" component={OrdersScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CombinedOrderScreen" component={CombinedOrderScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OrderComplete" component={OrderComplete} options={{ headerShown: false }} />
          <Stack.Screen name="Pagination" component={Pagination} options={{ headerShown: false }} />
          <Stack.Screen name="Question" component={Question} options={{ headerShown: false }} />
          <Stack.Screen name="EmailVerificationFR" component={EmailVerificationFR} options={{ headerShown: false }} />
          <Stack.Screen name="CartScreen" component={CartScreen} options={{ headerShown: false }} />

        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
    </FavouritesProvider>
    </CameraContext.Provider>
    </AvatarContext.Provider>
    </NotificationProvider>
    </UserProvider>
    </ItemsProvider>
    </PriceProvider>
    </ThemeProvider>
    </RestaurantsProvider>
    </HeartAnimationProvider>
  );
};

export default App;
