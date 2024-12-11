import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const { seller_id, car_id } = useParams(); // Get seller_id and car_id from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch messages when the component mounts or seller_id/car_id changes
  useEffect(() => {
    const fetchMessages = () => {
      const userId = document.cookie
        .split('; ')
        .find((row) => row.startsWith('userId='))?.split('=')[1]; // Get userId from cookies

      if (!userId) {
        console.error('Error: User ID is missing in cookies.');
        return;
      }

      axios
        .get(`http://localhost:5000/api/messages/${userId}/${seller_id}/${car_id}`) // Pass car_id in the request
        .then((response) => setMessages(response.data))
        .catch((error) => console.error('Error fetching messages:', error));
    };

    fetchMessages();
  }, [seller_id, car_id]);

  // Handle sending a new message
  const handleSendMessage = () => {
    const userId = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userId='))?.split('=')[1]; // Get userId from cookies

    if (!userId) {
      console.error('Error: User ID is missing in cookies.');
      return;
    }

    if (newMessage.trim() === '') return; // Prevent sending empty messages

    const messageData = {
      user_id: userId, // Adjusted to match API's required parameter
      seller_id: seller_id, // Required by the API
      car_id: car_id, // Pass the car_id to the API
      message: newMessage, // Adjusted to match API's required parameter
    };

    // Send the message to the backend
    axios
      .post('http://localhost:5000/api/messages', messageData)
      .then((response) => {
        // Assuming the response contains the full message object, including sender's info
        const message = response.data;
        setMessages((prevMessages) => [...prevMessages, message]); // Add new message to state
        setNewMessage(''); // Clear the input field
      })
      .catch((error) =>
        console.error('Error sending message:', error.response?.data || error.message)
      );
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Chat with Seller</h1>
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.message_id} className="bg-white p-4 rounded-lg shadow-md">
            <p>
              <strong>
                {message.sender_first_name} {message.sender_last_name}:
              </strong>
              <span className="text-gray-600" style={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </span>
            </p>
            <p className="text-sm text-gray-400">
              {new Date(message.sent_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-100 border-t">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
