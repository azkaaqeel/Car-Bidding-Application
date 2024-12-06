import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SellerDash = () => {
    const [cars, setCars] = useState([]);
    const [sellerId, setSellerId] = useState(null); // Replace with actual sellerId retrieval logic

    useEffect(() => {
        // Retrieve sellerId from cookies, local storage, or authentication
        const storedSellerId = document.cookie
            .split('; ')
            .find((row) => row.startsWith('sellerId='))
            ?.split('=')[1];
        setSellerId(storedSellerId);

        if (storedSellerId) {
            fetchCarsBySeller(storedSellerId);
        }
    }, []);

    const fetchCarsBySeller = (sellerId) => {
        axios
            .get(`http://localhost:5000/api/cars/seller/${sellerId}`)
            .then((response) => setCars(response.data))
            .catch((error) => console.error('Error fetching seller cars:', error));
    };

    if (!sellerId) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-2xl font-semibold text-gray-700">
                    Please log in as a seller to view your dashboard.
                </h2>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Your Car Listings
            </h1>

            {cars.length === 0 ? (
                <p className="text-center text-gray-600 text-lg">
                    No cars listed yet.{" "}
                    <Link
                        to="/add-car"
                        className="text-blue-500 hover:underline font-medium"
                    >
                        Add a new car
                    </Link>
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <Link
                            to={`/car/${car.car_id}`}
                            key={car.car_id}
                            className="block border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                        >
                            <img
                                src={car.image_path || 'default-car-image.jpg'}
                                alt={car.make}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {car.make} {car.model}
                                </h3>
                                <p className="text-gray-600">
                                    {car.year} | {car.mileage.toLocaleString()} miles
                                </p>
                                <p className="text-gray-700 font-semibold mt-2">
                                    ${car.price.toLocaleString()}
                                </p>
                                <p className="text-gray-500 mt-1 text-sm">
                                    {car.description.substring(0, 50)}...
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerDash;
