import React from 'react';
import { Animated, Dimensions } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

const SwipeableNotification = ({ children, onSwipeAway }) => {
    const screenWidth = Dimensions.get('window').width;
   
    
    const renderSwipeAction = (progress, color) => {
        const scale = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 2], // Same here for left swipe
        });

        // Increase the frequency of oscillation for the shaking effect
        const rotate = progress.interpolate({
            inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
            outputRange: ['-15deg', '15deg', '-15deg', '15deg', '-15deg', '0deg'],
        });

        const actionWidth = screenWidth * 0.975 ; // Adjust width of swipeable area
        const actionHeight = 138; // Adjust to match your notification item height
        return (
            <Animated.View style={{
                width:actionWidth,
                backgroundColor: color,
                justifyContent: 'center',
                alignItems: 'flex-start',
               
                marginTop:10,
                marginBottom:10,
                marginLeft:10

            }}>
                <Animated.View style={{ marginLeft:15,transform: [{ scale }, { rotate }] }}>
                    <MaterialIcons name="delete" size={30} color="white" />
                </Animated.View>
            </Animated.View>
        );
    };

    return (
        <Swipeable
            
            renderLeftActions={(progress) => renderSwipeAction(progress, 'red')}
            onSwipeableOpen={(direction) => direction === 'left' ? onSwipeAway() : null}
        >
            {children}
        </Swipeable>
    );
};

export default SwipeableNotification;
