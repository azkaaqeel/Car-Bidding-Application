import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [isBuyer, setIsBuyer] = useState(false);
    const [expandedCarId, setExpandedCarId] = useState(null); // State to manage expanded car details
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user has the Buyer role
        const storedUserRole = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userRole='))?.split('=')[1];

        if (storedUserRole === 'Buyer') {
            setIsBuyer(true);
            fetchWishlist(); // Fetch wishlist when the buyer is authenticated
        } else {
            setIsBuyer(false);
        }
    }, []);

    const fetchWishlist = () => {
        const userId = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userId='))?.split('=')[1]; // Corrected: Retrieve userId from cookies
        axios
            .get(`http://localhost:5000/api/wishlist/${userId}`) // Fixed: Pass buyer_id in the URL
            .then((response) => setWishlist(response.data))
            .catch((error) => console.error('Error fetching wishlist:', error));
    };

    const removeFromWishlist = (carId) => {
        const userId = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userId='))?.split('=')[1]; // Corrected: Retrieve userId from cookies

        // Send a DELETE request to remove the car from the wishlist
        axios
            .delete(`http://localhost:5000/api/wishlist/${userId}/${carId}`) // Fixed: Pass buyer_id and car_id in the URL
            .then(() => {
                setWishlist((prevWishlist) => prevWishlist.filter((car) => car.car_id !== carId));
            })
            .catch((error) => console.error('Error removing car from wishlist:', error));
    };

    const toggleExpand = (carId) => {
        setExpandedCarId(expandedCarId === carId ? null : carId); // Toggle expand/collapse
    };

    if (!isBuyer) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Unauthorized Access
                    </h1>
                    <p className="text-gray-600 mt-2">
                        You must be logged in as a buyer to view this page.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">My Wishlist</h1>
            {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wishlist.map((car) => (
                        <div
                            key={car.car_id}
                            className="relative bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition"
                        >
                            <img
                                src={car.image_path || 'default-car-image.jpg'}
                                alt={car.make}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {car.make} {car.model}
                                </h2>
                                <p className="text-gray-600 mt-1">Year: {car.year}</p>
                                <p className="text-gray-600 mt-1">
                                    Mileage: {car.mileage.toLocaleString()} miles
                                </p>
                                <p className="text-gray-800 font-bold mt-2">
                                    ${car.price.toLocaleString()}
                                </p>
                            </div>

                            {/* Expand Button */}
                            <button
                                onClick={() => toggleExpand(car.car_id)}
                                className="absolute bottom-4 left-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                {expandedCarId === car.car_id ? 'Hide Details' : 'Show Details'}
                            </button>

                            {/* Expanded Details */}
                            {expandedCarId === car.car_id && (
                                <div className="p-4 bg-gray-100 mt-4">
                                    <p className="text-gray-600">Car Description: {car.description || 'No description available.'}</p>
                                    <p className="text-gray-600">Color: {car.color}</p>
                                </div>
                            )}

                            {/* Remove from Wishlist Button */}
                            <button
                                onClick={() => removeFromWishlist(car.car_id)}
                                className="absolute bottom-4 right-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Remove from Wishlist
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-gray-600 text-lg">Your wishlist is empty.</p>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
