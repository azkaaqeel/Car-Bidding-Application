import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Set the LoginPage as the default route */}
                <Route path="/" element={<LoginPage />} />
                
                {/* After login, this will show the HomePage */}
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </Router>
    );
};

export default App;
