import React, { useState} from "react";
import { SafeAreaView, View, Text, ScrollView, TextInput, TouchableOpacity,StyleSheet } from "react-native";
import { COLORS, SIZES } from "../Components/Constants/theme";
import { Ionicons } from '@expo/vector-icons'; // Use Expo's icon library
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import CardLoader from "./CardLoader";

const FilterScreen = ({ navigation, onApplyFilters }) => {

    const [location, setLocation] = useState();
    const [cuisines, setCuisines] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [creditCard, setCreditCard] = useState(false);
    const [free, setFree] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const points = [0, 0.25, 0.5, 0.75, 1]; // Points for 0%, 25%, 50%, 75%, and 100%
     // Add a new state variable for rating
     const [rating, setRating] = useState(0);

const handlePointPress = (point) => {
  setSliderValue(point * 3000); // Assuming max value is 3000
};

const getCoordinatesFromAddress = async (address) => {
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
        }

        let results = await Location.geocodeAsync(address);
        if (results.length > 0) {
            const { latitude, longitude } = results[0];
            return { latitude, longitude };
        } else {
            console.error('No results for the given address');
            return null;
        }
    } catch (error) {
        console.error('Error in geocoding:', error);
        return null;
    }
};


const applyFilters = async () => {
    setIsLoading(true); // Start loading
    let priceLevel;
    if (sliderValue >= 500 && sliderValue < 1500) {
        priceLevel = { min: 500, max: 1500 };
    } else if (sliderValue >= 1500) {
        priceLevel = { min: 1500, max: 3000 };
    }

    let locationCoords = null;
    if (location) {
        locationCoords = await getCoordinatesFromAddress(location);
    }

    const filters = {
        location: locationCoords,
        cuisines,
        open,
        creditCard,
        free,
        priceLevel, // using the mapped price range
        rating,
    };

    onApplyFilters(filters);
    navigation.closeDrawer();
    setIsLoading(false); // Stop loading after fetching data
};


    return(
        <SafeAreaView style={styles.container}>
            {isLoading && <CardLoader backgroundColor="#f2f2f2" baseColor="#e0e0e0" highlightColor="#ffffff" />}
            <ScrollView style={styles.container}>
                <View style={styles.item}>
                    <Text style={styles.title}>REGION</Text>
                    <TextInput value={location} placeholder="where do you live ?" style={styles.input}  onChangeText={setLocation}/>
                </View>
                <View style={styles.item}>
                    <Text style={styles.title}>CUISINES</Text>
                    <View style={styles.row}>
                        <TouchableOpacity
                            onPress={() => {
                                setCuisines(1)
                            }}
                            style={[styles.category, { borderColor: cuisines === 1 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles.subtitle, { color: cuisines === 1 ? COLORS.primary : COLORS.grey }]}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCuisines(2)
                            }}
                            style={[styles.category, { borderColor: cuisines === 2 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles.subtitle, { color: cuisines === 2 ? COLORS.primary : COLORS.grey }]}>American</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCuisines(3)
                            }}
                            style={[styles.category, { borderColor: cuisines === 3 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles.subtitle, { color: cuisines === 3 ? COLORS.primary : COLORS.grey }]}>Asian</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCuisines(4)
                            }}
                            style={[styles.category, { borderColor: cuisines === 4 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles.subtitle, { color: cuisines === 4 ? COLORS.primary : COLORS.grey }]}>Burger</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCuisines(5)
                            }}
                            style={[styles.category, { borderColor: cuisines === 5 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles.subtitle, { color: cuisines === 5 ? COLORS.primary : COLORS.grey }]}>Chineese</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCuisines(6)
                            }}
                            style={[styles.category, { borderColor: cuisines === 6 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles.subtitle, { color: cuisines === 6 ? COLORS.primary : COLORS.grey }]}>Fast Food</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCuisines(7)
                            }}
                            style={[styles.category, { borderColor: cuisines === 7 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles.subtitle, { color: cuisines === 7 ? COLORS.primary : COLORS.grey }]}>Italian</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCuisines(8)
                            }}
                            style={[styles.category, { borderColor: cuisines === 8 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles.subtitle, { color: cuisines === 8 ? COLORS.primary : COLORS.grey }]}>Mexican</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCuisines(9)
                            }}
                            style={[styles.category, { borderColor: cuisines === 9 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles.subtitle, { color: cuisines === 9 ? COLORS.primary : COLORS.grey }]}>Pasta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCuisines(10)
                            }}
                            style={[styles.category, { borderColor: cuisines === 10 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles.subtitle, { color: cuisines === 10 ? COLORS.primary : COLORS.grey }]}>Rice</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCuisines(11)
                            }}
                            style={[styles.category, { borderColor: cuisines === 11 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles.subtitle, { color: cuisines === 11 ? COLORS.primary : COLORS.grey }]}>Asian</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                 {/* Ratings Filter Section */}
                 <View style={styles.item}>
                    <Text style={styles.title}>RATINGS</Text>
                    <View style={styles.row}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setRating(star)}
                                style={[styles.category, { borderColor: rating >= star ? COLORS.primary : COLORS.grey }]}
                            >
                                <Text style={[styles.subtitle, { color: rating >= star ? COLORS.primary : COLORS.grey }]}>{star} Stars & Above</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.item}>
                     <Text style={styles.title}>FILTER</Text>  
                     <View style={styles.line} />
                     <TouchableOpacity
                        onPress={() => {
                            setOpen(!open);
                        }}
                        style={styles.rowFilter}
                    >
                        <Text style={styles.text}>Open Now</Text>
                        {
                            open && (
                                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                            )
                        }
                     </TouchableOpacity>
                     <View style={styles.line} />
                     <TouchableOpacity
                        onPress={() => {
                            setCreditCard(!creditCard);
                        }}
                        style={styles.rowFilter}
                    >
                        <Text style={styles.text}>Credit Card</Text>
                        {
                            creditCard && (
                                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                            )
                        }
                     </TouchableOpacity>
                     <View style={styles.line} />
                     <TouchableOpacity
                        onPress={() => {
                            setFree(!free);
                        }}
                        style={styles.rowFilter}
                    >
                        <Text style={styles.text}>Free Delivery</Text>
                        {
                            free && (
                                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                            )
                        }
                     </TouchableOpacity>  
                     <View style={styles.line} />        
                </View>
                <View style={styles.item}>
                    <Text style={styles.title}>PRICE RANGE (Rs)</Text>
                    <View style={styles.sliderContainer}>
  <Text style={styles.minMaxLabel}>{'0'}</Text>
  <View style={{ flex: 1, position: 'relative' }}>
  <Slider
    style={{ flex: 1 }}
    minimumValue={0}
    maximumValue={3000}
    thumbTintColor={COLORS.primary}
    minimumTrackTintColor={COLORS.title}
    value={sliderValue}
  onValueChange={value => setSliderValue(value)}
  />
  <View style={{
      position: 'absolute',
      top: 30, // Adjust this value as needed
      left: `${(sliderValue / 3000) * 100}%`,
      marginLeft: -12, // Adjust this value to align the label
    }}>
      <Text style={{ color: '#000' }}>{Math.round(sliderValue)}Rs</Text>
    </View>
  </View>
  <Text style={styles.minMaxLabel}>3000</Text>
</View>
</View>
                
                <TouchableOpacity
                    style={styles.button}
                    onPress={applyFilters}
                    
                >
                    <Text style={styles.buttonTxt}>Apply Filters</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        backgroundColor: '#F5F5F5', // Softer background color
    },
    item: {
        marginVertical: 15, // Increased spacing
        padding: 10, // Added padding for each section
        backgroundColor: 'white', // Section background color
        borderRadius: 8, // Rounded corners
        shadowColor: '#000', // Shadow for depth
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3, // For Android shadow
    },
    title: {
        color: COLORS.title,
        fontWeight: 'bold',
        fontSize: SIZES.h2, // Larger font size for titles
        marginBottom: 10, // Spacing after title
    },
    input: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.primary,
        backgroundColor: '#FFF', // Input background
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Space elements evenly
    },
    subtitle: {
        color: COLORS.grey,
        fontWeight: '600',
        fontSize: SIZES.h4,
    },
    category: {
        marginHorizontal: 5, // Horizontal margin for spacing between tags
        marginVertical: 5, // Vertical margin for spacing between rows of tags
        borderRadius: 20,
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 15, // Adjusted padding to ensure text doesn't touch the edges
        justifyContent: 'center', // Center content within the tag
        alignItems: 'center', // Center content vertically
        backgroundColor: 'white', // Background color of the tag
    },
    text: {
        color: COLORS.title,
        fontSize: SIZES.h4,
        flex: 1, // Flex for text alignment
    },
    line: {
        backgroundColor: COLORS.lightGrey,
        height: 1,
        marginVertical: 15,
        opacity: 0.5, // Less prominent lines
    },
    rowFilter: {
        flexDirection: 'row',
        alignItems: 'center', // Vertically align items
        paddingVertical: 10, // Padding for touch area
    },
    button: {
        marginTop: 40,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary, // Shadow for button
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    pointsContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      point: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'transparent', // or any color you prefer
        position: 'absolute',
      },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10, // Added padding top
    },
    minMaxLabel: {
        fontSize: 14,
        color: '#666', // Updated color for better visibility
    },
    buttonTxt: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: SIZES.h4,
    },
    // Additional styles can be added here
});

export default FilterScreen;


