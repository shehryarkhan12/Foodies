import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
const Question = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {/* Top Container */}
      <View style={styles.topContainer}>
        <Image source={require('../Images/Topicon.png')} style={styles.appIcon} />
        <Text style={styles.appName}>FoodiesHub</Text>
      </View>

      {/* Mid Container */}
      <View style={styles.midContainer}>
        <Text style={styles.heading}>What Describes You The Best:</Text>
        {/* Repeat this container for each category */}
        <View style={styles.categoryContainer}>
        <Image source={require('../Images/customer.png')} style={styles.categoryImage} />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
          <LinearGradient
    // Button Linear Gradient
    colors={['#F87575', '#E63946', '#B51700']} // A gradient of attractive reds
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    locations={[0.3, 0.6, 1]} // Adjust these to shift where the color changes occur

    style={styles.gradient}
  >
            <Text style={styles.buttonText}>Customer</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {/* ... other category containers */}
        <View style={styles.categoryContainer}>
        <Image source={require('../Images/RestaurantOwner.png')} style={styles.categoryImage} />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("RestaurantLogin")}>
          <LinearGradient
    // Button Linear Gradient
    colors={['#F87575', '#E63946', '#B51700']} // A gradient of attractive reds
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    locations={[0.3, 0.6, 1]} // Adjust these to shift where the color changes occur
    style={styles.gradient}
    
  >
            <Text style={styles.buttonText}>Restaurant Owner</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryContainer}>
        <Image source={require('../Images/DeliveryMan.png')} style={styles.categoryImage} />
          <TouchableOpacity style={styles.button}>
          <LinearGradient
    // Button Linear Gradient
    colors={['#F87575', '#E63946', '#B51700']} // A gradient of attractive reds
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    locations={[0.3, 0.6, 1]} // Adjust these to shift where the color changes occur
    style={styles.gradient}
  >
            <Text style={styles.buttonText}>Delivery Man</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
      {/* Footer Section */}
      <View style={styles.terms}>
        <Text style={styles.termsText}>By Continuing you agree to</Text>
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => {/* Handle Privacy Policy link click */}}>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text> </Text>
          <TouchableOpacity onPress={() => {/* Handle Terms & Conditions link click */}}>
            <Text style={styles.linkText}>Terms & Conditions</Text>
          </TouchableOpacity>
          <Text> </Text>
          <TouchableOpacity onPress={() => {/* Handle Content Policy link click */}}>
            <Text style={styles.linkText}>Content Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF', // Light grey background for slight contrast
      
    },
    scrollViewContent: {
        
        justifyContent: 'space-between', // Positions children with space between them
      },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        marginBottom:50,
        paddingTop: 20, // Adjust top padding as needed
        paddingBottom: 0, // Reduced bottom padding
        backgroundColor: '#fff',
      },
    appIcon: {
      width: 120,
      height: 120,
      borderRadius: 20, // Slightly rounded corners for the icon
    },
    appName: {
        fontSize: 35, // Consider making it larger for a bold appearance
        fontWeight: 'bold',
        marginLeft:0, // Space between the icon and the text
        color: '#B51902',
    },
    midContainer: {
        padding: 10,
        paddingTop: 0, // Reduced top padding to bring mid container closer to the top container
        backgroundColor: '#fff',
      },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#B51902', // Consider a softer color if it's too intense
        marginBottom: 30, // More space below the heading
        textAlign: 'left', // Align text to the left for better readability
        textTransform: 'none', // Ensures text is displayed as is
        lineHeight: 42, // Adjust line height for better readability of larger font
        padding: 10, // Optional padding for better spacing from the container edges
      },
      
      categoryContainer: {
        marginTop: -10, // Negative top margin to hide the top border
        marginBottom: 25,
        alignItems: 'center',
        shadowColor: '#000', // Shadow for card-like effect
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Elevation for Android shadow effect
        backgroundColor: '#fff', // White background for category cards
        borderRadius: 15, // Rounded corners for the cards
        paddingTop: -10, // Increase top padding to compensate for the negative margin
        paddingBottom: 20,
        paddingHorizontal: 15,
        marginHorizontal: 10, // Horizontal margin for card spacing
      },
      
      
      
    categoryImage: {
      width: 120,
      height: 120,
      borderRadius: 50, // Fully rounded corners for circular images
      marginBottom: 0, // Space between image and button
    },
    button: {
        borderRadius: 25, // Fully rounded corners for pill-shaped buttons
        overflow: 'hidden', // This will contain the LinearGradient within the borders of the button
      },
    gradient: {
        paddingHorizontal: 100,
        paddingVertical: 12,
        borderRadius: 25, // This should match the borderRadius of button to maintain the shape
        justifyContent: 'center', // Center the text within the gradient
        alignItems: 'center', // Center the text horizontally
        minWidth: 350, // Ensures a minimum width for the button
        maxWidth: 450, // You can adjust maxWidth as needed or remove it if not necessary
      },
      buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '600', // Semi-bold for button text
        textAlign: 'center', // Ensure text is centered
      },
    terms: {
      padding: 20,
      backgroundColor: '#fff', // White background for the footer
     
    },
    termsText: {
      textAlign: 'center',
      color: '#999', // Light grey for less emphasis on terms text
      marginBottom: 10, // Space before the links
    },
    linkContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    linkText: {
      color: 'lightgrey', // Standard link blue color
      textDecorationLine: 'underline',
      marginHorizontal: 4, // Space between links
    },
  });

  export default Question;