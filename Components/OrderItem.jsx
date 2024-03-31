import React,{useState,useEffect} from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
// import orders from "../../../assets/data/orders.json";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import orders from "../Components/data/orders.json";
import { API_IP_ADDRESS } from "../api/config";
import axios from "axios";

const order = orders[0];
const OrderItem = ({ orderId,orders }) => {
  const navigation = useNavigation();
  console.log(" orderId in OrderItem:", orderId);
  console.log("orders in OrderItem",order);
  const[data,setData]=useState([]);
  
  async function reverseGeocode(latitude, longitude) {
    try {
      const googleMapsApiKey = 'AIzaSyDu_ikrzuCSjDJh3h0LDoz79ooMNzbKxwc';
      const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`);
      console.log("Geocoding response:", res.data);
      
      // Extracting the formatted address from the response
      if (res.data && res.data.results && res.data.results.length > 0) {
        console.log("Geocoding response:", res.data);
        return res.data.results[0].formatted_address;
       
        
      }
      return 'Address not found';
    }catch (error) {
        if (error.response) {
          console.error("Error Response:", error.response.data);
          return 'Address not found';
        } else {
          console.error("Error in reverse geocoding: ", error.message);
          return 'Address not found';
        }
      }
  }

  async function getOrderItems() {
    try {
      const response = await axios.get(`http://${API_IP_ADDRESS}/api/order/item/myId?myId=${orderId}`);
      setData(response.data);
      console.log("Order Data: " + JSON.stringify(response.data));
    
      // Adding addresses to each item
      const itemsWithAddress = await Promise.all(response.data.map(async (item) => {
        // Check if the item has latitude and longitude
        if ('lati' in item && 'longi' in item) {
          const address = await reverseGeocode(item.lati, item.longi);
          return { ...item, address };
        }
        return item;
      }));
    
      setData(itemsWithAddress);
      console.log("Updated Data with Addresses:", itemsWithAddress);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getOrderItems();
    
  }, []);

  
  return (
    <Pressable
      style={{
        flexDirection: "row",
        borderColor: "red",
        borderWidth: 2,
        borderRadius: 12,
        margin: 10,
        justifyContent: "space-between",
      }}
      onPress={() => navigation.navigate("OrderDelivery", { orderId: orderId,orders:orders,data:data })}
    >
      <Image
        source={{ uri: order.Vaccine.image }}
        style={{
          width: "35%",
          height: "100%",
          borderBottomLeftRadius: 10,
          borderTopLeftRadius: 10,
        }}
      />
     {data.map((item) => (
        <View style={styles.mainContainer} key={item.id}>
          <Text style={styles.orderName}>
            {item.name}
          </Text>
          <Text style={styles.orderPrice}>
            Price: {item.price}Rs
          </Text>
          <Text style={styles.clinicName}>Quantity: {item.quantity}</Text>
          <Text style={styles.deliveryDetailsTitle}>
            Delivery Details:
          </Text>
          <Text style={styles.clinicName}>Name: {item.name}</Text>
          <Text style={styles.clinicName}>Rating: {order.Vaccine.rating}</Text>
          <Text style={styles.clinicAddress}>Address: {item.address}</Text>
        </View>
      ))}         
              
      <Entypo name="check" size={30} color="white" style={styles.checkIcon} />
    </Pressable>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  pressableStyle: {
    flexDirection: "row",
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 12,
    margin: 10,
    justifyContent: "space-between",
  },
  mainContainer: {
    marginLeft: 10,
    flex: 1,
    paddingVertical: 5,
  },
  orderName: {
    fontSize: 18,
    fontWeight: "500",
  },
  orderPrice: {
    color: "grey",
  },
  deliveryDetailsTitle: {
    marginTop: 10,
    fontWeight: "500",
  },
  clinicName: {
    color: "grey",
  },
  clinicAddress: {
    color: "grey",
  },
  checkIcon: {
    padding: 5,
    backgroundColor: "red",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
