import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Admin from './pages/Admin';
import Buyer from './pages/Buyer';
import CarDetail from './pages/CarDetail';


const App = () => {
    return (
        <Router>
            <Routes>
                {/* Set the LoginPage as the default route */}
                <Route path="/" element={<LoginPage />} />
                
                {/* After login, this will show the HomePage */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/Admin" element={<Admin />} />
                <Route path="/Buyer" element={<Buyer />} />
                <Route path="/car/:car_id" element={<CarDetail />} />


            </Routes>
        </Router>
    );
};

export default App;
