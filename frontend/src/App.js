import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Admin from './pages/Admin';
import Buyer from './pages/Buyer';
// import CarDetails from './pages/CarDetails';
import Seller from './pages/Seller';
import SellerDash from './pages/SellerDash';
import Details from './pages/Details';


const App = () => {
    return (
        <Router>
            <Routes>
                {/* Set the LoginPage as the default route */}
                <Route path="/" element={<HomePage />} />
                <Route path="/Login" element={<LoginPage />} />
                
                {/* After login, this will show the HomePage */}
                <Route path="/Admin" element={<Admin />} />
                <Route path="/Buyer" element={<Buyer />} />
                <Route path="/car/:car_id" element={<Details />} />
                <Route path="/Seller" element={<Seller />} />
                <Route path="/SellerDash" element={<SellerDash />} />




            </Routes>
        </Router>
    );
};

export default App;
