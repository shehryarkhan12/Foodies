import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import axios from 'axios';
import { API_IP_ADDRESS } from '../api/config';
import MapView, { Marker } from 'react-native-maps';
import { Entypo } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const CombinedOrderScreen = ({navigation}) => {
    const [orders, setOrders] = useState([]);
    const bottomSheetRef = useRef(null);
    const { width, height } = useWindowDimensions();
    const snapPoints = ["12%", "95%"];

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://${API_IP_ADDRESS}/api/order/items`);
                setOrders(response.data);
                console.log("Fetched Orders:", response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    const OrderCard = ({ item }) => {
        return (
            <View style={style.orderCard}>
                {/* Display order image if available */}
                {item.image && (
                    <Image source={item.image} style={style.orderImage} />
                )}
    
                {/* Order details */}
                <View style={style.orderDetails}>
                    <Text style={style.orderName}>{item.name}</Text>
                    <Text style={style.orderPrice}>ConfirmPrice: {item.price}</Text>
                </View>
    
                {/* Quantity */}
                <View style={style.orderQuantity}>
                    <Text style={style.orderQuantityText}>{item.quantity}</Text>
                </View>
            </View>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <MapView
                style={{ height, width }}
                showsUserLocation
                followsUserLocation
                // ... other MapView props
            >
                {/* ... Map Markers */}
            </MapView>
            <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                // ... other BottomSheet props
            >
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={orders}
                        renderItem={({ item }) => <OrderCard item={item} />}
                        keyExtractor={item => item._id}
                    />
                </View>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

const style = StyleSheet.create({
    orderCard: {
        height: 70,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginVertical: 10,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderImage: {
        height: 50,
        width: 50,
    },
    orderDetails: {
        flex: 1,
        marginLeft: 10,
    },
    orderName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderPrice: {
        fontSize: 13,
        color: 'grey',
    },
    orderQuantity: {
        marginRight: 20,
    },
    orderQuantityText: {
        fontSize: 17,
        fontWeight: 'bold',
    },
});

export default CombinedOrderScreen;
