import React, { useState,useEffect,useContext,useMemo,useCallback } from "react";
import SmsAndroid from 'react-native-sms';
import { View, Text, Button, Alert, FlatList, TouchableOpacity,StyleSheet,Image,ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotification } from './NotificationContext';
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


const MenuScreen = ( ) => {
  const [orders,setOrders] = useState([]);
  const[data,setData]=useState([]);
  const [query, setQuery] = useState('');
  const route = useRoute();
  let lati = route.params?.lati;
  let longi = route.params?.longi;
  //console.log(typeof(lati));
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
            body: JSON.stringify({ email: 'shahryarinam34@gmail.com', password: 'sp20bcs014' }),
        })
        .then(response => response.json())
        .then(data => {
            AsyncStorage.setItem('token', data.token);
        })
        .catch(error => console.error('Error:', error));
    }, []);
    //console.log("token=",token);
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
    const { setNotifications } = useNotification();
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
  

useEffect(() => {
  // Introduce a delay
  const timer = setTimeout(() => {
      // Your existing code inside useEffect
      const fetchOrderItems = () => {
          // Update the subtotal state
          setSubtotal([{name:"LOBSTER BISQUE", price: 1234,quantity:1 }]); // Assuming subtotal should be an array of objects
      };

      fetchOrderItems();
  }, 90000); // Delay of 3000 milliseconds (3 seconds)

  // Clear the timer when the component unmounts or when the dependencies change
  return () => clearTimeout(timer);
}, [selectedItems,subtotal]); // Dependencies remain the same

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

const handleQuantityChange = useCallback((itemName, change) => {
  // Get the price for the item directly from the map
  const itemPrice = menuDataMap[itemName];

  if (itemPrice === undefined) {
    console.error(`Price for item "${itemName}" not found`);
    return;
  }

  // Calculate the new quantity first
  setSelectedItems(prevItems => {
    const currentQuantity = prevItems[itemName]?.[0] || 0;
    let newQuantity = Math.max(currentQuantity + change, 0);

    const newItems = { ...prevItems, [itemName]: [newQuantity, itemPrice] };
    return newItems;
  });

  setSubtotal(prevSubtotal => {
    let newSubtotal = prevSubtotal.filter(item => item.name !== itemName);
    const updatedQuantity = selectedItems[itemName]?.[0] || 0;
    let newQuantity = Math.max(updatedQuantity + change, 0);

    if (newQuantity > 0) {
      newSubtotal.push({ name: itemName, quantity: newQuantity, price: itemPrice });
    }
    return newSubtotal;
  });
}, [selectedItems, setSelectedItems, setSubtotal, menuDataMap]); // Include all dependencies



    
      
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
    

    const placeOrder = useCallback(async () => {
      if (orderPlaced) {
          if (subtotal && subtotal.length > 0) {
              Alert.alert("Order placed Successfully", `Your order Id is ${orderId}`);
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
                              token:token
                            };
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
                      setLoading(false); // Stop loading animation
                      setOrderPlaced(true); // Update the state to indicate the order is placed
                  }
              },
          ]
      );
    }, [orderPlaced, subtotal, selectedItems]); // Include all dependencies
  
  
    //  
    
    // useEffect(() => {
    //     registerForPushNotifications();
      
    //     // This listener is triggered when a notification is received while the app is foregrounded
    //     const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
    //       console.log(notification);

    //       // Handle your notification here...
    //     });
      
    //     // This listener is triggered when a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    //     const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    //       console.log(response);
    //       // Navigate or handle the notification response here...
    //       // Handle your notification response here...
    //     });
      
    //     return () => {
    //       foregroundSubscription.remove();
    //       responseSubscription.remove();
    //     };
    //   }, []);

     

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
      // Find out the current route name
      const currentRouteName = currentRoutes[currentRoutes.length - 1].name;
      
      // Check if the MenuScreen is not focused and the current route is not 'ConfirmOrder'
      if (!isFocused && currentRouteName !== 'MenuScreen') {
          setSelectedItems({}); // Reset the selected items
          setSubtotal([]);      // Reset the subtotal
      }
  }, [isFocused, currentRoutes]);

   
  // useEffect(() => {
  //   console.log('Selected items updated:', selectedItems);
  // }, [selectedItems]);
      
      

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
    
    return (
        <View style={{ flex: 1 }}> 
        <View style={{ flexDirection: 'row', position: 'relative' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.filterScroll}>
            <View style={styles.filterContainer}>
                <FilterButton title="All" isSelected={true} />
                <FilterButton title="Burgers" isSelected={false} />
                <FilterButton title="Pizza" isSelected={false} />
                <FilterButton title="BBQ" isSelected={false} />
                <FilterButton title="Biryani" isSelected={false} />
            </View>
            
        </ScrollView>
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

        </View>

        <ScrollView style={styles.container}>
             
            {
    loading && (
        <View style={styles.loadingModal}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Fetching prices...</Text>
        </View>
    )
}

{menuData.map((menu, menuIndex) => (
        menu.categories.map((category, categoryIndex) => (
          <View key={`category-${category._id}-${categoryIndex}`}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            {category.items.map((item, itemIndex) => (
              <View key={`item-${item._id}-${itemIndex}`} style={styles.itemContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.itemDetailsContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  <Text style={styles.itemPrice}>{`${item.price}Rs`}</Text>
                </View>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(item.name, -1)}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{selectedItems[item.name]?.[0] || 0}</Text>

                  <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(item.name, 1)}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))
      ))}
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
            <Button title="Place Order" onPress={placeOrder} color="#FF6347" />
        </ScrollView>
        </View>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    filterScroll: {
        flexGrow: 0, // This ensures that the ScrollView doesn't expand beyond its content
        backgroundColor: '#F5FCFF',
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
        marginVertical: 10,
        paddingHorizontal: 10,
    },

    buttonsContainer: {
        flexDirection: 'row',  // To lay out buttons horizontally.
        justifyContent: 'center',  // Center the buttons horizontally.
        alignItems: 'center',  // Center the buttons vertically.
        marginVertical: 10,  // Space above and below the container.
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
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default MenuScreen;