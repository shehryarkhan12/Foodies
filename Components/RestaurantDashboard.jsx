import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RestaurantDashboard = ({ email, username, id }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome to your Restaurant Portal, {username}!</Text>
            {/* ... Other restaurant profile details ... */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        fontSize: 24,
        marginBottom: 16,
    }
});

export default RestaurantDashboard;
