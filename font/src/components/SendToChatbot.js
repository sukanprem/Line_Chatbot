// src/components/SendToChatbot.js
import React from 'react';
import axios from 'axios';

const SendToChatbot = ({ data }) => {
  const sendDataToChatbot = async () => {
    try {
      await axios.post('http://localhost:3000/api/send-to-chatbot', data);
      alert('Data sent to chatbot successfully!');
    } catch (error) {
      console.error('Error sending data to chatbot:', error);
      alert('Failed to send data to chatbot.');
    }
  };

  return (
    <button onClick={sendDataToChatbot}>
      Send Data to Chatbot
    </button>
  );
};

export default SendToChatbot;
