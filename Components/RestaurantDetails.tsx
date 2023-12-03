import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';

type RestaurantData = {
    name: string;
    formatted_address: string;
    rating: number;
    // You can add more fields here based on your API response
};

type RestaurantDetailsProps = {
    placeId: string;
};

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ placeId }) => {
    const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:4000/get-restaurant-data/${placeId}`);
                
                if (response.data) {
                    setRestaurantData(response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, [placeId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!restaurantData) return null;

    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{restaurantData.name}</Text>
            <Text>{restaurantData.formatted_address}</Text>
            <Text>Rating: {restaurantData.rating}</Text>
            {/* You can display more data as required */}
        </View>
    );
};

export default RestaurantDetails;
