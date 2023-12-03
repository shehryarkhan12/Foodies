import React, { useState,useEffect,useContext } from "react";
import SmsAndroid from 'react-native-sms';
import { View, Text, Button, Alert, FlatList, TouchableOpacity,StyleSheet,Image,ScrollView, ActivityIndicator } from "react-native";

const FilterButton = ({ title, isSelected }) => (
    <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, isSelected && styles.filterButtonSelected]}>
            <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>{title}</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 20,
        paddingHorizontal: 10,
    },
    filterButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        backgroundColor: 'white',
        marginHorizontal: 5,
        color:'white',
        borderColor:'lightgrey'

    },
    filterButtonSelected: {
        backgroundColor: 'green',
    },
    filterText: {
        color: 'black',
    },
    filterTextSelected: {
        color: 'white',
    },
});

export default FilterButton;