import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView,View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { API_IP_ADDRESS } from '../api/config';
import { useTheme } from './ThemeContext'; // Import useTheme
import { useFocusEffect } from '@react-navigation/native';
import { useUserDetails } from './UserContext';

const Profile = ({ route,navigation }) => {
    const { username: initialUsername, email: initialEmail,avatarSource,id } = route.params;
  
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(initialUsername || '');
    const { userDetails, setUserDetails } = useUserDetails();
    const [email, setEmail] = useState(initialEmail || '');
    const [password, setPassword] = useState('************');
    const [editingField, setEditingField] = useState(null);
    const { isDarkMode } = useTheme(); // Use the isDarkMode value from the context
console.log("AvatarSource:",avatarSource);
    useEffect(() => {
        // Fetch userId from AsyncStorage
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    setUserId(storedUserId);
                    console.log("UserId in Profile:",userId);
                }
            } catch (error) {
                console.error("Failed to fetch userId from storage:", error);
            }
        };
        
        fetchUserId();
    }, []);

    useFocusEffect(
      React.useCallback(() => {
          const fetchUserDetails = async () => {
              try {
                  const storedUserId = await AsyncStorage.getItem('userId');
                  if (!storedUserId) {
                      console.error("UserId not found");
                      return;
                  }

                  const response = await fetch(`http://${API_IP_ADDRESS}/user/${storedUserId}`, {
                      method: 'GET',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                  });

                  if (!response.ok) {
                      throw new Error('Failed to fetch user details');
                  }

                  const data = await response.json();
                  
                  // Update context with fetched user details
                  setUserDetails(prev => ({
                      ...prev,
                      username: data.username,
                      email: data.email,
                      userId: storedUserId // Assuming you want to store userId in context
                  }));
              } catch (error) {
                  console.error("Failed to fetch user details:", error);
              }
          };

          fetchUserDetails();
      }, [])
  );
  

    const handleEdit = (field) => {
        setEditingField(field);
    };

    const handleBackPress = () => {
        // If you are using React Navigation, you can call navigation.goBack()
        navigation.goBack();
        // Otherwise, handle the back action accordingly
      };

   // Adjust handleUpdate to update context
   const handleUpdate = async (field, newValue) => {
    if (!userDetails.userId) {
        alert("User ID not found. Please log in again.");
        return;
    }

    // Adjust field name for the schema if necessary
    const schemaField = field === 'Username' ? 'username' : field.toLowerCase();

    try {
      const response = await fetch(`http://${API_IP_ADDRESS}/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userDetails.userId, field: schemaField, newValue }),
    });
        if (!response.ok) {
            throw new Error(`Failed to update: ${response.statusText}`);
        }

        const data = await response.json();
        if (data?.error) {
            alert("Failed to update profile: " + data.error);
        } else {
            // Update user details in context
            setUserDetails(prev => ({
                ...prev,
                [schemaField]: newValue
            }));
            setEditingField(null);
            alert(`${field} updated successfully!`);
        }
    } catch (error) {
        console.error("Update error:", error);
        alert("Failed to update profile: " + error.message);
    }
};

    return (
        <ScrollView style={[styles.container, isDarkMode ? styles.darkContainer : {}]}>
        <View style={[styles.profileHeader, isDarkMode ? styles.darkProfileHeader : {}]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Image
            source={require('../Images/arrow-left.png')} // Replace with the path to your left arrow icon
            style={styles.backIcon}
          />
        </TouchableOpacity>
     <TouchableOpacity style={styles.profilePic}>
      <Image 
        source={route.params.avatarSource ? { uri: route.params.avatarSource.uri } : require('../Images/avatar.png')} 
        style={styles.avatarStyle} // Add your styling for the image here
      />
      </TouchableOpacity>
      <Text style={styles.header}>My Profile</Text>
      </View>
      <View style={styles.itemContainer}>
          <ProfileItem
              label="Username"  // Updated label to Username
              value={username}
              onEdit={handleEdit}
              isEditing={editingField === "Username"}  // Check for "Username" instead of "Name"
              setValue={setUsername}
              setEditingField={setEditingField}
              handleUpdate={handleUpdate}  // Pass handleUpdate here
          />
          <ProfileItem
              label="Email"
              value={email}
              onEdit={handleEdit}
              isEditing={editingField === "Email"}
              setValue={setEmail}
              setEditingField={setEditingField}
              handleUpdate={handleUpdate}  // Pass handleUpdate here
          />
          <ProfileItem
              label="Password"
              value={password}
              onEdit={handleEdit}
              isEditing={editingField === "Password"}
              setValue={setPassword}
              setEditingField={setEditingField}
              handleUpdate={handleUpdate}  // Pass handleUpdate here
          />
      </View>
            <Text style={styles.connectedAccounts}>Connected accounts</Text>
            <AccountItem icon={require('../Images/download.png')} label="Facebook" />
            <AccountItem icon={require('../Images/google.png')} label="Google" connected />
           
        </ScrollView>
    );
};

const ProfileItem = ({ label, value, onEdit, isEditing, setValue, handleUpdate }) => {
    const { isDarkMode } = useTheme(); // Use the isDarkMode value from the context
    return (
        <View style={[styles.profileItem, isDarkMode ? styles.darkProfileItem : {}]}>
        <View style={[styles.labelContainer, isDarkMode ? styles.darkLabelContainer : {}]}>
            <Text style={[styles.label, isDarkMode ? styles.darkLabel : {}]}>{label}</Text>
            {isEditing ? (
                <TextInput
                    style={[styles.value, isDarkMode ? styles.darkValue : {}]}
                    value={value}
                    onChangeText={(text) => setValue(text)}
                    onSubmitEditing={() => handleUpdate(label, value)}
                />
            ) : (
                <Text style={[styles.value, isDarkMode ? styles.darkValue : {}]}>{value}</Text>
            )}
        </View>
        <TouchableOpacity onPress={() => onEdit(label)}>
            <Image source={require('../Images/pencil.png')} 
            style={[styles.pencilIcon, isDarkMode ? styles.darkPencilIcon : {}]}  />
        </TouchableOpacity>
    </View>
);
};


const AccountItem = ({ icon, label, connected }) => {
    const { isDarkMode } = useTheme(); // Use the isDarkMode value from the context
  return (
    <View style={[styles.accountItem, isDarkMode ? styles.darkAccountItem : {}]}>
    <Image source={icon} style={styles.accountIcon} />
    <Text style={[styles.accountLabel, isDarkMode ? styles.darkAccountLabel : {}]}>{label}</Text>
    {connected && <Text style={[styles.accountStatus, isDarkMode ? styles.darkConnected : {}]}>Connected</Text>}
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20, // You can adjust this value
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,  // Move the title down
    marginBottom: 20,
    textAlign: 'center',
    color:'red',
    marginLeft: 20,
    marginRight:170,
  },
  itemContainer: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 20,
    padding: 5,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Align items vertically
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 20, // Increase font size
    fontWeight: '500', // Semi-bold
    color: 'black', // Change color to black
  },
  value: {
    fontSize: 20, // Increase font size
    fontWeight: '500', // Semi-bold
    color: 'gray',
  },
  backButton: {
    marginRight: 10,
  },
  backIcon: {
    marginTop:20,
    width: 45, // Set the width of the back arrow
    height: 45, // Set the height of the back arrow
  },
  darkContainer: {
    backgroundColor: '#121212', // Dark mode background color
  },
  darkProfileHeader: {
    // Dark mode specific styles for profile header
  },
  darkLabel: {
    color: 'white', // Text color for dark mode
  },
  darkHeader: {
    color: 'white', // Dark mode text color
},
darkProfileItem: {
    // Dark mode styles for profile items
},
darkLabelContainer: {
    // Dark mode styles for label container
},
darkLabel: {
    color: 'white', // Dark mode text color
},
darkValue: {
    color: 'lightgrey', // Dark mode text color for values
    backgroundColor: '#222', // Dark mode background color for text input
},
darkAccountItem: {
    // Dark mode styles for account items
},
darkAccountLabel: {
    color: 'white', // Dark mode text color
},
darkConnected: {
    color: 'lightgreen', // Dark mode text color for connected status
},
darkPencilIcon: {
    // Styles for dark mode pencil icon
    // You can adjust the tintColor if your image supports it, or use a different source as shown above
    tintColor: 'white', // Example: changing icon color to white for dark mode
},
  connectedAccounts: {
    fontSize: 24, // Increase font size
    fontWeight: 'bold', // Bold
    marginVertical: 30, // Increase spacing
    color: 'red', // Change color to black
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15, // Increase padding
    borderWidth: 2, // Increase border thickness
    borderColor: '#E0E0E0', // Slightly darker shade of gray
    borderRadius: 8, // Increase border radius
    marginBottom: 20, // Increase spacing
  },
  accountIcon: {
    width: 40,
    height: 40,
  },
  accountLabel: {
    flex: 1,
    marginLeft: 20, // Increase spacing
    fontSize: 20, // Increase font size
    fontWeight: '500', // Semi-bold
    color: 'black', // Change color to black
  },
  connected: {
    color: 'green',
    fontSize: 20, // Increase font size
    fontWeight: '500', // Semi-bold
  },
  pencilIcon: {
    width: 20, // adjust based on your image's size
    height: 20, // adjust based on your image's size
  },
  profilePic: {
    marginTop:25,
    width: 50, // Width of the TouchableOpacity
    height: 50, // Height of the TouchableOpacity
    borderRadius: 50, // Half of width and height to make it circular
    backgroundColor: '#ddd', // A light grey background color
    alignItems: 'center', // Center the image horizontally
    justifyContent: 'center', // Center the image vertically
    overflow: 'hidden', // This will ensure the image does not break the circular shape
    // ... other styles you might need for the touchable opacity
  },
  avatarStyle: {
    width: '100%', // Full width of the TouchableOpacity
    height: '100%', // Full height of the TouchableOpacity
    resizeMode: 'cover', // This ensures the image covers the full area and is not stretched
    // ... other styles you might need for the image
  },
  labelContainer: {
    // This will allow the label and value to be stacked vertically
    flexDirection: 'column',  
  },
});

export default Profile;
