import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import api from '../api/api';

// Type for each review item
type Review = {
    _id: string;
    rating: number;
    comment: string;
};

// Type for the component props
type UserReviewProps = {
    restaurantId: string;
};

const UserReview: React.FC<UserReviewProps> = ({ restaurantId }) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [userReviews, setUserReviews] = useState<Review[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get(`/reviews/${restaurantId}`);
                if (response.data) {
                    setUserReviews(response.data);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
    
        fetchReviews();
    }, [restaurantId]);

    const handleReviewSubmit = async () => {
        try {
            const review = { restaurantId, rating, comment };
            const response = await api.post('/review', review);
            if (response.data && typeof response.data === "object") {  // Ensure that we received an object
                setUserReviews([...userReviews, response.data]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Rate this Restaurant:</Text>

            <TextInput
                style={styles.input}
                placeholder="Rating (1-5)"
                value={String(rating)}
                onChangeText={text => setRating(Number(text))}
                keyboardType="numeric"
                maxLength={1}  // since ratings are between 1 and 5
            />

            <TextInput
                style={[styles.input, styles.comment]}
                placeholder="Your Review"
                value={comment}
                onChangeText={text => setComment(text)}
                multiline
            />

            <Button title="Submit Review" onPress={handleReviewSubmit} color="#FF6347" />

            <Text style={styles.reviewHeader}>Reviews:</Text>

            {userReviews.map(review => (
                <View key={review._id} style={styles.reviewBox}>
                    <Text style={styles.ratingText}>{review.rating} stars</Text>
                    <Text>{review.comment}</Text>
                    {/* Add Edit/Delete buttons and functionalities */}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 15,
        backgroundColor: 'white',
    },
    comment: {
        height: 100,
    },
    reviewHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    reviewBox: {
        marginTop: 15,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    ratingText: {
        fontWeight: 'bold',
    },
});

export default UserReview;
