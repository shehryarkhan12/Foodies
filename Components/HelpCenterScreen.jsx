import React, { useState } from 'react';
import { Image,ImageBackground,StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList,ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';




const HelpCenterScreen = (route) => {
  // Define the FAQs here, before using them in useState
  const faqs = [
    { id: '1', question: 'How can I place an order on the app?' },
    { id: '2', question: 'What should I do if I forgot my password?' },
    { id: '3', question: 'How can I track my order?' },
    { id: '4', question: 'What payment methods are accepted?' },
    { id: '5', question: 'Can I schedule an order for later delivery?' },
    { id: '6', question: 'How do I report an issue with my order?' },
    { id: '7', question: 'Can I cancel my order after placing it?' },
    { id: '8', question: 'Is there a minimum order amount for delivery?' },
    { id: '9', question: 'How do I apply a promo code to my order?' },
    { id: '10', question: 'Are there vegetarian and vegan options available?' },
    { id: '11', question: 'How do I update my delivery address?' },
    { id: '12', question: 'Can I order from multiple restaurants in one order?' }
    // Continue adding more FAQs...
];
  // State to track the expanded FAQ
  const [expandedId, setExpandedId] = useState(null);
  const [query, setQuery] = useState('');
const [filteredFAQs, setFilteredFAQs] = useState(faqs);
  const navigation = useNavigation();
  
  const handleChatPress = () => {
    // Navigate to the Chat screen (You need to set up this screen separately)
    navigation.navigate('ChatScreen');
  };
  const handleSearch = (text) => {
    setQuery(text);
    if (text === '') {
      setFilteredFAQs(faqs);
    } else {
      const filtered = faqs.filter(faq => faq.question.toLowerCase().includes(text.toLowerCase()));
      setFilteredFAQs(filtered);
    }
  };
  

  const faqDetails = {
    '1': 'To place an order on the app, first select your preferred restaurant, then browse their menu to add items to your cart. Once you have all your items, proceed to checkout, confirm your delivery details, choose a payment method, and place your order.',
    '2': 'If you forgot your password, go to the login screen and click on the "Forgot Password" link. Enter your registered email address and submit. You will receive an email with instructions to reset your password.',
    '3': 'You can track your order in real-time by going to the "Orders" section in the app. Select your current order to view its status and estimated delivery time.',
    '4': 'Our app accepts various payment methods including credit/debit cards, net banking, and popular mobile wallets. You can also choose cash on delivery for certain orders.',
    '5': 'Yes, you can schedule your order for a later time. After adding items to your cart, select the “Schedule Order” option and choose the date and time for delivery.',
    '6': 'If you encounter any issues with your order, please contact our customer service immediately through the app’s help section, detailing the issue and your order number.',
    '7': 'You can cancel your order through the app within a specified timeframe after placing it. Go to your order history, select the order, and choose Cancel Order. Refunds for canceled orders are subject to our cancellation policy.',
    '8': 'Yes, there is a minimum order amount for delivery, which varies depending on the restaurant and your location. This amount is displayed when you choose a restaurant.',
    '9': 'To apply a promo code, add items to your cart and proceed to checkout. On the payment page, enter your promo code in the designated field. If the code is valid, the discount will be applied to your total amount.',
    '10': 'Yes, we offer a variety of vegetarian and vegan options. You can filter your search by dietary preferences to find restaurants that cater to vegetarian and vegan diets.',
    '11': 'To update your delivery address, go to the “My Profile” section in the app, select “Addresses”, and either add a new address or edit an existing one.',
    '12': 'Currently, our app does not support ordering from multiple restaurants in a single order. You need to place separate orders for each restaurant.',
  };
  

  
  // Function to handle FAQ item press
  const handlePressFAQ = (id) => {
    // Toggle the expanded state for the FAQ item
    setExpandedId(expandedId === id ? null : id);
  };
  // Function to render each FAQ item
  const renderFAQItem = (item) => (
    <View key={item.id} style={styles.faqItem}>
      <TouchableOpacity onPress={() => handlePressFAQ(item.id)} style={styles.faqQuestion}>
        <Text style={styles.questionText}>{item.question}</Text>
        <Ionicons name={expandedId === item.id ? "chevron-up" : "chevron-down"} size={24} color="black" />
      </TouchableOpacity>
      {/* Render the answer if this FAQ item is expanded */}
      {expandedId === item.id && (
        <Text style={styles.faqAnswer}>{faqDetails[item.id]}</Text>
      )}
    </View>
  );


  return (
    <ScrollView style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ImageBackground source={require('../Images/arrow-left.png')} style={styles.leftarrowStyle} resizeMode="contain" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Help Center</Text>
    </View>
    <View style={styles.searchSection}>
      <Text style={styles.heading}>How can we help you?</Text>
      <TextInput
  placeholder="Write your query"
  style={styles.searchInput}
  value={query}
  onChangeText={handleSearch}
/>
    </View>
    <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
      <Image source={require('../Images/bot.png')} style={styles.botIconStyle} />
      <Text style={styles.chatButtonText}>Chat with bot!</Text>
    </TouchableOpacity>
    {/* Add the FAQ heading here */}
    <Text style={styles.faqHeading}>Frequently asked questions</Text>
    {/* Render FAQ items here */}
    {filteredFAQs.map(renderFAQItem)}
  </ScrollView>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 50, // Increase the top padding to push the content down
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Add some bottom margin to space out the header from the next section
  },
  headerTitle: {
    color:'red',
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  searchSection: {
    paddingHorizontal: 35, // Add horizontal padding to shorten the TextInput from both sides
    marginBottom: 30, // Increase the bottom margin to space out the search section from the chat button
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
  },
  faqAnswerContainer: {
    
  },
  chatButton: {
    flexDirection: 'row', // Set direction of children to row
    
    
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center', // Center children horizontally
    marginBottom: 30,
  },
  chatButtonText: {
    color:'red',
    fontWeight: 'bold',
    fontSize:25
  },
  faqItemContainer: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 20, // Adjust as necessary
  },
  faqItem: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5, // Reduced border radius
    marginHorizontal: 20,
    marginBottom: 10,
  },
  faqAnswer: {
    fontSize: 16,
    color: 'gray',
    paddingHorizontal: 15, // Maintain horizontal padding to align with the question
    paddingTop: 0, // Reduce top padding to bring the answer closer to the question
    paddingBottom: 10, // Add some bottom padding for spacing
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft:1,
    marginTop:20
  },
  leftarrowStyle: {
    width: 40, // adjust this based on the size you want for the icon
    height: 40, // adjust this based on the size you want for the icon
    marginRight: 10,
  },
  botIconStyle: {
    width: 55, // Adjust the width as needed
    height: 55, // Adjust the height as needed
    marginRight: 10, // Add some spacing between the icon and the text
  },
  faqHeading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    marginLeft:25
  },
  questionText: {
    fontSize: 16,
  },
});

export default HelpCenterScreen;
