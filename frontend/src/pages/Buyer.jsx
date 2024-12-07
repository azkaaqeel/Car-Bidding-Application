import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Buyer = () => {
    const [cars, setCars] = useState([]);
    const [isBuyer, setIsBuyer] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user has the Buyer role
        const storedUserRole = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userRole='))?.split('=')[1];

        if (storedUserRole === 'Buyer') {
            setIsBuyer(true);
            fetchCars();
            fetchWishlist(); // Fetch wishlist when the buyer is authenticated
        } else {
            setIsBuyer(false);
        }
    }, []);

    const fetchCars = () => {
        axios
            .get('http://localhost:5000/api/cars')
            .then((response) => setCars(response.data))
            .catch((error) => console.error('Error fetching cars:', error));
    };

    const fetchWishlist = () => {
        const userId = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userId='))?.split('=')[1]; // Corrected: Retrieve userId from cookies
        axios
            .get(`http://localhost:5000/api/wishlist?buyer_id=${userId}`)
            .then((response) => setWishlist(response.data))
            .catch((error) => console.error('Error fetching wishlist:', error));
    };

    const addToWishlist = (carId) => {
        const userId = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userId='))?.split('=')[1]; // Corrected: Retrieve userId from cookies

        // Send both user_id and car_id in the request body
        axios
            .post('http://localhost:5000/api/wishlist', {
                buyer_id: userId, // Ensure consistency with the cookie name
                car_id: carId
            })
            .then((response) => {
                setWishlist((prevWishlist) => [...prevWishlist, response.data]); // Update the wishlist state
            })
            .catch((error) => console.error('Error adding car to wishlist:', error));
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Car Listings</h1>
                {/* Wishlist Icon */}
                <button
                    onClick={() => navigate('/wishlist')}
                    className="text-xl font-bold text-gray-800 flex items-center space-x-2"
                >
                    <i className="fas fa-cart-plus"></i>
                    <span>({wishlist.length})</span>
                </button>
            </div>
            {cars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cars.map((car) => (
                        <div
                            key={car.car_id}
                            className="relative bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition"
                        >
                            {/* Wrap the entire car card with Link */}
                            <Link to={`/car/${car.car_id}`} className="block">
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
                            </Link>
                            {/* Add to Wishlist Button */}
                            <button
                                onClick={() => addToWishlist(car.car_id)}
                                className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Add to Wishlist
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-gray-600 text-lg">No cars available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default Buyer;
