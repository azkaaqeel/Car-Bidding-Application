import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [cars, setCars] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [bids, setBids] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
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
      fetchUsers();
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

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/users/sellers').then((response) => setSellers(response.data));
    axios.get('http://localhost:5000/api/users/buyer').then((response) => setBuyers(response.data));
    axios.get('http://localhost:5000/api/bids').then((response) => setBids(response.data));
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

  const handleSellerSelection = (sellerId) => {
    setSelectedSeller(sellerId);
  };

  const handleBuyerSelection = (buyerId) => {
    setSelectedBuyer(buyerId);
  };

  const filteredCars = selectedSeller
    ? cars.filter(car => car.seller_id === selectedSeller)
    : [];

  const filteredBids = selectedBuyer
    ? bids.filter(bid => bid.buyer_id === selectedBuyer)
    : [];

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Unauthorized Access</h1>
          <p className="text-gray-600 mt-2">You must be logged in as an admin to view this page.</p>
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
    <div className="flex h-auto bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-yellow-300 p-6 space-y-8 h-auto">
        <h2 className="text-2xl font-semibold">Admin Panel</h2>
        <ul className="space-y-6 text-lg">
          <li><a href="#dashboard" className="block py-2 hover:bg-blue-600 rounded">Dashboard</a></li>
          <li><a href="#cars" className="block py-2 hover:bg-blue-600 rounded">Cars</a></li>
          <li><a href="#users" className="block py-2 hover:bg-blue-600 rounded">Users</a></li>
          <li><a href="#bids" className="block py-2 hover:bg-blue-600 rounded">Bids</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <img src="/profile.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
            <span className="text-lg font-semibold">Admin</span>
          </div>
        </div>

        {/* View All Listings */}
        <div id="cars" className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">All Car Listings</h3>

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
                    <h2 className="text-lg font-semibold text-gray-800">{car.make} {car.model}</h2>
                    <p className="text-gray-600 mt-1">Year: {car.year}</p>
                    <p className="text-gray-600 mt-1">Mileage: {car.mileage.toLocaleString()} miles</p>
                    <p className="text-gray-800 font-bold mt-2">${car.price.toLocaleString()}</p>
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

        {/* Select Seller to View Listings */}
        <div id="users" className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Select Seller</h3>
          <select
            className="w-full p-3 rounded-md border"
            onChange={(e) => handleSellerSelection(parseInt(e.target.value))}
            value={selectedSeller || ''}
          >
            <option value="">-- Select Seller --</option>
            {sellers.map((seller) => (
              <option key={seller.user_id} value={seller.user_id}>
                {seller.first_name} {seller.last_name}
              </option>
            ))}
          </select>

          {/* Seller Listings */}
          {selectedSeller && (
            <div className="mt-6">
              <h4 className="text-xl font-semibold">Listings by {sellers.find(seller => seller.user_id === selectedSeller)?.first_name}</h4>
              <table className="w-full table-auto mt-4">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3">Make</th>
                    <th className="p-3">Model</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((car) => (
                    <tr key={car.car_id} className="hover:bg-gray-100">
                      <td className="p-3">{car.make}</td>
                      <td className="p-3">{car.model}</td>
                      <td className="p-3">{car.year}</td>
                      <td className="p-3">${car.price}</td>
                      <td className="p-3">{car.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Select Buyer to View Bids */}
        <div id="buyers" className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Select Buyer</h3>
          <select
            className="w-full p-3 rounded-md border"
            onChange={(e) => handleBuyerSelection(parseInt(e.target.value))}
            value={selectedBuyer || ''}
          >
            <option value="">-- Select Buyer --</option>
            {buyers.map((buyer) => (
              <option key={buyer.user_id} value={buyer.user_id}>
                {buyer.first_name} {buyer.last_name}
              </option>
            ))}
          </select>

          {/* Buyer Bids */}
          {selectedBuyer && (
            <div className="mt-6" id="bids" >
              <h4 className="text-xl font-semibold">Bids by {buyers.find(buyer => buyer.user_id === selectedBuyer)?.first_name}</h4>
              <table className="w-full table-auto mt-4">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3">Car</th>
                    <th className="p-3">Bid Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBids.map((bid) => (
                    <tr key={bid.bid_id} className="hover:bg-gray-100">
                      <td className="p-3">{cars.find(car => car.car_id === bid.car_id)?.make} {cars.find(car => car.car_id === bid.car_id)?.model}</td>
                      <td className="p-3">${bid.bid_amount}</td>
                      <td className="p-3">{bid.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
