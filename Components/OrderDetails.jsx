import React,{useState,useEffect} from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, FlatList } from 'react-native';
import axios from 'axios';
import { API_IP_ADDRESS } from '../api/config';
// import orders from '../../assets/consts/orders';
const OrderScreen = ({ navigation }) => {
    const [orders,setOrders] = useState([]);

    useEffect( async ()=>{
        
        try {
            const response = await axios.get(`http://${API_IP_ADDRESS}/api/order/items`);
            setOrders(response.data);
            console.log("============>FAMILY DATA: " + JSON.stringify(response.data));
      
          } catch (error) {
            console.error(error);
          }
    },[])



  // Component for individual order item
  const OrderCard = ({ item }) => {
    return (
      <View style={style.orderCard}>
        <Image source={item.image} style={{ height: 50, width: 50 }} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
          <Text style={{ fontSize: 13, color: 'grey' }}>ConfirmPrice: {item.price}</Text>
        </View>
        <View style={{ marginRight: 20 }}>
          <Text style={{ fontSize: 17, fontWeight: 'bold',}}>
            {item.quantity}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <View style={style.header}>
        {/* <MaterialIcons name="arrow-back" size={28} onPress={() => navigation.goBack()} /> */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
          Previous Orders
        </Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        data={orders}
        renderItem={({ item }) => <OrderCard item={item} />}
        keyExtractor={item => item._id}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop:20
  },
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
});

export default OrderScreen;