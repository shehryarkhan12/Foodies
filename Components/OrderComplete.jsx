import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Image,TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useItems } from './ItemsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderComplete = ({ navigation },props) => {
    const { selectedItems, setSelectedItems, orderId, setOrderId,subtotal,setSubtotal,token,setToken } = useItems();  // To keep track of selected items and their quantity
    const sprinklesAnimation = useRef(new Animated.Value(0)).current; // Initial value for opacity
    const tickAnimation = useRef(new Animated.Value(0)).current; // Initial value for Y-axis position
    const confirmationAnimation = useRef(new Animated.Value(300)).current; // Start below the screen
    // Adjust Sprinkles Animation to disappear after 5 seconds

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Fetch userId from AsyncStorage
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    setUserId(storedUserId);
                    console.log("UserId in RestaurantSearch:",userId);
                }
            } catch (error) {
                console.error("Failed to fetch userId from storage:", error);
            }
        };
        
        fetchUserId();
      }, []);
      

    useEffect(() => {
        Animated.timing(sprinklesAnimation, {
            toValue: 1,
            duration: 7000,
            useNativeDriver: true,
        }).start(() => {
            sprinklesAnimation.setValue(0); // Reset the animation to hide the sprinkles
        });
    }, []);

   // Green Circle Tick Animation Logic
   useEffect(() => {
    // Delay the start of this animation so that it begins 2-3 seconds after the sprinkles
    Animated.sequence([
        Animated.delay(2000), // Delay for 2 seconds after the component mounts
        Animated.timing(tickAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }),
    ]).start();
}, []);
    // Sprinkles Animated Component
    const Sprinkles = () => (
        <Animated.View
            style={{
                ...styles.sprinklesContainer,
                opacity: sprinklesAnimation,
            }}
        >
            <Image
            source={require('../Images/Confetti.gif')}
            style={styles.sprinklesGif}
            resizeMode="cover"
        />
        </Animated.View>
    );

    // Green Circle Tick Animated Component
    const GreenTick = () => (
        <Animated.View
            style={{
                ...styles.tickContainer,
                transform: [{ translateY: tickTranslateY }],
            }}
        >
             <MaterialIcons name="check-circle" size={100} color="green" />
            <Text style={styles.successText}>Success</Text>
        </Animated.View>
    );

     // Adjust values for moving the tick
     const tickTranslateY = tickAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-400, 0] // Start off-screen and move to the center
    });

    // Confirmation text and button animation logic
    useEffect(() => {
        Animated.timing(confirmationAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            delay: 7000 // Delay to allow tick animation to complete
        }).start();
    }, []);

     // Adjust values for moving the confirmation container
    // Start from the very bottom (off-screen) and move up to the final position
    const confirmationTranslateY = confirmationAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [400, 0] // Start from further off-screen below and move up
    });




    //  // Timer to show the confirmation text and buttons after animations
    //  useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setShowConfirmation(true);
    //     }, 5000); // Adjust the delay as needed

    //     return () => clearTimeout(timer);
    // }, []);



    return (
        <View style={styles.container}>
            <Sprinkles />
            <GreenTick />
            <Animated.View
                style={[
                    styles.confirmationContainer,
                    { transform: [{ translateY: confirmationTranslateY }] }
                ]}
            >
                <Text style={styles.confirmationText}>
                    Your order has been placed successfully. Your order id is {orderId}.
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('OrdersScreen', { orderId: userId })}
                >
                    <Text style={styles.buttonText}>Track your Order</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6', // A light grey background
    },
    sprinklesContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
        overflow: 'hidden',
    },
    tickContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        bottom: '50%', // Positioned initially off-screen
    },
    confirmationContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: '30%', // Adjust to position below the GreenTick after its animation
    },
    confirmationText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#4A5568', // Dark grey for better readability
        marginBottom: 30,
        fontWeight: 'bold',
    },
    sprinklesGif: {
        width: '100%',
        height: '100%',
    },
    successText: {
        fontSize: 24,
        color: '#2F855A', // Dark green for a richer look
        marginTop: 10,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#3182CE', // A nice shade of blue
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Other styles as needed
});

export default OrderComplete;
