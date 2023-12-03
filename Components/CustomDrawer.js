import React, { useState, useEffect, useRef, useContext } from 'react';
import { Alert,View, Text, Image, StyleSheet, TouchableOpacity, Button, Modal } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomLabel from './CustomLabel';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import MyFavourites from './MyFavourites';
import CameraContext from './CameraContext';
import AvatarContext from './AvatarContext';
import { FavouritesProvider } from './favouritesContext';
import * as Location from 'expo-location';
import { useTheme } from './ThemeContext'; // Import useTheme

function CustomDrawer(props) {
 
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isActionMenuVisible, setActionMenuVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const [avatarSource, setAvatarSource] = useState(null);
  const cameraRef = useRef(null);
  const { isDarkMode } = useTheme(); // Use the isDarkMode value from the context

  

  const saveAvatarToStorage = async (avatarUri) => {
    try {
        await AsyncStorage.setItem('avatarSource', JSON.stringify(avatarUri));
    } catch (error) {
        console.error("Error saving avatar: ", error);
    }
};

const fetchStoredAvatar = async () => {
    const storedAvatar = await AsyncStorage.getItem('avatarSource');
    
    if (storedAvatar) {
      setAvatarSource(JSON.parse(storedAvatar));
    }
  };


  const capturePhoto = async () => {
    if (cameraRef && cameraRef.current) {
      try {
        let photo = await cameraRef.current.takePictureAsync();
        if (photo && photo.uri) {
          // Show an alert to the user
          Alert.alert(
            'Confirmation',
            'Do you want to set this as your profile picture?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: async () => {
                  setAvatarSource({ uri: photo.uri });
                  const testAvatar = await AsyncStorage.getItem('avatarSource');
                  console.log("Test Avatar:", testAvatar);
                  await saveAvatarToStorage({ uri: photo.uri });
                  setIsCameraVisible(false); // Hide the camera
                },
              },
            ],
            { cancelable: false },
          );
        }

      } catch (error) {
        console.log("Error taking picture: ", error);
      }
    } else {
      console.log("Camera reference is not ready yet.");
    }
  };

 
  

  useEffect(() => {
    (async () => {
      // Requesting permission for media library
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      // Requesting permission for the camera
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      
      // Requesting permission for location
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (mediaLibraryStatus !== 'granted' || cameraStatus !== 'granted' || locationStatus !== 'granted') {
        setErrorMsg('Permission to access media library, camera, or location was denied');
        return;
      }
      fetchStoredAvatar();
  
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      fetchStoredAvatar();
      console.log('Component Mounted');

  return () => {
    console.log('Component Unmounted');
  };
    })();
    
  }, []);
  

  


  const selectPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      setAvatarSource({ uri });
      await saveAvatarToStorage({ uri });  // Save to AsyncStorage
    }
    setActionMenuVisible(false); // Hide action menu
  };

  const navigation = useNavigation();

  if (isCameraVisible) {
    return (
        <View style={{ flex: 1, width: '100%', height: '100%' }}>
        <Camera style={{ flex: 1 }} type={Camera.Constants.Type.front} ref={cameraRef} />
        <Button title="Capture" onPress={capturePhoto} />
        <Button title="Cancel" onPress={() => setIsCameraVisible(false)} />
      </View>
    );
  }
    return (
        <FavouritesProvider>  
         <DrawerContentScrollView style={[styles.container, isDarkMode ? styles.darkContainer : {}]} {...props}>
        <View>
        <View style={[styles.headerContainer, isDarkMode ? styles.darkHeaderContainer : {}]}>
          <TouchableOpacity onPress={() => setActionMenuVisible(prevState => !prevState)}>
  <Image
    source={avatarSource || require('../Images/avatar.png')}
    style={styles.avatar}
  />
</TouchableOpacity>
<Text style={[styles.name, isDarkMode ? styles.darkName : {}]}>{props.userName}</Text>
      <Text style={[styles.email, isDarkMode ? styles.darkEmail : {}]}>{props.userEmail}</Text>
          </View>
  
          {/* Action Menu */}
          {isActionMenuVisible && (
            <View style={styles.actionMenu}>
              <TouchableOpacity onPress={() => { setIsCameraVisible(true); setActionMenuVisible(false); }}>

    <Image source={require('../Images/camera.png')} style={{ width: 30, height: 30 }} />
</TouchableOpacity>
              <TouchableOpacity onPress={selectPhoto}>
              <Image source={require('../Images/gallery.png')} style={{ width: 30, height: 30 }} />
              </TouchableOpacity>
            </View>
          )}
           
            
            <DrawerItem 
    label={() => <CustomLabel text="My Profile" />} 
    labelStyle={styles.itemLabel} 
    onPress={() => navigation.navigate('Profile', {
        email: props.userEmail,
        username: props.userName,
        id: props.userId,
        avatarSource: avatarSource
    })}
          /> 
            <DrawerItem labelStyle={styles.itemLabel}  label={() => <CustomLabel text="My Favourites" />} onPress={() => navigation.navigate('MyFavourites')} />
            <DrawerItem labelStyle={styles.itemLabel} label={() => <CustomLabel text="Previous Orders" />} onPress={() => navigation.navigate('OrderDetails')} />
            <DrawerItem labelStyle={styles.itemLabel} label={() => <CustomLabel text="Notifications" />} onPress={() => navigation.navigate('NotificationScreen')} />
            <DrawerItem  label={() => <CustomLabel text="Address" />} labelStyle={styles.itemLabel} onPress={() => navigation.navigate('AddressScreen')} />
            <DrawerItem label={() => <CustomLabel text="Settings" />} labelStyle={styles.itemLabel} onPress={() => navigation.navigate('Settings')} />
            <DrawerItem label={() => <CustomLabel text="Help Center" />} labelStyle={styles.itemLabel} onPress={() => {}} />
            <DrawerItem 
  label={() => <CustomLabel text="Log Out" />}
  labelStyle={styles.itemLabel} 
  onPress={ () => {
    // Clear user session data from AsyncStorage
    // await AsyncStorage.removeItem('avatarSource');  // Remove stored avatar
    // Add any other session-related keys that you want to clear

    // Navigate user back to Login or any initial screen you have
    navigation.navigate('Login');
  }} 
/>
            </View>
        </DrawerContentScrollView>
        </FavouritesProvider>  
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        alignItems: 'center', 
        padding: 20, 
        backgroundColor: '#FFEBEE',
    },
    avatar: {
        width: 80, 
        height: 80, 
        borderRadius: 40
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginTop: 5
    },
    itemLabel: {
      color: '#333',
      fontSize: 16,
      fontWeight: 'bold',
      padding: 15,
      backgroundColor: '#fff',
    },
    darkContainer: {
      backgroundColor: '#121212', // Dark mode background color
    },
    darkHeaderContainer: {
      backgroundColor: '#1A1A1A', // Dark mode header background color
    },
    darkItemLabel: {
      color: 'white', // Dark mode item label color
    },
    darkName: {
      color: 'white', // Example dark mode text color for user name
    },
    darkEmail: {
      color: 'white', // Example dark mode text color for user email
    },
    darkActionMenu: {
      backgroundColor: '#2A2A2A', // Example dark mode background color for action menu
    },
    
    actionMenu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#eee',
    },
});

export default CustomDrawer;


