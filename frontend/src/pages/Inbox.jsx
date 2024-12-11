import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Inbox = () => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = () => {
      const userId = document.cookie
        .split('; ')
        .find((row) => row.startsWith('userId='))?.split('=')[1]; // Get userId from cookies

      axios
        .get(`http://localhost:5000/api/chats/${userId}`)
        .then((response) => setChats(response.data))
        .catch((error) => console.error('Error fetching chats:', error));
    };

    fetchChats();
  }, []);

  const handleChatClick = (sellerId, carId) => {
    navigate(`/chat/${sellerId}/${carId}`); // Navigate to the conversation with the seller and car
  };

  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Inbox</h1>
      {chats.length > 0 ? (
        <div className="space-y-4">
          {chats.map((chat) => (
            <div
              key={`${chat.seller_id}-${chat.car_id}`} // Unique key based on seller_id and car_id
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
              onClick={() => handleChatClick(chat.seller_id, chat.car_id)}
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {chat.seller_first_name} {chat.seller_last_name}
              </h2>
              <p className="text-gray-600">Car: {chat.car_model}</p> {/* Display car model */}
            </div>
          ))}
        </div>
      ) : (
        <p>No chats found.</p>
      )}
    </div>
  );
};

export default Inbox;
