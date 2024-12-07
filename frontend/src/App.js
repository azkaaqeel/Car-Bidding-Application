import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Admin from './pages/Admin';
import Buyer from './pages/Buyer';
import Seller from './pages/Seller';
import SellerDash from './pages/SellerDash';
import Details from './pages/Details';
import Wishlist from './pages/Wishlist'; // Import the Wishlist component

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Set the HomePage as the default route */}
                <Route path="/" element={<HomePage />} />
                <Route path="/Login" element={<LoginPage />} />
                
                {/* After login, this will show the Admin page */}
                <Route path="/Admin" element={<Admin />} />
                <Route path="/Buyer" element={<Buyer />} />
                <Route path="/car/:car_id" element={<Details />} />
                <Route path="/Seller" element={<Seller />} />
                <Route path="/SellerDash" element={<SellerDash />} />

                {/* Add Wishlist route */}
                <Route path="/wishlist" element={<Wishlist />} /> {/* New route for Wishlist */}
            </Routes>
        </Router>
    );
};

export default App;
