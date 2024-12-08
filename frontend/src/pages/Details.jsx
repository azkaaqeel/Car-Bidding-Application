import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Details = () => {
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [car, setCar] = useState(null);
    const [bids, setBids] = useState([]);
    const [message, setMessage] = useState(""); 
    const [loading, setLoading] = useState(true);

    const { car_id } = useParams();

    const getCookie = (name) => {
        const cookies = document.cookie.split("; ");
        const cookie = cookies.find((c) => c.startsWith(`${name}=`));
        return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
    };

    useEffect(() => {
        const storedUserId = getCookie("userId");
        const storedUserRole = getCookie("userRole");

        if (storedUserId && storedUserRole) {
            setUserId(storedUserId);
            setUserRole(storedUserRole);
        }

        console.log("User ID:", storedUserId);
        console.log("User Role:", storedUserRole);
    }, []);

    const placeBid = async () => {
        const bidAmount = document.getElementById("bid").value;

        try {
            await axios.post("http://localhost:5000/api/bids", {
                buyer_id: userId,
                bid_amount: bidAmount,
                car_id,
            });
            fetchBids(); // Refresh bids after placing a new one
        } catch (error) {
            console.error("Error placing bid:", error);
        }
    };

    const fetchBids = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/cars/${car_id}/bids`
            );
            setBids(response.data); // Update bids state
        } catch (error) {
            console.error("Error fetching bids:", error);
        }
    };

    const sendMessage = async () => {
        if (!message.trim()) {
            alert("Please write a message before sending.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/messages", {
                user_id: userId,
                seller_id: car.seller_id,
                car_id,
                message,
            });
            setMessage(""); // Clear the message input after sending
            alert("Message sent to the seller.");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/cars/${car_id}`
                );
                setCar(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching car details:", error);
                setLoading(false);
            }
        };

        fetchCarDetails();
        fetchBids();
    }, [car_id]);

    if (loading) {
        return <p className="text-center mt-4">Loading car details...</p>;
    }

    if (!car) {
        return <p className="text-center mt-4">Car details could not be loaded.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {car.make} {car.model} Details
            </h1>
            <div className="flex flex-col lg:flex-row bg-white shadow-md rounded-lg p-6 w-full max-w-5xl">
                {/* Car Details */}
                <div className="flex-1">
                    <img
                        src={car.image_path || "default-car-image.jpg"}
                        alt={car.make}
                        className="rounded-lg mb-4 w-full h-64 object-cover"
                    />
                    <h2 className="text-lg font-semibold text-gray-700">
                        {car.year} | {car.mileage} miles
                    </h2>
                    <p className="text-gray-600">
                        <strong>Price:</strong> ${car.price}
                    </p>
                    <p className="text-gray-600">
                        <strong>Description:</strong> {car.description}
                    </p>
                    <p className="text-gray-600">
                        <strong>Seller ID:</strong> {car.seller_id}
                    </p>
                </div>
            </div>

            {/* Place Bid */}
            <div className="mt-4 bg-white shadow-md rounded-lg p-6 w-full max-w-5xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Place a Bid
                </h2>
                <input
                    type="number"
                    id="bid"
                    placeholder="Enter your bid amount"
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                    onClick={placeBid}
                    className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
                >
                    Place Bid
                </button>
            </div>

            {/* Message Seller Section */}
            <div>
                {userRole === "Buyer" && userId ? (
                    <div className="mt-8 bg-white shadow-md rounded-lg p-6 w-full max-w-5xl">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Message Seller
                        </h2>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="4"
                            placeholder="Write your message to the seller..."
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <button
                            onClick={sendMessage}
                            className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition mt-4"
                        >
                            Send Message
                        </button>
                    </div>
                ) : (
                    <p className="mt-8 text-gray-500">You must be a buyer to send a message.</p>
                )}
            </div>

            {/* Bid History Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Bid History</h2>
                {bids.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="text-left px-4 py-2 border-b">#</th>
                                    <th className="text-left px-4 py-2 border-b">Bid Amount ($)</th>
                                    <th className="text-left px-4 py-2 border-b">Buyer ID</th>
                                    <th className="text-left px-4 py-2 border-b">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bids.map((bid, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b">{index + 1}</td>
                                        <td className="px-4 py-2 border-b">${bid.bid_amount}</td>
                                        <td className="px-4 py-2 border-b">{bid.buyer_id}</td>
                                        <td className="px-4 py-2 border-b capitalize">{bid.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No bids yet.</p>
                )}
            </div>
        </div>
    );
};

export default Details;
