import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [cars, setCars] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [bids, setBids] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserRole = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userRole='))
      ?.split('=')[1];

    if (storedUserRole === 'Admin') {
      setIsAdmin(true);
      fetchData();
    } else {
      setIsAdmin(false);
    }
  }, []);

  const fetchData = () => {
    fetchCars();
    fetchUsers();
    fetchCategories();
  };

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

  const fetchCategories = () => {
    axios
      .get('http://localhost:5000/api/categories')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));
  };

  const deleteCar = (carId) => {
    axios
      .delete(`http://localhost:5000/api/cars/${carId}`)
      .then(() => {
        alert('Car deleted successfully!');
        fetchCars();
      })
      .catch((error) => console.error('Error deleting car:', error));
  };

  const deleteUser = (userId, role) => {
    const endpoint = role === 'Seller' ? '/api/users/sellers' : '/api/users/buyer';
    axios
      .delete(`http://localhost:5000${endpoint}/${userId}`)
      .then(() => {
        alert(`${role} deleted successfully!`);
        fetchUsers();
      })
      .catch((error) => console.error('Error deleting user:', error));
  };

  const deleteBid = (bidId) => {
    axios
      .delete(`http://localhost:5000/api/bids/${bidId}`)
      .then(() => {
        alert('Bid deleted successfully!');
        fetchUsers();
      })
      .catch((error) => console.error('Error deleting bid:', error));
  };

  const deleteCategory = (categoryId) => {
    axios
      .delete(`http://localhost:5000/api/categories/${categoryId}`)
      .then(() => {
        alert('Category deleted successfully!');
        fetchCategories();
      })
      .catch((error) => console.error('Error deleting category:', error));
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
      <div className="w-64 bg-gray-800 text-yellow-300 p-6 space-y-8 h-auto">
        <h2 className="text-2xl font-semibold">Admin Panel</h2>
        <ul className="space-y-6 text-lg">
          <li><a href="#dashboard" className="block py-2 hover:bg-blue-600 rounded">Dashboard</a></li>
          <li><a href="#cars" className="block py-2 hover:bg-blue-600 rounded">Cars</a></li>
          <li><a href="#users" className="block py-2 hover:bg-blue-600 rounded">Users</a></li>
          <li><a href="#bids" className="block py-2 hover:bg-blue-600 rounded">Bids</a></li>
          <li><a href="#categories" className="block py-2 hover:bg-blue-600 rounded">Categories</a></li>
        </ul>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <div id="cars" className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">All Car Listings</h3>
          {cars.map((car) => (
            <div key={car.car_id} className="flex justify-between items-center p-4 border-b">
              <div>
                <p>{car.make} {car.model}</p>
                <p>Price: ${car.price}</p>
              </div>
              <button onClick={() => deleteCar(car.car_id)} className="text-red-600">Delete</button>
            </div>
          ))}
        </div>

        <div id="users" className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">All Sellers</h3>
          {sellers.map((seller) => (
            <div key={seller.user_id} className="flex justify-between items-center p-4 border-b">
              <div>
                <p>{seller.first_name} {seller.last_name}</p>
                <p>Email: {seller.email}</p>
              </div>
              <button onClick={() => deleteUser(seller.user_id, 'Seller')} className="text-red-600">Delete</button>
            </div>
          ))}

          <h3 className="text-2xl font-semibold mt-6 mb-4">All Buyers</h3>
          {buyers.map((buyer) => (
            <div key={buyer.user_id} className="flex justify-between items-center p-4 border-b">
              <div>
                <p>{buyer.first_name} {buyer.last_name}</p>
                <p>Email: {buyer.email}</p>
              </div>
              <button onClick={() => deleteUser(buyer.user_id, 'Buyer')} className="text-red-600">Delete</button>
            </div>
          ))}
        </div>

        <div id="bids" className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">All Bids</h3>
          {bids.map((bid) => (
            <div key={bid.bid_id} className="flex justify-between items-center p-4 border-b">
              <div>
                <p>Bid Amount: ${bid.bid_amount}</p>
                <p>Status: {bid.status}</p>
              </div>
              <button onClick={() => deleteBid(bid.bid_id)} className="text-red-600">Delete</button>
            </div>
          ))}
        </div>

        <div id="categories" className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">All Categories</h3>
          {categories.map((category) => (
            <div key={category.category_id} className="flex justify-between items-center p-4 border-b">
              <div>
                <p>{category.category_name}</p>
              </div>
              <button onClick={() => deleteCategory(category.category_id)} className="text-red-600">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
