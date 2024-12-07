import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const history = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
        role,
      });

      if (response.data.success) {
        const userId = response.data.user.userId;
        const userRole = response.data.user.role;

        document.cookie = `userId=${encodeURIComponent(
          userId
        )}; path=/; max-age=3600; Secure; SameSite=Strict`;
        document.cookie = `userRole=${encodeURIComponent(
          userRole
        )}; path=/; max-age=3600; Secure; SameSite=Strict`;

        if (userRole === "Admin") {
          history("/Admin");
        } else if (userRole === "Buyer") {
          history("/Buyer");
        } else if (userRole === "Seller") {
          history("/seller-dashboard");
        }
      } else {
        setError(response.data.message || "Invalid credentials or role");
      }
    } catch (err) {
      setError("Error during login. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Role:
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
            </select>
          </div>
          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
