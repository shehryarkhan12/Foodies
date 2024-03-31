import React,{useEffect,useState,useRef, useCallback} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity,Dimensions,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const ovalWidth = width * 2; // Ensuring the oval is wide enough to cover the entire width
const ovalHeight = height * 0.5; // Adjust the height of the oval here if needed
const Pagination = () => {
    const [scrollOffset, setScrollOffset] = useState(0);
    const scrollViewRef = useRef(null);
    const navigation = useNavigation();
  // Dummy data for the pages
  const pages = [
    {
      image: require('../Images/middleImage.png'),
      title: 'Choose a Favourite Food',
      description: 'When you order Eat Street, we\'ll hook you up with exclusive coupons, specials and rewards'
    },
    {
        image: require('../Images/rider.png'),
        title: 'Hot Delivery to Home',
        description: 'We make food ordering fast, simple and free-no matter if you order online or cash'
      },
      {
        image: require('../Images/GreatFood.png'),
        title: 'Receive the Great Food',
        description: 'You\'ll receive the great food within a hour. And get free delivery credits for every order.'
      },

      
    // Add more pages here
  ];
  

  const handleScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    setScrollOffset(x);
  };
  const handlePageChange = (newPage) => {
    if (newPage < pages.length) {
      const offset = width * newPage;
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
      //setScrollOffset(offset); // Set the scroll offset directly
    }
  };
   
  // Calculate the active page directly from the scroll offset
  const activePage = Math.round(scrollOffset / width);

    return (
      <View style={styles.container}>
       
        <View style={styles.upperBackground} />
        <View style={styles.headerContainer}>
        <Image source={require('../Images/Topicon.png')} style={styles.iconStyle} />
        <Text style={styles.headerText}>FoodiesHub</Text>
      </View>

        

          <ScrollView
          ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
       
        {pages.map((page, index) => (
          <View key={index} style={styles.pageContainer}>
            <Image source={page.image} style={styles.foodImage} />
            <Text style={styles.titleText}>{page.title}</Text>
            <Text style={styles.descriptionText}>{page.description}</Text>
          </View>

        ))}
            
        
          </ScrollView>
          <View style={styles.paginationContainer}>
        {pages.map((_, pageIndex) => (
          <View
            key={pageIndex}
            style={[
              styles.dot,
              activePage === pageIndex && styles.activeDot, // Apply the active style if this is the current page
            ]}
          />
        ))}
      </View>
           <View style={styles.buttonContainer}>
           <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate("Question")}>
          <Text style={styles.buttonText2}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.nextButton}
  onPress={() => {
    if (activePage === pages.length - 1) {
      navigation.navigate("Question");
    } else {
      handlePageChange(activePage + 1);
    }
  }}
>
  <Text style={styles.buttonText}>
    {activePage === pages.length - 1 ? "Let's Get Started" : "Next"}
  </Text>
</TouchableOpacity>
      </View>
    </View>
     
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE8E9'
  },
  upperBackground: {
    backgroundColor: '#FFFFFF', // The color for the upper half
    position: 'absolute',
    top: 0,
    width: width,
    height: height / 2, // Only take up the top half of the screen
    borderBottomLeftRadius: width, // Large radius to create an oval shape on the bottom edge
    borderBottomRightRadius: width,
  },
  lowerBackground: {
    backgroundColor: '#FFFFFF', // A brighter shade of white for the lower half
    position: 'absolute',
    top: height / 2 - 100, // Adjust the top to create the oval shape cut out
    width: width,
    height: height / 2 + 100, // Increase the height to ensure it covers the edge of the oval
    borderTopLeftRadius: width / 2, // Half the width will create an oval shape on the sides
    borderTopRightRadius: width / 2,
    overflow: 'hidden', // Ensures that nothing goes outside the bounds of the rounded corners
  },
  headerContainer: {
    flexDirection: 'row', // Align items in a row
    justifyContent: 'center', // Center items horizontally
    alignItems: 'center', // Center items vertically
    marginTop: 50,
    width: width, // Set the width to take up the full device width
  },
  iconStyle: {
    width: 120, // Adjust size as needed
    height: 120, // Adjust size as needed
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 35, // Consider making it larger for a bold appearance
    fontWeight: 'bold',
    marginLeft:0, // Space between the icon and the text
    color: '#B51902',
  },
  pageContainer: {
    width: width, // Each page should have the width of the screen
    alignItems: 'center',
    justifyContent: 'flex-start', // Align content to the top
    paddingTop: 20, // Add some padding at the top
  },
  
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30, // Adjusted to align with the design's padding
  },
  foodImage: {
    width: 600, // Increased size for larger devices
    height: 300, // Increased size for larger devices
    resizeMode: 'contain', // Ensure the full image is visible
    marginBottom: 0, // Provide space between image and text
  },
  titleText: {
    fontSize: 35, // Slightly larger font size
    fontWeight: 'bold',
    color: '#333', // Darker text for better contrast
    marginBottom: 10, // Space between title and description
  },
  descriptionText: {
    fontSize: 16,
    color: '#666', // Lighter text color for the description
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 30, // Space between description and pagination
  },
  paginationContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 5, // Reduced space above the dots
    marginBottom: 80, // Space below the dots before the buttons
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#B51902',
    marginHorizontal: 5,
  },
  activeDot: {
    width: 25, // Width is elongated
    height: 10, // Height remains the same for a flattened look
    borderRadius: 5, // This will ensure the dot has rounded corners
    backgroundColor: '#B51902', // Active dot color
    marginHorizontal: 5, // Maintain spacing between dots
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 0, // Reduced space above the buttons
  },
  skipButton: {
    backgroundColor: 'transparent', // Skip button has no background
    paddingVertical:16,
    paddingHorizontal: 20,
  },
  nextButton: {
    backgroundColor: '#B51902', // Next button with a solid color
    paddingVertical: 15,
    paddingHorizontal: 75,
    borderRadius: 10, // Rounded corners for the button
    marginBottom:30,
    
  },
  buttonText: {
    color: '#FFFFFF', // White text for buttons
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize:20
  },
  gradient: {
    paddingHorizontal: 100,
    paddingVertical: 12,
    borderRadius: 25, // This should match the borderRadius of button to maintain the shape
    justifyContent: 'center', // Center the text within the gradient
    alignItems: 'center', // Center the text horizontally
    minWidth: 350, // Ensures a minimum width for the button
    maxWidth: 450, // You can adjust maxWidth as needed or remove it if not necessary
  },
  buttonText2: {
    color: 'grey', // White text for buttons
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize:19
  },
});

export default Pagination;
