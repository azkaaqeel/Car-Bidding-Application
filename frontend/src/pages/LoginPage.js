import '../styles/LoginPage.css';
import React, { useState } from 'react';
import axios from 'axios';
// import { Navigate, useNavigate } from 'react-router-dom'; // for navigation after login

// const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
//   const [error, setError] = useState('');
//   const history = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
    
//     try {
//       const response = await axios.post('http://localhost:3000/api/login', {
//         username,
//         password,
//         role,
//       });

//       if (response.data.success) {
//         // Redirect user to different page based on role
//         if (role === 'admin') {
//           Navigate("/Admin")
//           history.push('/Admin');
//         } else if (role === 'buyer') {
//           history.push('/Buyer');
//         } else if (role === 'seller') {
//           history.push('/seller-dashboard');
//         }
//       } else {
//         setError('Invalid credentials or role');
//       }
//     } catch (err) {
//       setError('Error during login. Please try again.');
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <div>
//           <label>Username:</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
            
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
            
//           />
//         </div>
//         <div>
//           <label>Role:</label>
//           <select value={role} onChange={(e) => setRole(e.target.value)} required>
//             <option value="">Select Role</option>
//             <option value="admin">Admin</option>
//             <option value="buyer">Buyer</option>
//             <option value="seller">Seller</option>
//           </select>
//         </div>
//         {error && <div style={{ color: 'red' }}>{error}</div>}
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
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
      console.log(response)

      if (response.data.success) {
        // Store JWT token in localStorage
        localStorage.setItem('token', response.data.token);

        // Redirect based on role
        if (response.data.user.role === 'Admin') {
          history('/Admin');
        } else if (response.data.user.role === 'Buyer') {
          history('/Buyer');
        } else if (response.data.user.role === 'Seller') {
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
