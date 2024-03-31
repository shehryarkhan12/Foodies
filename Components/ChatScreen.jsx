import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios'; // Import axios or another HTTP client
import { API_IP_ADDRESS } from '../api/config';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: 'user',
      };
      setMessages([...messages, newMessage]);
      
      try {
        // Replace with your chatbot service endpoint and set up the request body as needed
        const response = await axios.post(`http://${API_IP_ADDRESS}/message`, {
          message: inputText,
          // Additional data if required by your chatbot service
        });
  
        const botResponse = {
            id: messages.length + 2,
            text: response.data.reply || 'No response received', // Default message if reply is empty
            sender: 'bot',
        };
        console.log('Response from server:', response.data);
        
        setMessages(currentMessages => [...currentMessages, botResponse]);
      } catch (error) {
        console.error('Error sending message to chatbot:', error);
        // Handle error appropriately
      }
  
      setInputText('');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map(msg => (
          <View key={msg.id} style={msg.sender === 'user' ? styles.userMessage : styles.botMessage}>
            <Text>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message"
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  messagesContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  sendButton: {
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
});

export default ChatScreen;
