import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SellerListings = () => {
    const [cars, setCars] = useState([]);
    const [isSeller, setIsSeller] = useState(false);
    const [SellerID, setSellerID] = useState();

    useEffect(() => {
        // Check if the user has the Seller role
        const storedUserRole = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userRole='))
            ?.split('=')[1];

        const storeID = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userId='))
            ?.split('=')[1];

        if (storedUserRole === 'Seller') {
            setIsSeller(true);
            setSellerID(storeID);
            fetchCarsBySeller(storeID); // Fetch cars for the seller
        } else {
            setIsSeller(false);
        }
    }, []);

    const fetchCarsBySeller = (sellerId) => {
        axios
            .get(`http://localhost:5000/api/cars/seller/${sellerId}`)
            .then((response) => setCars(response.data))
            .catch((error) => console.error('Error fetching seller cars:', error));
    };

    const deleteCar = (carId) => {
        axios
            .delete(`http://localhost:5000/api/cars/${carId}`)
            .then(() => {
                alert('Car deleted successfully!');
                setCars(cars.filter((car) => car.car_id !== carId)); // Refresh the list
            })
            .catch((error) => console.error('Error deleting car:', error));
    };

    if (!isSeller) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-2xl font-semibold text-gray-700">
                    Please log in as a seller to view your listings.
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
                        to="/Seller"
                        className="text-blue-500 hover:underline font-medium"
                    >
                        Add a new car
                    </Link>
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <div
                            key={car.car_id}
                            className="block border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                        >
                            {/* Modify the Link to use the correct route for CarDetails */}
                            <Link to={`/SellerDash/car/${car.car_id}`}>
                                <div>
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
                                </div>
                            </Link>
                            <button
                                onClick={() => deleteCar(car.car_id)}
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerListings;
