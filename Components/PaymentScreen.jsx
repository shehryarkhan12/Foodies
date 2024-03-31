import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons,MaterialCommunityIcons } from '@expo/vector-icons';
import { Checkbox, RadioButton, Button } from 'react-native-paper';
import { useItems } from './ItemsContext';
import { Switch } from 'react-native'; // If you want to use the Switch from React Native
import { Picker } from '@react-native-picker/picker';


const PaymentScreen = ({navigation}) => {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [saveAddress, setSaveAddress] = useState(false);
  const [usePhoneForUpdates, setUsePhoneForUpdates] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('creditCard'); // Default payment method
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [errors, setErrors] = useState({
    address: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    transactionId: ''
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Denmark', // default set as an example
    saveDetails: false,
  });

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      country: '', // Assuming you have a country field
      saveDetails: '',
    };
  
    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      formIsValid = false;
    }
  
    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      formIsValid = false;
    }
  
    // Validate email using a simple regex
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Email is invalid';
      formIsValid = false;
    }
  
    // Validate phone using the example pattern for 10 digits
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      formIsValid = false;
    } else if (!/^\d{11}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Invalid phone number';
      formIsValid = false;
    }
  
    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      formIsValid = false;
    }
  
    // Validate city
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
      formIsValid = false;
    }
  
    // Validate ZIP Code
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP Code is required';
      formIsValid = false;
    }
  
    // Placeholder for country validation
    // You need to implement the logic based on how you handle country selection in your form
    // ...
  
    // Update the errors state
    setErrors(newErrors);
  
    return formIsValid;
  };
  

  // Function to handle text input changes
  const handleInputChange = (name, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  
    // Reset the error for the field being edited
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const handleSubmit = () => {
  if (validateForm()) {
    // If the form is valid, proceed with form submission
    console.log('Form is valid. Submitting...');
    navigation.navigate("OrderComplete");
  } else {
    // If the form is not valid, show errors
    console.log('Form is not valid. Please correct the errors.');
  }
};

const handleExpiryDateChange = (text) => {
    // Remove all non-digit characters except the slash (/)
    let cleaned = text.replace(/[^0-9/]/g, '');
  
    // Automatically insert slash after the second digit
    if (cleaned.length === 2 && text.slice(-1) !== '/') {
      cleaned += '/';
    }
  
    setExpiryDate(cleaned);
  };
  

  const { selectedItems, setSelectedItems, orderId, setOrderId,subtotal,setSubtotal,token,setToken } = useItems();

//   // Example submit function
//   const handleSubmit = () => {
//     if (validateForm()) {
//       // Proceed with form submission
//     } else {
//       // Show errors
//     }
//   };

  const safeMultiply = (a, b) => {
    if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) {
        return 0;
    }
    return a * b;
}

const totalCost = useMemo(() => {
    return subtotal
        .filter(item => typeof item.price === 'number' && !isNaN(item.price))
        .reduce((acc, item) => acc + safeMultiply(item.price, item.quantity), 0);
}, [subtotal]);

  const subtotalItems = useMemo(() => {
    return subtotal.map(item => ({
      ...item,
      total: safeMultiply(item.price, item.quantity)
    }));
  }, [subtotal]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backIcon} onPress={() => {navigation.goBack() }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Payment Details</Text>
      </View>

      <View style={styles.formSection}>
      {/* Address Input */}
      <Text style={styles.label}>Full Address</Text>
      {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
      <View style={styles.inputRow}>
      <MaterialIcons name="person" size={20} color="#FF2147" />
        <TextInput
          style={styles.input}
          value={formData.firstName}
          onChangeText={(text) => handleInputChange('firstName', text)}
          placeholder="First Name"
        />
        </View>
        {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
        <View style={styles.inputRow}>
        <MaterialIcons name="person" size={20} color="#FF2147" />
        <TextInput
          style={styles.input}
          value={formData.lastName}
          onChangeText={(text) => handleInputChange('lastName', text)}
          placeholder="Last Name"
        />
        </View>
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        <View style={styles.inputRow}>
        <MaterialIcons name="email" size={20} color="#FF2147" />
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          placeholder="Email"
          keyboardType="email-address"
        />
        </View>
        {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
        <View style={styles.inputRow}>
        <MaterialIcons name="phone" size={20} color="#FF2147" />
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
          placeholder="Phone"
          keyboardType="phone-pad"
        />
        </View>
       
      
{errors.address ? <Text style={styles.errorText2}>{errors.address}</Text> : null}
      {/* Shipping Details Section */}
      <View style={styles.inputRow}>
      <MaterialIcons name="location-on" size={20} color="#FF2147" />
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(text) => handleInputChange('address', text)}
          placeholder="Address"
        />
        </View>
        {errors.city ? <Text style={styles.errorText2}>{errors.city}</Text> : null}
        <View style={styles.inputRow}>
        <MaterialIcons name="location-city" size={20} color="#FF2147" />
        <TextInput
          style={styles.input}
          value={formData.city}
          onChangeText={(text) => handleInputChange('city', text)}
          placeholder="City"
        />
        </View>
        {errors.zipCode ? <Text style={styles.errorText}>{errors.zipCode}</Text> : null}
        <View style={styles.inputRow}>
        <MaterialIcons name="markunread-mailbox" size={20} color="#FF2147" />
        <TextInput
          style={styles.input}
          value={formData.zipCode}
          onChangeText={(text) => handleInputChange('zipCode', text)}
          placeholder="ZIP Code"
        />
        </View>
        </View>
        {/* Dropdown for country selection */}
        <Text style={styles.label2}>Country</Text>
        <View style={styles.pickerContainer}>
        <MaterialIcons name="public" size={20} color="#FF2147" />
        
          <Picker
            selectedValue={selectedCountry}
            onValueChange={(itemValue, itemIndex) => setSelectedCountry(itemValue)}
            style={styles.picker}
          >
            {/* Dynamically render Picker.Items based on your countries data */}
            <Picker.Item label="Select a country" value="" />
            <Picker.Item label="United States (US)" value="US" />
            <Picker.Item label="Canada (CA)" value="CA" />
            <Picker.Item label="Australia (AU)" value="AU" />
            <Picker.Item label="Pakistan (PK)" value="PK" />
            {/* ... add more countries as needed */}
          </Picker>
        </View>
        <View style={styles.toggleRow}>
          <Switch
            value={formData.saveDetails}
            onValueChange={(value) => handleInputChange('saveDetails', value)}
          />
          <Text style={styles.toggleLabel}>Save my details</Text>
        </View>
      

      {/* Checkboxes */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={saveAddress ? 'checked' : 'unchecked'}
          onPress={() => setSaveAddress(!saveAddress)}
          color="#FF2147"
        />
        <Text style={styles.checkboxLabel}>Save this address for future orders</Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={usePhoneForUpdates ? 'checked' : 'unchecked'}
          onPress={() => setUsePhoneForUpdates(!usePhoneForUpdates)}
          color="#FF2147"
        />
        <Text style={styles.checkboxLabel}>Use this number for order updates</Text>
      </View>
        {/* Payment Options Section */}
      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>Payment Options</Text>
        <RadioButton.Group onValueChange={newValue => setPaymentMethod(newValue)} value={paymentMethod}>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="creditCard" />
            <MaterialCommunityIcons name="credit-card" size={24} color="#FF2147" />
            <Text style={styles.radioButtonLabel}>Credit/Debit Card</Text>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="easypaisa" />
            <MaterialIcons name="mobile-friendly" size={24} color="#FF2147" />
            <Text style={styles.radioButtonLabel}>Easypaisa</Text>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="jazzcash" />
            <MaterialIcons name="payment" size={24} color="#FF2147" />
            <Text style={styles.radioButtonLabel}>JazzCash</Text>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="cod" />
            <MaterialIcons name="account-balance-wallet" size={24} color="#FF2147" />
            <Text style={styles.radioButtonLabel}>Cash on Delivery</Text>
          </View>
        </RadioButton.Group>
      </View>
     {/* Payment Method Details */}
     {paymentMethod === 'creditCard' && (
  <View style={styles.paymentDetailsSection}>
    {/* Card Number Input */}
    <View style={styles.inputWithIcon}>
      <MaterialCommunityIcons name="credit-card-outline" size={20} color="#FF2147" />
      <TextInput
        style={styles.input}
        onChangeText={setCardNumber}
        value={cardNumber}
        placeholder="Card Number"
        keyboardType="numeric"
        // Other TextInput props
      />
    </View>
    {/* Expiry Date Input */}
    <View style={styles.inputWithIcon}>
      <MaterialCommunityIcons name="calendar" size={20} color="#FF2147" />
      <TextInput
        style={styles.input}
        onChangeText={handleExpiryDateChange}
        value={expiryDate}
        placeholder="Expiry Date (MM/YY)"
        keyboardType="numeric"
        maxLength={5} // Limit length to 5 characters (MM/YY)
        // Other TextInput props
      />
    </View>
    {/* CVV Input */}
    <View style={styles.inputWithIcon}>
      <MaterialCommunityIcons name="lock" size={20} color="#FF2147" />
      <TextInput
        style={styles.input}
        onChangeText={setCvv}
        value={cvv}
        placeholder="CVV"
        keyboardType="numeric"
        maxLength={3} 
        // Other TextInput props
      />
    </View>
    {/* Cardholder's Name Input */}
    <View style={styles.inputWithIcon}>
      <MaterialCommunityIcons name="account-box-outline" size={20} color="#FF2147" />
      <TextInput
        style={styles.input}
        onChangeText={setCardHolderName}
        value={cardHolderName}
        placeholder="Cardholder's Name"
        // Other TextInput props
      />
    </View>
    {/* Save Card for Future Transactions Checkbox */}
    <View style={styles.checkboxContainer}>
      <Checkbox
        status={saveAddress ? 'checked' : 'unchecked'}
        onPress={() => setSaveAddress(!saveAddress)}
        color="#FF2147"
      />
      <Text style={styles.checkboxLabel}>Save card for future transactions</Text>
    </View>
  </View>
)}
      {paymentMethod === 'easypaisa' && (
        <View style={styles.paymentDetailsSection}>
          <Text style={styles.instructions}>Please transfer the amount to our Easypaisa account and enter the transaction ID below.</Text>
          <TextInput
            style={styles.input}
            onChangeText={setTransactionId}
            value={transactionId}
            placeholder="Transaction ID"
          />
        </View>
      )}

      {paymentMethod === 'jazzcash' && (
        <View style={styles.paymentDetailsSection}>
          <Text style={styles.instructions}>Please transfer the amount to our JazzCash account and enter the transaction ID below.</Text>
          <TextInput
            style={styles.input}
            onChangeText={setTransactionId}
            value={transactionId}
            placeholder="Transaction ID"
          />
        </View>
      )}

      {paymentMethod === 'cod' && (
        <View style={styles.paymentDetailsSection}>
          <Text style={styles.instructions}>Payment will be collected at the time of delivery.</Text>
        </View>
      )}

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Order Summary</Text>

        {/* Displaying Selected Items */}
        {subtotalItems.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemText}>{item.name}: {item.quantity} x {item.price}Rs</Text>
            <Text style={styles.itemTotal}>{(item.quantity * item.price).toFixed(2)}Rs</Text>
          </View>
        ))}

        {/* Displaying Total Amount */}
        <Text style={styles.footerText}>Total Amount: {totalCost.toFixed(2)}Rs</Text>
        <Button 
          mode="contained" 
          onPress={handleSubmit}
          
          style={styles.proceedButton}
          labelStyle={styles.proceedButtonText}
        >
          Place Order
        </Button>

        <TouchableOpacity onPress={() => {/* handle terms and conditions */}}>
          <Text style={styles.termsText}>Terms and Conditions</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBar: {
    backgroundColor: '#FF2147',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop:24
  },
  backIcon: {
    position: 'absolute',
    left: 15,
    top: 10,
    bottom: 10,
  },
  topBarTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  formSection: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
    
  },
  label2: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
    marginLeft:5
  },
  inputContainer: {
    flexDirection: 'column', // Change to 'column' for vertical stacking
    marginBottom: 15,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f7f7f7',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f7f7f7',
    marginBottom: 10, // Space between rows
   
  },
  inputShippingDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f7f7f7',
    marginBottom: 10, // Space between rows
    marginLeft:14,
    marginRight:14
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    padding: 10, // Add padding for text alignment
    backgroundColor: 'transparent',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF2147',
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButtonLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  errorInput: {
    borderColor: 'red'
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5
  },
  errorText2: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
    marginLeft:15
  },
  paymentDetailsSection: {
    padding: 20,
  },
  instructions: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f7f7f7',
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  proceedButton: {
    backgroundColor: '#FF2147',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  proceedButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden', // Similar to inputContainer
    marginLeft:10,
    marginRight:10
  },
  picker: {
    flex: 1,
    marginLeft: 10, // Adjust as needed for space between icon and picker
  },
  termsText: {
    color: '#FF2147',
    marginTop: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  itemTotal: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  // Add styles for other components here
});

export default PaymentScreen;
