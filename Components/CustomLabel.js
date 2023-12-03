import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function CustomLabel({ text }) {
    return (
        <LinearGradient
            colors={['#FF5252', '#FF8585']} // Gradient colors
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.labelContainer}
        >
            <Text style={styles.itemLabel}>{text}</Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    labelContainer: {
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FF5252', // Color of the border
        paddingVertical: 5,
        paddingHorizontal: 10,
        shadowColor: '#FF5252', // Shadow color
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6, // for Android shadow
    },
    itemLabel: {
        color: 'white', // Adjust text color for better visibility
        fontWeight: 'bold', // Making text bold for better readability
    }
});

export default CustomLabel;
