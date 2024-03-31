import React, { useState, useEffect} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert,} from 'react-native';
import { API_IP_ADDRESS } from '../api/config';
import { useNotification } from '../Components/NotificationContext'; // Adjust the path
import SwipeableNotification from './SwipeableNotifications';
import { useTheme } from './ThemeContext'; // Adjust the import path

const NotificationScreenFU = ({ route,navigation }) => {

    const { userId } = route.params;
    console.log("UserId:",userId);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount,incrementNotificationCount] = useNotification();
    const [refreshing, setRefreshing] = useState(false); // Add this line
    let refreshSound;

    const { isNotificationsMuted } = useTheme();
    
// You can also use this condition to stop fetching notifications from the backend if they are muted
useEffect(() => {
    if (!isNotificationsMuted) {
        fetchNotifications();
    }
}, [isNotificationsMuted]); // Add isNotificationsMuted as a dependency

    useEffect(() => {
        fetchNotifications();
    }, []);

    // useEffect(() => {
    //     const unsubscribe = yourRealTimeService.onNotificationReceived((newNotification) => {
    //         // Call the method to increment the notification count
    //         incrementNotificationCount();
    //     });
    
    //     return () => unsubscribe();
    // }, []);

    
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchNotifications().then(() => setRefreshing(false));
    }, [fetchNotifications]);
    const fetchNotifications = async () => {
        try {
            if (!userId) {
                console.log("UserId is undefined, not fetching notifications.");
                return;
            }
            const response = await fetch(`http://${API_IP_ADDRESS}/notifications/${userId}`);
            const data = await response.json();
            console.log('Fetched notifications:', data);
            setNotifications(data);
            const unreadCount = data.filter(notification => !notification.read).length;
        setNotificationCount(unreadCount);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            Alert.alert("Error", "Failed to fetch notifications.");
        }
        
    };

    const markAsRead = async (notificationId) => {
    try {
        const response = await fetch(`http://${API_IP_ADDRESS}/notifications/${notificationId}/markAsRead`, {
            method: 'POST'
        });

        if (response.ok) {
            const updatedNotifications = notifications.map(notification =>
                notification._id === notificationId ? { ...notification, read: true } : notification
            );
    
            setNotifications(updatedNotifications);
    
            const unreadCount = updatedNotifications.filter(notification => !notification.read).length;
            setNotificationCount(unreadCount);
        } else {
            // Handle response error
            Alert.alert("Error", "Failed to mark notification as read.");
        }
    } catch (error) {
        console.error("Error marking notification as read:", error);
        Alert.alert("Error", "Failed to mark notification as read.");
    }
};


    const handleTrackOrderPress = (notification) => {
        if (!notification.read) {
            markAsRead(notification._id);
        }
        // Logic to track the order
         navigation.navigate('OrdersScreen', { orderId: userId });
    };

    const handleNotificationPress = (notification) => {
        if (!notification.read) {
            markAsRead(notification._id);
        }
        // Add navigation or other actions based on the notification
    };
    const removeNotification = async (notificationId) => {
        try {
            // API call to remove the notification from the backend
            const response = await fetch(`http://${API_IP_ADDRESS}/notifications/remove/${notificationId}`, {
                method: 'DELETE'
            });
    
            if (response.ok) {
                // If the deletion is successful, update the state to reflect this change
                setNotifications(currentNotifications =>
                  currentNotifications.filter(notification => notification._id !== notificationId)
                );
            } else {
                // Handle response error
                Alert.alert("Error", "Failed to remove notification.");
            }
        } catch (error) {
            console.error("Error removing notification:", error);
            Alert.alert("Error", "Failed to remove notification.");
        }
    };
    

    const renderItem = ({ item }) => (
        <SwipeableNotification onSwipeAway={() => removeNotification(item._id)}>
        <View style={[styles.notificationItem, !item.read && styles.unreadNotification]}>
            <TouchableOpacity onPress={() => handleNotificationPress(item)}>
                <Text style={styles.title}>{item.title}</Text>
                <Text>{item.message}</Text>
            </TouchableOpacity>
            {item.title === 'Order Confirmation' && ( 
                <TouchableOpacity 
                    style={styles.trackOrderButton}
                    onPress={() => handleTrackOrderPress(item)}
                >
                    <Text style={styles.trackOrderButtonText}>Track Order</Text>
                </TouchableOpacity>
            )}
        </View>
        </SwipeableNotification>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.NotificationText}>Notifications</Text>
            {isNotificationsMuted ? (
                <Text style={styles.mutedText}>Notifications are muted.</Text>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    notificationItem: {
        backgroundColor: '#F9FAFB',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        borderRadius: 8,
        marginVertical: 8,
        marginHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    unreadNotification: {
        borderLeftWidth: 4,
        borderLeftColor: '#10B981',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#111827',
        marginBottom: 5,
    },
    trackOrderButton: {
        marginTop: 10,
        backgroundColor: '#2563EB',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    trackOrderButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    mutedText: {
        fontSize: 18,
        color: 'grey',
        textAlign: 'center',
        marginTop: 20,
    },
    NotificationText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red',
        paddingVertical: 12,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
});

export default NotificationScreenFU;
