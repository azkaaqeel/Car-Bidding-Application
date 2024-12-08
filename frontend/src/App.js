import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Admin from './pages/Admin';
import Buyer from './pages/Buyer';
import Seller from './pages/Seller';
import SellerDash from './pages/SellerDash';
import Details from './pages/Details';
<<<<<<< Updated upstream
import Wishlist from './pages/Wishlist'; // Import the Wishlist component
import About from './pages/About';
=======
import Wishlist from './pages/Wishlist';
import Inbox from './pages/Inbox'; // Import the Inbox component
>>>>>>> Stashed changes

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
                <Route path="/About" element={<About />} />


                {/* Add Wishlist route */}
                <Route path="/wishlist" element={<Wishlist />} /> {/* New route for Wishlist */}
                
                <Route path="/inbox" element={<Inbox />} /> {/* Add the Inbox route */}
            </Routes>
        </Router>
    );
};

export default App;
