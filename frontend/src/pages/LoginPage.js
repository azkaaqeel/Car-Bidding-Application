
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { Navigate, useNavigate } from 'react-router-dom'; // for navigation after login
import "../styles/LoginPage.css"


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [userid, setuserid] = useState('');
  const [error, setError] = useState('');
  const history = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
        role,
      });
  

  
      if (response.data.success) {
        // Store user ID and role in cookies
        const userId = response.data.user.userId; // Assuming `id` is in response
        const userRole = response.data.user.role;
        // console.log(userId);
  
        // Set cookies
        document.cookie = `userId=${encodeURIComponent(userId)}; path=/; max-age=3600; Secure; SameSite=Strict`;
        document.cookie = `userRole=${encodeURIComponent(userRole)}; path=/; max-age=3600; Secure; SameSite=Strict`;
        // console.log(document.cookie)
  
        // Redirect based on role
        if (userRole === 'Admin') {
          history('/Admin');
        } else if (userRole === 'Buyer') {
          history('/Buyer');
        } else if (userRole === 'Seller') {
          history('/seller-dashboard');
        }
      } else {
        setError(response.data.message || 'Invalid credentials or role');
      }
    } catch (err) {
      setError('Error during login. Please try again.');
      console.error(err);
    }
  };
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Buyer">Buyer</option>
            <option value="Seller">Seller</option>
          </select>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
