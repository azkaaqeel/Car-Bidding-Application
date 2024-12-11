import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Buyer = () => {
    const [cars, setCars] = useState([]);
    const [isBuyer, setIsBuyer] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [bidCars, setBidCars] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMake, setFilterMake] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterByBid, setFilterByBid] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserRole = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userRole='))?.split('=')[1];

        if (storedUserRole === 'Buyer') {
            setIsBuyer(true);
            fetchCars();
            fetchWishlist();
            fetchBidCars();
            fetchNotifications();
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
            .find((row) => row.startsWith('userId='))?.split('=')[1];
        axios
            .get(`http://localhost:5000/api/wishlist/${userId}`)
            .then((response) => setWishlist(response.data.map((item) => item.car_id)))
            .catch((error) => console.error('Error fetching wishlist:', error));
    };

    const fetchBidCars = () => {
        const userId = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userId='))?.split('=')[1];

        if (!userId) {
            console.error('User ID is missing. Unable to fetch bid cars.');
            return;
        }

        axios
            .get(`http://localhost:5000/api/bids/${userId}/cars`)
            .then((response) => setBidCars(response.data))
            .catch((error) => console.error('Error fetching bid cars:', error));
    };

    const fetchNotifications = () => {
        const userId = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userId='))?.split('=')[1];

        if (!userId) {
            console.error('User ID is missing. Unable to fetch notifications.');
            return;
        }

        axios
            .get(`http://localhost:5000/api/notifications/${userId}`)
            .then((response) => setNotifications(response.data))
            .catch((error) => console.error('Error fetching notifications:', error));
    };

    const markNotificationAsRead = (notificationId) => {
        axios
            .put(`http://localhost:5000/api/notifications/${notificationId}/read`)
            .then(() => {
                setNotifications((prev) =>
                    prev.map((notification) =>
                        notification.notification_id === notificationId
                            ? { ...notification, status: 'read' }
                            : notification
                    )
                );
            })
            .catch((error) =>
                console.error('Error marking notification as read:', error)
            );
    };

    const addToWishlist = (car) => {
        const userId = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userId='))?.split('=')[1];

        if (!userId) {
            alert('You need to log in to add items to your wishlist.');
            return;
        }

        if (car.status !== 'active' && car.status !== 'inactive') {
            alert("You can only add cars with 'active' or 'inactive' status to your wishlist.");
            return;
        }

        axios
            .post('http://localhost:5000/api/wishlist', { buyer_id: userId, car_id: car.car_id })
            .then(() => {
                setWishlist((prevWishlist) => [...prevWishlist, car.car_id]);
                alert('Car added to wishlist!');
            })
            .catch((error) => console.error('Error adding car to wishlist:', error));
    };

    const filterAndSearchCars = () => {
        let filtered = cars.filter((car) => {
            const matchesSearch =
                car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.model.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesMake = filterMake ? car.make === filterMake : true;
            const matchesStatus = filterStatus ? car.status === filterStatus : true;
            return matchesSearch && matchesMake && matchesStatus;
        });

        if (filterByBid) {
            const bidCarIds = bidCars.map((bidCar) => bidCar.car_id);
            filtered = filtered.filter((car) => bidCarIds.includes(car.car_id));
        }

        return filtered;
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

    const filteredCars = filterAndSearchCars();

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Car Listings</h1>
                <div className="space-x-4 flex">
                    <input
                        type="text"
                        placeholder="Search by make or model..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">Filter by Status</option>
                        <option value="active">Active</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="closed">Closed</option>
                    </select>
                    <button
                        onClick={() => navigate('/wishlist')}
                        className="text-xl font-bold text-gray-800 flex items-center space-x-2"
                    >
                        <i className="fas fa-heart"></i>
                        <span>Wishlist ({wishlist.length})</span>
                    </button>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="text-xl font-bold flex items-center space-x-2 relative"
                    >
                        <i className="fas fa-bell"></i>
                        <span>Notifications</span>
                        {notifications.some((notif) => notif.status === 'unread') && (
                            <span className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-full">
                                {notifications.filter((notif) => notif.status === 'unread').length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => navigate('/inbox')}
                        className="text-xl font-bold text-gray-800 flex items-center space-x-2"
                    >
                        <i className="fas fa-envelope"></i>
                        <span>Inbox</span>
                    </button>
                    <button
                        onClick={() => setFilterByBid(!filterByBid)}
                        className={`text-xl font-bold px-4 py-2 rounded-lg ${
                            filterByBid ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                    >
                        {filterByBid ? 'Show All Cars' : 'Show Cars I Bid On'}
                    </button>
                </div>
            </div>

            {showNotifications && (
                <div className="absolute top-12 right-0 w-80 bg-white shadow-lg rounded-lg p-4 z-50">
                    <h2 className="text-lg font-bold mb-2">Notifications</h2>
                    <ul>
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <li
                                    key={notif.notification_id}
                                    className={`p-2 mb-2 rounded-lg ${
                                        notif.status === 'unread'
                                            ? 'bg-gray-200'
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    <p>{notif.message}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(notif.created_at).toLocaleString()}
                                    </p>
                                    {notif.status === 'unread' && (
                                        <button
                                            onClick={() =>
                                                markNotificationAsRead(notif.notification_id)
                                            }
                                            className="text-blue-600 text-sm mt-1"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-600">No notifications available.</p>
                        )}
                    </ul>
                </div>
            )}

            {filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCars.map((car) => (
                        <div
                            key={car.car_id}
                            className="relative bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition"
                        >
                            <Link to={`/car/${car.car_id}`} className="block">
                                <img
                                    src={car.image_path || 'default-car-image.jpg'}
                                    alt={`${car.make} ${car.model}`}
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
                                    <p className="text-sm mt-2 text-gray-500">
                                        Status: <span className="capitalize">{car.status}</span>
                                    </p>
                                </div>
                            </Link>
                            <button
                                onClick={() => addToWishlist(car)}
                                disabled={wishlist.includes(car.car_id)}
                                className={`absolute bottom-4 right-4 px-4 py-2 rounded-lg transition ${
                                    wishlist.includes(car.car_id)
                                        ? 'bg-gray-400 text-white'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {wishlist.includes(car.car_id) ? 'Added' : 'Add to Wishlist'}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-gray-600 text-lg">No cars available matching your filters.</p>
                </div>
            )}
        </div>
    );
};

export default Buyer;
