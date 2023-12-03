import React,{useState,useContext,useEffect} from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNotification } from './NotificationContext';
import { useNavigation } from '@react-navigation/native';
import { useItems } from './ItemsContext';
import * as Notifications from 'expo-notifications';

const NotificationScreen = (route) => {
    
    const { selectedItems,orderId, setOrderId } = useItems();
    const navigation = useNavigation();
    const { notifications,setNotifications } = useNotification();
    console.log('orderId:',orderId);
    console.log("selected items:",selectedItems);
    
    
    const handleNotificationPress = (notification) => {
        if (notification.message.startsWith('Confirm Order')) {
            console.log('orderId:',orderId);
            // or however you get the data
        navigation.navigate('ConfirmOrder', { orderId:orderId });
        }
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date);
        const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
        return `${formattedDate} at ${formattedTime}`;
    }

  
    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(notification => {
          console.log('Notification Received:', notification); // Log the entire notification to debug
          const messageBody = notification.request.content.body;
          const additionalData = notification.request.content.data;
          
          if (messageBody || additionalData) {
            const newNotification = {
              message: messageBody || `Order ID: ${additionalData.orderId}`, // Fallback to orderId if body is null
              timestamp: additionalData.timestamp || Date.now(), // Use provided timestamp or current time
            };
            setNotifications(prevNotifications => [...prevNotifications, newNotification]);
          }
        });
      
        return () => subscription.remove();
      }, []);
      useEffect(() => {
        console.log('Notifications state updated:', notifications);
      }, [notifications]);
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Notifications</Text>
            <FlatList
                data={notifications}
                extraData={notifications}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.notificationItem} onPress={() => handleNotificationPress(item)}>
                        <Text style={styles.notificationTitle}>Message</Text>
                        <Text style={styles.notificationMessage}>{item.message}</Text>
                        <Text style={styles.notificationTime}>{formatDate(item.timestamp)}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 15,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    notificationItem: {
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
    },
    notificationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    notificationMessage: {
        fontSize: 16,
        color: '#555',
    },
    notificationTime: {
        fontSize: 14,
        color: '#888',
        marginTop: 10,
    },
});

export default NotificationScreen;
