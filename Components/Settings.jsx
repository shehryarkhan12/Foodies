import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from './ThemeContext';
const Settings = ({ navigation }) => {
  // State variables for the switches
  const [isNotificationsMuted, setNotificationsMuted] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  // Function to handle back button press
  const handleBackPress = () => {
    // If you are using React Navigation, you can call navigation.goBack()
    navigation.goBack();
    // Otherwise, handle the back action accordingly
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkContainer : {}]}>
      <View style={[styles.headerContainer, isDarkMode ? styles.darkHeaderContainer : {}]}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <Image
            source={require('../Images/arrow-left.png')} // Adjust the image for better visibility in dark mode
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={[styles.header, isDarkMode ? styles.darkHeader : {}]}>Settings</Text>
      </View>
      <View style={[styles.settingRow, isDarkMode ? styles.darkSettingRow : styles.border]}>
        <Text style={[styles.settingText, isDarkMode ? styles.darkSettingText : {}]}>Mute notifications</Text>
        <Switch
          value={isNotificationsMuted}
          onValueChange={() => setNotificationsMuted(!isNotificationsMuted)}
        />
      </View>
      <View style={[styles.settingRow, isDarkMode ? styles.darkSettingRow : styles.border]}>
        <Text style={[styles.settingText, isDarkMode ? styles.darkSettingText : {}]}>Theme</Text>
        <View style={styles.themeSwitchContainer}>
          <Text style={[styles.themeText, isDarkMode ? styles.darkThemeText : {}]}>Light mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
          />
          <Text style={[styles.themeText, isDarkMode ? styles.darkThemeText : {}]}>Dark mode</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  backIcon: {
    width: 35, // Set the width of the back arrow
    height: 35, // Set the height of the back arrow
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'red'
  },
  darkContainer: {
    backgroundColor: '#121212', // A common background color for dark mode
  },
  darkBorder: {
    borderColor: 'white', // Example dark mode border color
  },
  darkHeaderContainer: {
    // Adjust header container styles for dark mode
  },
  darkHeader: {
    color: 'white', // Text color for dark mode
  },
  darkSettingRow: {
    borderColor: 'lightgrey', // Border color for dark mode
  },
  darkSettingText: {
    color: 'red', // Text color for dark mode
  },
  darkThemeText: {
    color: 'white', // Text color for dark mode
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  border: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
  },
  settingText: {
    fontSize: 18,
  },
  themeSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    color:'white'
  },
  themeText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
});

export default Settings;
