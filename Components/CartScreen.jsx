import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DATA = [
  { id: '1', title: 'Hamburger', price: 15.99, quantity: 2 },
  { id: '2', title: 'Hot Tacos', price: 10.99, quantity: 3 },
  { id: '3', title: 'Veg Biryani', price: 10.99, quantity: 1 }
];

const Item = ({ title, price, quantity }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.quantityControl}>
      <TouchableOpacity>
        <Ionicons name="remove-circle-outline" size={32} color="red" />
      </TouchableOpacity>
      <Text style={styles.quantityText}>{quantity}</Text>
      <TouchableOpacity>
        <Ionicons name="add-circle-outline" size={32} color="red" />
      </TouchableOpacity>
    </View>
    <Text style={styles.price}>${price.toFixed(2)}</Text>
  </View>
);

const CartScreen = () => {
  const [data, setData] = useState(DATA);

  const calculateTotal = () => data.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MY CART</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <Item title={item.title} price={item.price} quantity={item.quantity} />}
        keyExtractor={item => item.id}
      />
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Subtotal</Text>
        <Text style={styles.summaryPrice}>${calculateTotal()}</Text>
        <Text style={styles.summaryText}>Shipping fee</Text>
        <Text style={styles.summaryPrice}>$0.00</Text>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalPrice}>${calculateTotal()}</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Place your Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 18,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summary: {
    margin: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  summaryText: {
    fontSize: 18,
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'orange',
  },
  button: {
    backgroundColor: 'orange',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;
