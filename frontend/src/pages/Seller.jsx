import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Seller = () => {
    const [message, setMessage] = useState('');
    const [isSeller, setIsSeller] = useState(false);
    const [categoryManual, setCategoryManual] = useState(false);
    const [makeManual, setMakeManual] = useState(false);
    const [inboxMessages, setInboxMessages] = useState([]); // State for inbox messages
    const [isInboxOpen, setIsInboxOpen] = useState(false); // To control inbox dropdown visibility
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user has the Seller role
        const storedUserRole = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userRole='))?.split('=')[1];

        if (storedUserRole === 'Seller') {
            setIsSeller(true);
        } else {
            setIsSeller(false);
        }

        // Fetch seller's inbox messages
        if (isSeller) {
            fetchInboxMessages();
        }
    }, [isSeller]);

    // Function to fetch inbox messages
    const fetchInboxMessages = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/messages'); // Adjust the URL for your actual API
            const data = await response.json();
            setInboxMessages(data); // Assuming the response is an array of messages
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    const toggleInbox = () => {
        setIsInboxOpen(!isInboxOpen); // Toggle inbox dropdown visibility
    };

    if (isSeller) {
        const addCar = async (e) => {
            e.preventDefault();

            const carData = {
                make: makeManual ? document.getElementById('make').value : document.getElementById('makeSelect').value,
                category_name: categoryManual ? document.getElementById('category').value : document.getElementById('categorySelect').value,
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
                    <div className="container mx-auto flex justify-between items-center">
                        <Link
                            to="/SellerDash"
                            className="text-white text-lg font-semibold hover:underline"
                        >
                            View All Listings
                        </Link>

                        {/* Inbox Icon */}
                        <div className="relative">
                            <button
                                onClick={toggleInbox}
                                className="text-white p-2 rounded-full hover:bg-gray-700"
                                aria-label="Inbox"
                            >
                                📨
                            </button>

                            {/* Inbox Dropdown */}
                            {isInboxOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 shadow-lg rounded-lg p-4 z-10">
                                    <h3 className="font-semibold text-lg">Inbox</h3>
                                    <div className="space-y-2">
                                        {inboxMessages.length > 0 ? (
                                            inboxMessages.map((message, index) => (
                                                <div
                                                    key={index}
                                                    className="p-2 border-b border-gray-300 last:border-none"
                                                >
                                                    <p>
                                                        <strong>From: </strong>
                                                        {message.sender}
                                                    </p>
                                                    <p>
                                                        <strong>Message: </strong>
                                                        {message.content}
                                                    </p>
                                                    <button className="text-blue-600">
                                                        View Details
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No new messages.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                <div className="container mx-auto p-8">
                    <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                        Add a New Car
                    </h1>

                    {/* Add Car Form */}
                    <form
                        onSubmit={addCar}
                        className="bg-white shadow-lg rounded-lg p-8 max-w-xl mx-auto"
                    >
                        {/* Picture */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Picture:</label>
                            <input
                                type="file"
                                id="image_path"
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                            />
                        </div>

                        {/* Make (Dropdown + Manual Entry) */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Make:</label>
                            <div className="flex items-center space-x-4">
                                <select
                                    id="makeSelect"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                    onChange={(e) => setMakeManual(e.target.value === 'Other')}
                                >
                                    <option value="">Select Make</option>
                                    <option value="Toyota">Toyota</option>
                                    <option value="Honda">Honda</option>
                                    <option value="Ford">Ford</option>
                                    <option value="BMW">BMW</option>
                                    <option value="Other">Other</option>
                                </select>

                                {makeManual && (
                                    <input
                                        type="text"
                                        id="make"
                                        name="make"
                                        maxLength="50"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                        placeholder="Enter custom make"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Category (Dropdown + Manual Entry) */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Category:</label>
                            <div className="flex items-center space-x-4">
                                <select
                                    id="categorySelect"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                    onChange={(e) => setCategoryManual(e.target.value === 'Other')}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Truck">Truck</option>
                                    <option value="Coupe">Coupe</option>
                                    <option value="Convertible">Convertible</option>
                                    <option value="Other">Other</option>
                                </select>

                                {categoryManual && (
                                    <input
                                        type="text"
                                        id="category"
                                        name="category"
                                        maxLength="50"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                        placeholder="Enter custom category"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Model */}
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

                        {/* Year and Mileage */}
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
                                <label className="block text-gray-700 font-medium mb-2">Mileage:</label>
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

                        {/* Color and Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Color:</label>
                                <input
                                    type="text"
                                    id="color"
                                    name="color"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Price (PKR):</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    min="0"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                        </div>


                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">start date:</label>
                            <input
                                type="date"
                                id="start"
                                name="start"
                                min="new date()"
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">End Date (in days):</label>
                            <input
                                type="date"
                                id="end"
                                name="end"
                                min="0"
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <input type="" />

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                rows="4"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                placeholder="Enter car description"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            Add Car
                        </button>
                    </form>
                </div>
            </>
        );
    }

    return (
        <div>
            <h1>You must be logged in as a seller to access this page.</h1>
        </div>
    );
};

export default Seller;
