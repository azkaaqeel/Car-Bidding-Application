import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Seller = () => {
    const [message, setMessage] = useState('');

    const addCar = async (e) => {
        e.preventDefault();

        const carData = {
            make: document.getElementById('make').value,
            model: document.getElementById('model').value,
            year: parseInt(document.getElementById('year').value),
            mileage: parseInt(document.getElementById('mileage').value),
            color: document.getElementById('color').value,
            price: parseInt(document.getElementById('price').value),
            description: document.getElementById('description').value,
            seller_id: 1, // Replace with actual seller_id if available
            image_path: document.getElementById('image_path').value,
        };

        try {
            const response = await fetch('http://localhost:5000/api/cars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(carData),
            });

            if (response.ok) {
                alert('Car added successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    return (
        <>
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto">
                    <Link
                        to="/SellerDash"
                        className="text-white text-lg font-semibold hover:underline"
                    >
                        View All Listings
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    Add a New Car
                </h1>

                <form
                    onSubmit={addCar}
                    className="bg-white shadow-lg rounded-lg p-8 max-w-xl mx-auto"
                >
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Picture:</label>
                        <input
                            type="file"
                            id="image_path"
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Make:</label>
                        <input
                            type="text"
                            id="make"
                            name="make"
                            maxLength="50"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Model:</label>
                        <input
                            type="text"
                            id="model"
                            name="model"
                            maxLength="50"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Year:</label>
                            <input
                                type="number"
                                id="year"
                                name="year"
                                min="1900"
                                max="2099"
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Mileage (in km):
                            </label>
                            <input
                                type="number"
                                id="mileage"
                                name="mileage"
                                min="0"
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Color:</label>
                        <input
                            type="text"
                            id="color"
                            name="color"
                            maxLength="30"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Price ($):</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            min="0"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Description:
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            maxLength="500"
                            placeholder="Enter a detailed description of the car..."
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        Add Car
                    </button>
                </form>

                {message && (
                    <p className="text-center text-red-500 font-medium mt-4">{message}</p>
                )}
            </div>
        </>
    );
};

export default Seller;
