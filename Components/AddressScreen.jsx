import React, { useState,useEffect } from 'react';
import { Alert,Image,View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Button,TextInput } from 'react-native';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U';

// Helper function to validate address fields
const isValidNumeric = (value) => /^\d+[\d\/\-]*$/.test(value);
const isValidAlphabetic = (value) => /^[a-zA-Z\s\.\-]*$/.test(value);

const isValidField = (fieldValue, fieldType) => {
  // Common checks
  const isNonEmpty = fieldValue.trim().length > 0;
  const isValidLength = fieldValue.trim().length >= 2 && fieldValue.trim().length <= 100;

  // Field-specific checks
  let fieldSpecificValid = true;
  switch (fieldType) {
    case 'houseNo':
      fieldSpecificValid = isValidNumeric(fieldValue.trim());
      break;
    case 'street':
    case 'town':
    case 'city':
      fieldSpecificValid = isValidAlphabetic(fieldValue.trim());
      break;
    default:
      // No additional checks for other types
      break;
  }

  return isNonEmpty && isValidLength && fieldSpecificValid;
};


const AddressForm = ({ onSave, onCancel, defaultAddress }) => {
    const [houseNo, setHouseNo] = useState(defaultAddress.houseNo || '');
  const [streetNo, setStreetNo] = useState(defaultAddress.streetNo || '');
  const [town, setTown] = useState(defaultAddress.town || '');
  const [city, setCity] = useState(defaultAddress.city || '');
  const [fieldErrors, setFieldErrors] = useState({});
  const [validationStatus, setValidationStatus] = useState({
    houseNo: { isValid: true, message: '' },
    streetNo: { isValid: true, message: '' },
    town: { isValid: true, message: '' },
    city: { isValid: true, message: '' },
    // ... add for other fields
  });
  
// Function to validate address field in real-time
const validateField = async (fieldName, value) => {
    // Assuming you have a function to check if the field is valid
    const isValid = await validateAddressWithGoogle(value); // Simplified for demonstration
  
    let message = '';
    if (!isValid) {
      switch (fieldName) {
        case 'houseNo':
          message = 'Invalid house number';
          break;
        case 'streetNo':
          message = 'Invalid street/block number';
          break;
        case 'town':
          message = 'Invalid town name';
          break;
        case 'city':
          message = 'Invalid city name';
          break;
        default:
          message = 'Invalid input';
      }
    }
  
    setValidationStatus((prevStatus) => ({
      ...prevStatus,
      [fieldName]: { isValid, message }
    }));
  };
  

  // Modify onChangeText for houseNo as an example
  const onHouseNoChange = (text) => {
    setHouseNo(text);
    if (validationStatus.houseNo.message) {
      setValidationStatus(prevStatus => ({
        ...prevStatus,
        houseNo: { isValid: true, message: '' }
      }));
    }
  };
  
  const onStreetNoChange = (text) => {
    setStreetNo(text);
    if (validationStatus.streetNo.message) {
      setValidationStatus(prevStatus => ({
        ...prevStatus,
        streetNo: { isValid: true, message: '' }
      }));
    }
  };
  
  const onTownNoChange = (text) => {
    setTown(text);
    if (validationStatus.town.message) {
      setValidationStatus(prevStatus => ({
        ...prevStatus,
        town: { isValid: true, message: '' }
      }));
    }
  };
  
  const onCityNoChange = (text) => {
    setCity(text);
    if (validationStatus.city.message) {
      setValidationStatus(prevStatus => ({
        ...prevStatus,
        city: { isValid: true, message: '' }
      }));
    }
  };

  const onHouseNoBlur = () => {
    validateField('houseNo', houseNo); // Validate on blur
  };

  const onStreetNoBlur = () => {
    validateField('streetNo', streetNo); // Validate on blur
  };

  const onTownBlur = () => {
    validateField('town', town); // Validate on blur
  };

  const onCityBlur = () => {
    validateField('city', city); // Validate on blur
  };
  

  const validateAddressWithGoogle = async () => {
    try {
      const addressString = `${houseNo} ${streetNo} ${town} ${city}`;
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: addressString,
          key: GOOGLE_API_KEY,
        },
      });
      // Perform validation based on response
      // For example, check if the status is 'OK' and there are results
      return response.data.status === 'OK' && response.data.results.length > 0;
    } catch (error) {
      console.error('Error validating address with Google API:', error);
      return false;
    }
  };


  const validateAndSave = async () => {
    const errors = {};
    // Local validation: Check if fields are not empty
    if (!isValidField(houseNo)) errors.houseNo = true;
    if (!isValidField(streetNo)) errors.streetNo = true;
    if (!isValidField(town)) errors.town = true;
    if (!isValidField(city)) errors.city = true;
  
    // Google API validation: Check if the address is valid
    const isValidAddress = await validateAddressWithGoogle();
    if (!isValidAddress) {
      errors.houseNo = true;
      errors.streetNo = true;
      errors.town = true;
      errors.city = true;
    }
  
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setValidationStatus({
        houseNo: { isValid: !errors.houseNo, message: errors.houseNo ? 'Invalid house number' : '' },
        streetNo: { isValid: !errors.streetNo, message: errors.streetNo ? 'Invalid street/block number' : '' },
        town: { isValid: !errors.town, message: errors.town ? 'Invalid town name' : '' },
        city: { isValid: !errors.city, message: errors.city ? 'Invalid city name' : '' },
      });
      Alert.alert('Invalid Address', 'One or more fields have an invalid address. Please enter again.');
      return; // Return early if there are validation errors
    }
  
    // If all validations pass, save the address
    onSave([houseNo, streetNo, town, city]);
  };
  
  
    return (
      <View style={styles.formContainer}>
        {!validationStatus.houseNo.isValid && (
        <Text style={styles.errorMessage}>{validationStatus.houseNo.message}</Text>
      )}
      <TextInput
        style={[styles.input, !validationStatus.houseNo.isValid && styles.inputError]}
        onChangeText={onHouseNoChange}
        value={houseNo}
        placeholder="House No"
      />
      {!validationStatus.streetNo.isValid && (
        <Text style={styles.errorMessage}>{validationStatus.streetNo.message}</Text>
      )}
      <TextInput
        style={[styles.input, !validationStatus.streetNo.isValid && styles.inputError]}
        onChangeText={onStreetNoChange}
        
        value={streetNo}
        placeholder="Street/Block No"
      />
      {!validationStatus.town.isValid && (
        <Text style={styles.errorMessage}>{validationStatus.town.message}</Text>
      )}
      <TextInput
        style={[styles.input, !validationStatus.town.isValid && styles.inputError]}
        onChangeText={onTownNoChange}
        value={town}
        placeholder="Town"
      />
      {!validationStatus.city.isValid && (
        <Text style={styles.errorMessage}>{validationStatus.city.message}</Text>
      )}
      <TextInput
        style={[styles.input, !validationStatus.city.isValid && styles.inputError]}
        onChangeText={onCityNoChange}
        value={city}
        placeholder="City"
      />
      
      <View style={styles.formButtons}>
        <TouchableOpacity style={styles.saveButton} onPress={validateAndSave}>
          <Text style={styles.saveAddressText}>Save Address</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  };
const AddressItem = ({ address, onEdit, onDelete }) => {
    return (
        <View style={styles.addressItem}>
          <Image source={require('../Images/locationicon.png')} style={styles.icon} />
          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>Address</Text>
            <Text style={styles.addressText}>{address}</Text>
          </View>
          <TouchableOpacity onPress={onEdit}>
            <Image source={require('../Images/pencil.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Image source={require('../Images/trashbin.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      );
    };

const AddressScreen = () => {
    const [addresses, setAddresses] = useState([
        // Example initial address in the new array format
        ['123', 'Main St', 'Lahore', 'Lahore']
      ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  // At the beginning of your AddressScreen component:
const [currentAddress, setCurrentAddress] = useState({ houseNo: '', streetNo: '', town: '', city: '' });

const loadAddresses = async () => {
    try {
      const storedAddresses = await AsyncStorage.getItem('addresses');
      if (storedAddresses !== null) {
        setAddresses(JSON.parse(storedAddresses));
      }
    } catch (error) {
      console.error('Failed to load addresses.', error);
    }
  };

  // Function to save addresses to AsyncStorage
  const saveAddresses = async (newAddresses) => {
    try {
      const jsonAddresses = JSON.stringify(newAddresses);
      await AsyncStorage.setItem('addresses', jsonAddresses);
    } catch (error) {
      console.error('Failed to save addresses.', error);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

const handleSaveAddress = (newAddressArray) => {
    if (editingIndex !== null) {
      // Handle update
      const updatedAddresses = editingIndex !== null ? [...addresses.slice(0, editingIndex), newAddressArray, ...addresses.slice(editingIndex + 1)] : [...addresses, newAddressArray];
      updatedAddresses[editingIndex] = newAddressArray;
      setAddresses(updatedAddresses);
      saveAddresses(updatedAddresses);
    } else {
      // Handle add
      setAddresses([...addresses, newAddressArray]);
    }
    setCurrentAddress({ houseNo: '', streetNo: '', town: '', city: '' });
    setModalVisible(false);
    setEditingIndex(null); // Reset editing index
  };
  
  const openEditModal = (index) => {
    const addressToEdit = addresses[index];
    // Convert the array back to an object to be edited
    const addressObject = {
      houseNo: addressToEdit[0],
      streetNo: addressToEdit[1],
      town: addressToEdit[2],
      city: addressToEdit[3],
    };
    setEditingIndex(index);
    setCurrentAddress(addressObject); // Set the current address for the form
    setModalVisible(true);
  };
  const handleDeleteAddress = (index) => {
    const newAddresses = [...addresses.slice(0, index), ...addresses.slice(index + 1)];
    newAddresses.splice(index, 1);
    setAddresses(newAddresses);
    saveAddresses(newAddresses); // Save the updated addresses
  };

  const renderItem = ({ item, index }) => {
    // Ensure that 'item' is an array before calling 'join'
    const displayAddress = Array.isArray(item) ? item.join(', ') : '';
  
    return (
      <AddressItem
        address={displayAddress}
        onEdit={() => openEditModal(index)}
        onDelete={() => handleDeleteAddress(index)}
      />
    );
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Address</Text>
      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => {
  setCurrentAddress({ houseNo: '', streetNo: '', town: '', city: '' });
  setEditingIndex(null);
  setModalVisible(true);
}}>
        <Text style={styles.buttonText}>Add address</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setEditingIndex(null); // Reset editing index on close
        }}
      >
         <View style={styles.modalOverlay}>
         <AddressForm
      onSave={handleSaveAddress}
      onCancel={() => {
        setModalVisible(false);
        setCurrentAddress({ houseNo: '', streetNo: '', town: '', city: '' }); // Reset currentAddress on cancel
        setEditingIndex(null);
      }}
      defaultAddress={currentAddress}
    />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red', // assuming a black title
    paddingVertical: 20,
    fontFamily:"Fredoka",
   
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // a light line under the title
    backgroundColor: '#f8f8f8', // a light grey background for the title bar
  },

  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderColor: '#ccc', // Color of the border
    borderWidth: 1, // Width of the border
    borderRadius: 5, // If you want rounded corners
    marginVertical: 5, // Space between items
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: 'red', // assuming a red button
    borderRadius: 10, // rounded corners
    paddingVertical: 15,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    paddingHorizontal: 20, // Less horizontal padding to reduce button width
    alignSelf: 'center', // Align the button to the center
    width: '60%', // Set width to 60% of the screen width
    
  },
  buttonText:{
       color:'white',
       fontSize:20,
       fontWeight:'bold'
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 5, // reduced margin
  },
  addressLabel: {
    fontWeight: 'bold',
    fontSize:20
    // Add other styling such as font size or color as needed
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: windowWidth - 100, // Subtract desired margin from the total width
    borderRadius: 10,
    padding: 20,
    elevation: 20, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.25, // For iOS shadow
    shadowRadius: 3.84, // For iOS shadow
  },
  saveAddressText:{
       color:'white'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '100%',
    marginBottom: 10,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: 'red', // Danger color for invalid field
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorMessage: {
    color: 'red',
    fontSize: 12,
    marginRight:170
  },
  addressText: {
    flex: 1,
    fontSize: 16, // larger font size
    color: '#000', // black text
    marginHorizontal: 5,
  },
});

export default AddressScreen;
