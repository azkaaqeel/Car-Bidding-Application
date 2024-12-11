import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Admin from './pages/Admin';
import Buyer from './pages/Buyer';
import Seller from './pages/Seller';
import SellerDash from './pages/SellerDash';
import Details from './pages/Details';
import Wishlist from './pages/Wishlist';
import Inbox from './pages/Inbox'; // Import the Inbox component
import Chat from './pages/Chat';  // Add this import for the Chat component
import SignUp from './pages/signup'; // Import the SignUp component
import CarDetails from './pages/CarDetails'; // Import the SignUp component

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/Login" element={<LoginPage />} />
                <Route path="/Admin" element={<Admin />} />
                <Route path="/Buyer" element={<Buyer />} />
                <Route path="/car/:car_id" element={<Details />} />
                <Route path="/Seller" element={<Seller />} />
                <Route path="/SellerDash" element={<SellerDash />} />
                
                {/* Add Wishlist route */}
                <Route path="/wishlist" element={<Wishlist />} />
                
                {/* Add Inbox route */}
                <Route path="/inbox" element={<Inbox />} />
                
                {/* Add Chat route */}
                <Route path="/chat/:seller_id/:car_id" element={<Chat />} />
                  
                {/* Add the route for the new CarDetails component */}
                <Route path="/SellerDash/car/:car_id" element={<CarDetails />} />
                
                {/* Add Sign-Up route */}
                <Route path="/signup" element={<SignUp />} /> {/* New route for Sign-Up */}
            </Routes>
        </Router>
    );
};

export default App;
