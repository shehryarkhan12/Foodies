import React, { useState,useEffect,useContext,useMemo,useCallback } from "react";
import SmsAndroid from 'react-native-sms';
import { View, Text, Button, Alert, FlatList, TouchableOpacity,StyleSheet,Image,ScrollView, ActivityIndicator,ImageBackground } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemsContext } from './ItemsContext';
import { usePrice } from './PriceContext';
import { priceUpdateEmitter } from './EventEmitter';
import { useIsFocused } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import FilterButton from "./FilterButtons";
import { LinearGradient } from 'expo-linear-gradient';
import { useItems } from './ItemsContext';
import { useNavigationState } from '@react-navigation/native';
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { API_IP_ADDRESS } from "../api/config";
import * as Device from 'expo-device';
import { throttle } from 'lodash';
import CardLoader from './CardLoader';
import { useNavigation } from '@react-navigation/native';
import { useNotification } from '../Components/NotificationContext';



const MenuScreen = ( ) => {
  const navigation = useNavigation();
  const [setNotifications, notifications,notificationCount, setNotificationCount, incrementNotificationCount] = useNotification();
  const [orders,setOrders] = useState([]);
  const[data,setData]=useState([]);
  const [query, setQuery] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [immediateQuantities, setImmediateQuantities] = useState({});
  const route = useRoute();
  let lati = route.params?.lati;
  let longi = route.params?.longi;
  
  let id_ = route.params?.token;
  console.log("Token00:",id_);
  //console.log(longi);
    // useEffect( async ()=>{
        
    //     try {
    //         const response = await axios.get(`http://192.168.1.2:4000/api/order/items`);
    //         setOrders(response.data);
    //         console.log("============>FAMILY DATA: " + JSON.stringify(response.data));
      
    //       } catch (error) {
    //         console.error(error);
    //       }
    // },[])
    const { selectedItems, setSelectedItems, orderId, setOrderId,subtotal,setSubtotal,token,setToken } = useItems();  // To keep track of selected items and their quantity
    useEffect(() => {
        fetch(`http://${API_IP_ADDRESS}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'shahryarinam34@gmail.com', password: 'sheh0325' }),
        })
        .then(response => response.json())
        .then(data => {
            AsyncStorage.setItem('token', data.token);
        })
        .catch(error => console.error('Error:', error));
    }, []);
    console.log("token=",token);
    //const [subtotal, setSubtotal] = useState([]);
    //const [selectedItems,setSelectedItems]= useState({});
    const { menuData } = route.params;
    //console.log(menuData);
    const { prices, updatePrice,setPrices } = usePrice(); // Fetch prices and updatePrice from PriceContext
    const [showSubtotal, setShowSubtotal] = useState(true); // New state for controlling visibility
    const [orderPlaced, setOrderPlaced] = useState(false);
    //const [orderId, setOrderId] = useState(null);
    const [loading, setLoading] = useState(false);
    const currentRoutes = useNavigationState(state => state.routes);

   
    const { phoneNumber } = route.params; // Receive the phone number here
  
    const isFocused = useIsFocused();

    useEffect(() => {
        console.log("orderId updated to:", orderId);
    }, [orderId]); // This effect will run every time orderId changes

    
    const generateRandomOrderId = useCallback(() => {
      const newOrderId = Math.random().toString(36).substring(7);
      setOrderId(newOrderId); // This will update orderId in the ItemsContext
      console.log("New orderId set in context:", newOrderId);
      return newOrderId;
    }, [setOrderId]);

      // const sendPushNotification = async (token, message) => {
      //   await Notifications.scheduleNotificationAsync({
      //     content: {
      //       title: "Order Status",
      //       body: message,
      //       data: { data: 'data here' },
      //     },
      //     trigger: null,
      //   });
      // };

      // Example function to call the API endpoint to add an item
      const addItemToOrder = useCallback(async (itemDetails) => {
        try {
          console.log('Sending item details:', JSON.stringify(itemDetails)); // Log the stringified object
    const response = await fetch(`http://${API_IP_ADDRESS}/api/order/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemDetails),
    });
      
          // If the response is not OK, log and parse the error message
          if (!response.ok) {
            const errorBody = await response.text();
            console.error('Failed to add item to order:', errorBody);
            // Here you can handle the error accordingly
          } else {
            // Handle the success case
            console.log('Item added to order successfully');
          }
        } catch (error) {
          console.error('Error during addItemToOrder:', error);
        }
      }, []);
      
      const registerForPushNotifications = useCallback(async () => {
        try {
          // Check if the device supports push notifications
          if (!Device.isDevice) {
            console.log('Must use physical device for Push Notifications');
            return null;
          }
      
          // Check for existing permissions
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
      
          // Ask for permission if necessary
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
      
          // Exit if permission is not granted
          if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return null;
          }
      
          // Get the token that uniquely identifies this device
          const token = (await Notifications.getExpoPushTokenAsync({
            experienceId: '0d53d6ad-d49d-42ea-a76c-beea06e9ceed', // Replace with your actual project ID
          })).data;
          console.log('Push notification token:', token);
      
          // Here you might want to send the token to your backend
          // sendPushTokenToServer(token);
      
          return token;
        } catch (error) {
          console.error('Error during push notification registration:', error);
          return null;
        }
      }, []); // Add dependencies if any
          
      
      const sendOrderToRestaurant = useCallback(async () => {
        const orderId = generateRandomOrderId();
        const orderItemsKey = `selectedItems-${orderId}`;
        const title = `Order Confirmation`; // You probably want to send a title and body separately
        const body = `Confirm Order:${orderId}`;
        const timestamp = new Date().toISOString();
        const recipientEmail = "jackmarcle02@gmail.com"; // Or get this from the user input or state
    
        try {
            await AsyncStorage.setItem('selectedItems',JSON.stringify(selectedItems));
            console.log('selectedItems has changed in sendOrdertoRestaurant:', selectedItems);
            // Send the notification info to the server
            const response = await fetch(`http://${API_IP_ADDRESS}/send-notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    body,
                    data: { orderId, timestamp }, // Ensure 'data' is an object with relevant details
                    recipientEmail
                })
            });
    
            const data = await response.json();
            console.log("notification data",data);
    
            if (data.success) {
                // Handle the response and local state updates
                Alert.alert("Notification sent", data.message);
                //setOrderId(orderId);
                setOrderPlaced(true);
            } else {
                console.error("Failed to send notification:", data.message);
                Alert.alert("Error", data.message);
            }
        } catch (error) {
            console.error("Error in sendOrderToRestaurant function: ", error);
            Alert.alert("Error", "Could not send the order to the restaurant.");
        }
      }, [selectedItems]);
    
    //   const getOrderItems = useCallback(async () => {
    //     try {
    //         const response = await axios.get(`http://${API_IP_ADDRESS}/api/order/items`);
    //         // Assuming response.data contains the latest item details including prices
    //         const items = response.data;
           
    //         // Update prices in selectedItems and subtotal
    //         updatePricesInState(items);
    //         return /* condition to check if prices are updated */;
    //     } catch (error) {
    //         console.error(error);
    //         return false;  // Return false in case of error
    //     }
    //   }, []);

    // const updatePricesInState = useCallback((newItems) => {
    //   // Update the prices in selectedItems without affecting quantities
    //   const updatedSelectedItems = { ...selectedItems };
    //   Object.entries(updatedSelectedItems).forEach(([itemName, [quantity, _]]) => {
    //       const newItem = newItems.find(item => item.name === itemName);
    //       if (newItem) {
    //           updatedSelectedItems[itemName] = [quantity, newItem.price]; // Update price, keep quantity
    //       }
    //   });
    //   setSelectedItems(updatedSelectedItems);
     
      
  
    //   // Update the subtotal with new prices, preserving existing quantities
    //   const updatedSubtotal = subtotal.map(item => {
    //       const newItem = newItems.find(nItem => nItem.name === item.name);
         
    //       if (newItem) {
    //           return { ...item, price: newItem.price }; // Update price, keep other item properties
    //       } else {
    //           return item; // If item is not found in newItems, keep it as is
    //       }
    //   });
    //   setSubtotal(updatedSubtotal);
      
    // }, [selectedItems, setSelectedItems, subtotal, setSubtotal]); // Include all dependencies
  
//   useEffect(() => {
//     console.log("Selected Items after update:", selectedItems);
//     console.log("Subtotal after update:", subtotal);
// }, [selectedItems, subtotal]);
  

// useEffect(() => {
//   // Introduce a delay
//   const timer = setTimeout(() => {
//       // Your existing code inside useEffect
//       const fetchOrderItems = () => {
//           // Update the subtotal state
//           setSubtotal([{name:"LOBSTER BISQUE", price: 1234,quantity:1 }]); // Assuming subtotal should be an array of objects
//       };

//       fetchOrderItems();
//   }, 90000); // Delay of 3000 milliseconds (3 seconds)

//   // Clear the timer when the component unmounts or when the dependencies change
//   return () => clearTimeout(timer);
// }, [selectedItems,subtotal]); // Dependencies remain the same

// useEffect(() => {
//   console.log("Selected Items after update:", selectedItems);
//   console.log("Subtotal after update:", subtotal);
// }, [subtotal]); // Separate useEffect to log the updated subtotal
    
    // const getPushTokenForEmail = async () => {
    //     const username="AsfandyarKhan";
    //     try {
    //         const response = await fetch(`http://10.135.50.94:4000/getExpoPushTokens?username=${username}`);
    //         if (!response.ok) {
    //             throw new Error(`Server responded with status: ${response.status}`);
    //         }
    //         const data = await response.json();
    //         if (data.expoPushTokens) {
    //             console.log("Token fetched for username:", username, "Token:", data.expoPushTokens);
    //             return data.expoPushTokens;
    //         } else {
    //             console.error("No token associated with the username:", username);
    //             return null;
    //         }
    //     } catch (error) {
    //         console.error("Error fetching token for username:", username, error);
    //         return null;
    //     }
    // };

    // useEffect(() => {
    //   const fetchStoredItems = async () => {
    //     try {
          
    //       const fetchedItems = await AsyncStorage.getItem('selectedItems');
    //       console.log('selectedItems has changed:', selectedItems);
    //       if (fetchedItems !== null) {
    //         const parsedItems = JSON.parse(fetchedItems);
    //         const subtotalArray = Object.entries(parsedItems).map(([itemName, quantity]) => {
    //           // Find the item across all categories
    //           let itemData;
    //           for (let menu of menuData) { // Assuming menuData is an array of menu objects
    //             for (let category of menu.categories) { // Iterate over the categories array
    //               const foundItem = category.items.find(item => item.name === itemName);
    //               if (foundItem) {
    //                 itemData = foundItem;
    //                 break;
    //               }
    //             }
    //             if (itemData) break; // If itemData is found, no need to keep searching
    //           }
    
    //           // Calculate the subtotal for the item
    //           const updatedPrice = prices[itemName] || (itemData ? itemData.price : 0);
    //           return {
    //             name: itemName,
    //             price: updatedPrice,
    //             quantity: quantity
    //           };
    //         });
    //         setSubtotal(subtotalArray);
    //       }
    //     } catch (error) {
    //       console.error("Error retrieving selected items: ", error);
    //     }
    //   };
    
    //   fetchStoredItems();
      
    //   //setShowSubtotal(true);
    //   console.log("Subtotal:", subtotal);
     
    // }, [prices,selectedItems]); // Fetch items whenever prices change
    

// Assuming you've transformed menuData into a keyed object called `menuDataMap` elsewhere in your component
const menuDataMap = useMemo(() => {
  const map = {};
  menuData.forEach(menu => {
    menu.categories.forEach(category => {
      category.items.forEach(item => {
        map[item.name] = item.price;
      });
    });
  });
  return map;
}, [menuData]); // Recompute only if menuData changes

const handleQuantityChange = useCallback(throttle((itemName, change) => {
  // Get the price for the item directly from the map
  const itemPrice = menuDataMap[itemName];

  if (itemPrice === undefined) {
    console.error(`Price for item "${itemName}" not found`);
    return;
  }

  // Update selected items immediately for faster UI response
  setImmediateQuantities(prevQuantities => {
    const currentQuantity = prevQuantities[itemName] || 0;
    const newQuantity = Math.max(currentQuantity + change, 0);
    return { ...prevQuantities, [itemName]: newQuantity };
  });

  // Defer the update of selectedItems and subtotal to avoid UI block
  setTimeout(() => {
    setSelectedItems(prevItems => {
      const currentQuantity = prevItems[itemName]?.[0] || 0;
      const newQuantity = Math.max(currentQuantity + change, 0);
      return { ...prevItems, [itemName]: [newQuantity, menuDataMap[itemName]] };
    });

    setSubtotal(prevSubtotal => {
      // Filter out the current item to update
      let newSubtotal = prevSubtotal.filter(item => item.name !== itemName);
      // Compute the new quantity
      const updatedQuantity = selectedItems[itemName]?.[0] || 0;
      let newQuantity = Math.max(updatedQuantity + change, 0);

      // Add updated item to the subtotal if the quantity is greater than 0
      if (newQuantity > 0) {
        newSubtotal.push({ name: itemName, quantity: newQuantity, price: menuDataMap[itemName] });
      }
      return newSubtotal;
    });
  }, 0);
}, 500), [selectedItems, setSelectedItems, setSubtotal, menuDataMap,setImmediateQuantities,immediateQuantities]); // 500ms throttle

    
      
  //   const handleQuantityChange = async(itemName, change) => {
  //       // Ensure selectedItems is an object
  //       if (!selectedItems) {
  //         console.error('selectedItems is undefined');
  //         return;
  //       }
  //     let price = itemName.price;
        
       
      
  //       // Use a function to get item price from menuData
  //       const getItemPrice = (name) => {
  //         for (let menu of menuData) { // Assuming menuData is an array of menu objects
  //           for (let category of menu.categories) { // Iterate over the categories array
  //             const foundItem = category.items.find(item => item.name === name);
  //             if (foundItem) {
  //               return foundItem.price; // Return the price as soon as it's found
  //             }
  //           }
  //         }
  //         return undefined; // Return undefined if the item is not found
  //       };
      
  //       // Get the price for the item
  //       const itemPrice = getItemPrice(itemName);
      
  //       // Ensure itemPrice is not undefined before proceeding
  //       if (itemPrice === undefined) {
  //         console.error(`Price for item "${itemName}" not found`);
  //         return;
  //       }

  //        // Calculate the new quantity for the selected item
  //        const currentQuantity = selectedItems[itemName]?.[0] || 0;
  // let newQuantity = currentQuantity + change;
  // if (newQuantity < 0) newQuantity = 0;
  // // Update the selectedItems state without discarding other items
  // setSelectedItems(prevItems => {
    
  //   const newItems = { ...prevItems, [itemName]: [newQuantity, itemPrice] };
  //   //AsyncStorage.setItem('selectedItems', JSON.stringify(newItems)).catch(console.error);
  //   return newItems;
  // });
    
      
  //       // Update the subtotal state
  //       setSubtotal(prevSubtotal => {
  //         const itemInSubtotal = prevSubtotal.find(item => item.name === itemName);
          
        
  //         if (itemInSubtotal) {
  //           // Update existing item
  //           return prevSubtotal.filter(item => item.name !== itemName || newQuantity > 0)
  //           .map(item => item.name === itemName ? { ...item, quantity: newQuantity, price: itemPrice } : item);
  //         } else {
  //           // Add new item
  //           return newQuantity > 0 ? [...prevSubtotal, { name: itemName, quantity: newQuantity, price: itemPrice }] : [...prevSubtotal, { name: itemName, quantity: newQuantity, price: itemPrice }];
  //         }
  //       });
  //       //setShowSubtotal(true);
  //       //AsyncStorage.setItem('selectedItems', JSON.stringify(selectedItems)).catch(console.error);
  //     }
      

    //console.log("selected Items after handle quantity change:",selectedItems);


    useEffect(() => {
      // Fetch userEmail from AsyncStorage
      const fetchUserEmail = async () => {
          try {
              const storedUserEmail = await AsyncStorage.getItem('userEmail');
              if (storedUserEmail) {
                  setUserEmail(storedUserEmail);
                  console.log("UserEmail in MenuScreen:",userEmail);
              }
          } catch (error) {
              console.error("Failed to fetch userEmail from storage:", error);
          }
      };
      
      fetchUserEmail();
    }, [userEmail]);
    
    const sendOrderConfirmationNotification = async () => {
      const title = "Order Confirmation";
      const body = `Your order with ID ${id_} has been placed successfully`;
      const data = {}; // Add any additional data if needed
      const recipientEmail = userEmail; // Use the email of the currently logged-in user
      console.log("userEmail in sendOrderConfirmationNotification: ",userEmail);
  
      try {
          const response = await fetch(`http://${API_IP_ADDRESS}/triggerNotification`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ title, body, data, recipientEmail })
              
          });
          if (response.ok) {
            incrementNotificationCount(); // Increment notification count
            console.log("NotificationCount in MenuScreen:",notificationCount);
            console.log("Notification sent to user.");
        }
      } catch (error) {
          console.error("Error triggering notification:", error);
          // Handle error scenario
      }
  };
  
    const placeOrder = useCallback(async () => {
      if (orderPlaced) {
          if (subtotal && subtotal.length > 0) {
             // Alert.alert("Order placed Successfully", `Your order Id is ${orderId}`);
              navigation.navigate("PaymentScreen");
          } else {
              Alert.alert("Error", "Prices not fetched by the restaurant yet");
          }
          return;
      }
  
      Alert.alert(
          'Reconfirm Order',
          'Are you sure you want to place this order?',
          [
              { text: 'Cancel', style: 'cancel' },
              {
                  text: 'OK', onPress: async () => {
                      setLoading(true); // Start loading animation

                      const itemsArray = Object.values(selectedItems);
                      console.log("ItemArray=",itemsArray);
                      // Iterate over the object's values if selectedItems is an object
                      if (itemsArray.length > 0) {
                        for (const [itemName, itemDetails] of Object.entries(selectedItems)) {
                          try {
                            const orderItem = {
                              name: itemName,
                              quantity: itemDetails[0], // Access the first element of the array for quantity
                              price: itemDetails[1],    // Access the second element of the array for price
                              lati:lati,
                              longi:longi,
                              token:id_
                            };
                            console.log("token11:",orderItem.token);
                            console.log('Adding item to order:', { name: itemName, ...itemDetails });
                            await addItemToOrder(orderItem);
                          } catch (error) {
                                setLoading(false);
                                Alert.alert("Error", "Failed to add item to order. Please try again.");
                                return;
                            }
                        }
                    } else {
                        setLoading(false);
                        Alert.alert("Error", "No items selected.");
                        return;
                    }
  
                      // Mock delay for 10 seconds
                      await new Promise(resolve => setTimeout(resolve, 10000));
  
                      // Hide the subtotal on pressing OK
                      //setShowSubtotal(false);
  
                      // Assuming sendOrderToRestaurant is another function that finalizes the order
                      await sendOrderToRestaurant();
                     
                      setOrderPlaced(true); // Update the state to indicate the order is placed
                      await sendOrderConfirmationNotification(orderId, incrementNotificationCount);
                      
                      setLoading(false); // Stop loading animation
                      navigation.navigate("PaymentScreen");
                  }
              },
          ]
      );
    }, [orderPlaced, subtotal, selectedItems]); // Include all dependencies
  
  
    const MenuItem = React.memo(({ item, onQuantityChange, quantity }) => (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.itemDetailsContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemPrice}>{`${item.price}Rs`}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={() => onQuantityChange(item.name, -1)}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={() => onQuantityChange(item.name, 1)}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
    
     
    
    useEffect(() => {
        registerForPushNotifications();
      
        // This listener is triggered when a notification is received while the app is foregrounded
        const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
          console.log(notification);

          // Handle your notification here...
        });
      
        // This listener is triggered when a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
          // Navigate or handle the notification response here...
          // Handle your notification response here...
        });
      
        return () => {
          foregroundSubscription.remove();
          responseSubscription.remove();
        };
      }, []);

     

    // useEffect(() => {
    //     const handlePricesConfirmed = (updatedPrices) => {
    //         updatePrice(updatedPrices);  // Assuming updatePrice handles a batch update
    //     };
    
    //     // Listen to the 'pricesConfirmed' event
    //     priceUpdateEmitter.addListener('pricesConfirmed', handlePricesConfirmed);
    //     console.log("Prices:", prices);
    //     // Clean up the listener when the component unmounts
    //     return () => {
    //         priceUpdateEmitter.removeListener('pricesConfirmed', handlePricesConfirmed);
             
    //     };
        
    // }, [prices]);
    useEffect(() => {
      // Update the local state to reflect the latest quantities in selectedItems
      const updatedQuantities = {};
      for (const itemName in selectedItems) {
        updatedQuantities[itemName] = selectedItems[itemName][0];
      }
      setImmediateQuantities(updatedQuantities);
    }, [selectedItems]);


    useEffect(() => {
      // Find out the current route name
      const currentRouteName = currentRoutes[currentRoutes.length - 1].name;
      
     
      if (!isFocused && currentRouteName !== 'MenuScreen' && currentRouteName !== 'PaymentScreen') {
          setSelectedItems({}); // Reset the selected items
          setSubtotal([]);      // Reset the subtotal
      }
  }, [isFocused, currentRoutes]);

   
  // useEffect(() => {
  //   console.log('Selected items updated:', selectedItems);
  // }, [selectedItems]);

  const flattenMenuData = (menus) => {
    let flatData = [];
    menus.forEach(menu => {
      if (menu.categories && Array.isArray(menu.categories)) {
        menu.categories.forEach(category => {
          category.items.forEach(item => {
            flatData.push({ ...item, categoryName: category.name });
          });
        });
      }
    });
    return flatData;
  };
  
  
  
  // Assuming menuData might not be immediately available or its structure might vary
  const flatMenuData = useMemo(() => {
    // Check if menuData is defined and is an array
    return Array.isArray(menuData) ? flattenMenuData(menuData) : [];
  }, [menuData]);
  
  // Remove the ScrollView surrounding the filters and use a horizontal FlatList for the filters
  const renderFilter = ({ item }) => (
    <FilterButton title={item.title} isSelected={item.isSelected} />
  );

  // Main content render function for the FlatList
  const renderItem = ({ item }) => {
    
    return (
      <MenuItem
        item={item}
        onQuantityChange={handleQuantityChange}
        quantity={immediateQuantities[item.name] || 0}
      />
    );
  };
      

    const safeMultiply = (a, b) => {
        if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) {
            return 0;
        }
        return a * b;
    }
    const subtotalItems = useMemo(() => {
      return subtotal.map(item => ({
        ...item,
        total: safeMultiply(item.price, item.quantity)
      }));
    }, [subtotal]);

    const totalCost = useMemo(() => {
        return subtotal
            .filter(item => typeof item.price === 'number' && !isNaN(item.price))
            .reduce((acc, item) => acc + safeMultiply(item.price, item.quantity), 0);
    }, [subtotal]);

    //console.log('menuData', menuData);

     // Calculate the total count of items
  const itemCount = Object.values(selectedItems).reduce((total, [quantity]) => total + quantity, 0);
    
    return (
      <>
        {/* Top Navigation Bar */}
        
        <View style={styles.topNavBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ImageBackground source={require('../Images/arrow-left.png')} style={styles.leftArrowStyle} resizeMode="contain" />
            </TouchableOpacity>
            <Text style={styles.navBarTitle}>Menu</Text>
           {/* Cart Icon with Badge */}
        <TouchableOpacity style={styles.cartIconContainer} onPress={() => {/* Navigate to cart screen */}}>
        <Ionicons name="cart" size={34} color="#1E90FF" />
          {itemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        </View>
        
       {/* Horizontal Filter Bar */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={true}
        data={[ /* array of filters like { title: 'All', isSelected: activeFilter === 'All' }, etc. */ ]}
        renderItem={renderFilter}
        keyExtractor={(item, index) => `filter-${index}`}
        style={styles.filterScroll}
      />
       
        <LinearGradient
        colors={['rgba(245, 252, 255, 0)', 'rgba(245, 252, 255, 1)']}
        style={styles.gradientLeft}
        pointerEvents="none" // Important to ensure that the gradient does not interfere with user interaction
    />
    <LinearGradient
       colors={['rgba(245, 252, 255, 1)', 'rgba(245, 252, 255, 0)']}
        style={styles.gradientRight}
        pointerEvents="none" // Important to ensure that the gradient does not interfere with user interaction
    />

       

        <View style={styles.container}>
            

        <FlatList
  data={flatMenuData} // Use the flattened menu data here
  renderItem={renderItem}
  keyExtractor={(item) => item._id.toString()}
        extraData={immediateQuantities}
        ListFooterComponent={() => (
          // This will render at the bottom of the list
          loading ? (
            <View style={styles.loadingModal}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.loadingText}>Fetching Prices from Restaurant...</Text>
            </View>
          ) : null
        )}
      />
            {/* Subtotal display */}
            {showSubtotal && Object.keys(selectedItems)?.length > 0 && subtotal.length > 0 && (
                <View style={styles.subtotalContainer}>
                    <Text style={styles.subtotalTitle}>Subtotal</Text>
                    {subtotalItems.map(item => (
                        <View key={item.name} style={styles.subtotalItem}>
                            <Text>{item.name}: {item.total}Rs (x{item.quantity})</Text> 
                        </View>
                    ))}
                    <Text style={styles.total}>Total: {totalCost.toFixed(2)}Rs</Text>
                </View>
            )}
           <TouchableOpacity onPress={placeOrder} style={styles.placeOrderButton}>
    <Text style={styles.placeOrderButtonText}>Proceed to Pay</Text>
</TouchableOpacity>
        </View>
        
        </>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    topNavBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF',
      paddingHorizontal: 10,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#FFF',
      zIndex: 5, // Ensure this is less than the cart icon's zIndex
    },
    backButtonContainer: {
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 1,
  },
  leftArrowStyle: {
      width: 40,  // Adjust size as needed
      height: 40,
  },
    filterScroll: {
        flexGrow: 0, // This ensures that the ScrollView doesn't expand beyond its content
        backgroundColor: '#FFF',
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
  },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      paddingVertical: 10,  // Adjust vertical padding as necessary
      paddingHorizontal: 10,
  },

    buttonsContainer: {
        flexDirection: 'row',  // To lay out buttons horizontally.
        justifyContent: 'center',  // Center the buttons horizontally.
        alignItems: 'center',  // Center the buttons vertically.
        marginVertical: 10,  // Space above and below the container.
    },
    backButton: {
      marginRight: 15, // Space between the back button and the title
  },
  navBarTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color:'red'
    // Adjust other styling as needed
},
cartIconContainer: {
  marginLeft: 'auto', // Pushes the icon to the right
  position: 'relative',
  zIndex: 10, // Adjust as needed
},
cartBadge: {
  position: 'absolute',
  right: -6,
  top: -3,
  backgroundColor: 'red',
  borderRadius: 10,
  width: 20,
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
},
cartBadgeText: {
  color: 'white',
  fontSize: 12,
  fontWeight: 'bold',
},
    plusButton: {
        marginRight: 5,  // Space to the right of the "+" button.
        padding: 5,  // Padding for the button.
        backgroundColor: '#32CD32',  // Green background color.
        borderRadius: 5,  // Rounded corners.
        width: 40,  // Fixed width for the button.
        height: 40,  // Fixed height for the button.
        justifyContent: 'center',  // Center the title vertically.
        alignItems: 'center',  // Center the title horizontally.
    },
    minusButton: {
        marginLeft: 5,  // Space to the left of the "-" button.
        padding: 5,  // Padding for the button.
        backgroundColor: '#FF6347',  // Red background color.
        borderRadius: 5,  // Rounded corners.
        width: 40,  // Fixed width for the button.
        height: 40,  // Fixed height for the button.
        justifyContent: 'center',  // Center the title vertically.
        alignItems: 'center',  // Center the title horizontally.
    },
    itemDescription: {
        fontSize: 14,
        color: 'grey',
        marginTop: 5,
    },
    itemNameContainer: {
        flexDirection: 'column',  // To lay out characters vertically.
        alignItems: 'center',  // Center the characters horizontally.
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        paddingHorizontal: 15,
        color:'red',
       
    },
   
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    itemName: {
        fontSize: 16,
        marginRight:90
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    itemDetailsContainer: {
        flexDirection: 'column',
        flex: 1,
        marginLeft: 5, // or any desired spacing from the image
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    quantityText: {
        marginHorizontal: 10,
        fontSize: 16,
    },
    quantityButtonText: {
        fontSize: 18,
        color: '#555',
      },
      quantity: {
        marginHorizontal: 10,
        fontSize: 16,
      },
      quantityButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
      },
    subtotalContainer: {
        marginVertical: 20,
        padding: 10,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 5
    },
    subtotalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    subtotalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10
    },
    loadingModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:1500
    },
    orderButton: {
        padding: 10,
        backgroundColor: '#32CD32',
        borderRadius: 5,
    },
    orderButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    gradientLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: 20,
        zIndex: 1,
    },
    
    gradientRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        width: 30,
        zIndex: 1,
    },
    placeOrderButton: {
      backgroundColor: '#FF6347', // Same color as your original button
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 20, // Adjust as needed for spacing
      marginHorizontal: 10, // Adjust for horizontal spacing
      elevation: 2, // For Android shadow
      shadowColor: '#000', // For iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      zIndex:1000
  },
  placeOrderButtonText: {
    color: '#FFFFFF', // White text color
    fontSize: 18,
    fontWeight: 'bold',
},
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default MenuScreen;