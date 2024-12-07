import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Admin = () => {
    const [cars, setCars] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in as admin
        const storedUserRole = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userRole='))
            ?.split('=')[1];

        if (storedUserRole === 'Admin') {
            setIsAdmin(true);
            fetchCars();
        } else {
            setIsAdmin(false);
        }
    }, []);

    const fetchCars = () => {
        axios
            .get('http://localhost:5000/api/cars')
            .then((response) => setCars(response.data))
            .catch((error) => console.error('Error fetching cars:', error));
    };

    const handleDelete = (carId) => {
        axios
            .delete(`http://localhost:5000/api/cars/${carId}`)
            .then((response) => {
                console.log('Car deleted:', response.data);
                fetchCars(); // Refresh the car list after deletion
            })
            .catch((error) => {
                console.error('Error deleting car:', error);
            });
    };

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Unauthorized Access
                    </h1>
                    <p className="text-gray-600 mt-2">
                        You must be logged in as an admin to view this page.
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
                <navbar><Link>View Sellers</Link></navbar>



            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                Admin Dashboard
            </h1>
            {cars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cars.map((car) => (
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
                                <p className="text-gray-600 mt-1">
                                    Year: {car.year}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    Mileage: {car.mileage.toLocaleString()} miles
                                </p>
                                <p className="text-gray-800 font-bold mt-2">
                                    ${car.price.toLocaleString()}
                                </p>
                                <button
                                    onClick={() => handleDelete(car.car_id)}
                                    className="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full text-sm font-medium transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-gray-600 text-lg">No cars available.</p>
                </div>
            )}
        </div>
    );
};

export default Admin;
