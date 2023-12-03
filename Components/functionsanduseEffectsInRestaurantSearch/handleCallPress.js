import { Alert,Animated,View, TextInput, Button, StyleSheet, Text,Image,FlatList,TouchableOpacity,ScrollView,Modal,Linking} from 'react-native';

export const handleCallPress = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== 'Not available') {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      console.warn("No phone number available or phone number is 'Not available'");
    }
  };