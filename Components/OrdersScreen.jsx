import React, { useRef, useMemo,useState,useEffect } from "react";
import { View, Text, FlatList, useWindowDimensions,  } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import OrderItem from "../Components/OrderItem";
import orders from "../Components/data/orders.json";
import MapView, { Marker } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import { API_IP_ADDRESS } from "../api/config";

const OrdersScreen = ({route}) => {
  const {  orderId } = route.params;
    console.log(" orderId---:", orderId);

  const bottomSheetRef = useRef();
  const { width, height } = useWindowDimensions(); 

  const [orders,setOrders] = useState([]);

  useEffect( async ()=>{
      
      try {
          const response = await axios.get(`http://${API_IP_ADDRESS}/api/order/item/myId?myId=${orderId}`);
          setOrders(response.data);
          console.log("============>FAMILY DATA: " + JSON.stringify(response.data));
    
        } catch (error) {
          console.error(error);
        }
  },[])
  const snapPoints = useMemo(() => ["12%", "95%"], []);
  

  //   useEffect(() => {
  //     (async () => {
  //       const { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         // Handle permission denied
  //       }
  //     })();
  //   }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "lightblue" }}>
      <MapView
        style={{
          height,
          width,
        }}
        showsUserLocation
        followsUserLocation
        
      >
        {orders.map((order) => (
          <Marker
            key={order._id}
            title={order.name}
            // description={order.price}
            coordinate={{
              latitude: order.lati,
              longitude: order.longi,
            }}
          >
            <View
              style={{
                backgroundColor: "#329998",
                padding: 5,
                borderRadius: 15,
              }}
            >
              <Entypo name="shop" size={24} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        handleIndicatorStyle={{ backgroundColor: "grey", width: 100 }}
      >
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Text
            style={{
              fontWeight: "600",
              fontSize: 20,
              letterSpacing: 0.5,
              paddingBottom: 5,
              color:"red"
            }}
          >
            You're Online
          </Text>
          <Text style={{ letterSpacing: 0.5, color: "grey" }}>
            Your Orders: {orders.length}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={orders}
            renderItem={({ item }) => <OrderItem order={item} orders={orders} orderId={orderId}  />}
             keyExtractor={(item) => item._id.toString()}
          />
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default OrdersScreen;
