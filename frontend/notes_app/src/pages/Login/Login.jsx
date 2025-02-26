// frontend/src/pages/Login/Login.js
import NavBar from "../../components/NavBar/Navbar";
import Passwordinput from "../../components/Input/Passwordinput";
import { validateEmail } from "../../utils/helper";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { apiRequest } from "../../utils/api";
import { Loader } from 'react-feather'; // Instale com: npm install react-feather

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.trim() === "") {
      setError("Password cannot be empty");
      return;
    }
    setLoading(true); // Inicia o loading
    try {
      const data = await apiRequest('/auth/login', 'POST', { email, password });
      localStorage.setItem('token', data.token);
      setError(null);
      window.location.href = '/home';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Finaliza o loading
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-black flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-gray-950 rounded-xl shadow-lg p-6 border border-purple-800">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-6 text-white text-center font-bold">Login</h4>

            <input
              type="text"
              placeholder="Email"
              className="w-full p-3 mb-4 bg-gray-900 text-white rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Passwordinput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-900 text-white rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

            {error && <p className="text-red-400 text-sm pb-2">{error}</p>}

            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center font-medium"
              disabled={loading}
            >
              {loading ? (
                <Loader size={20} className="animate-spin mr-2" />
              ) : (
                "Login"
              )}
            </button>

            <p className="text-sm text-center mt-4 text-gray-400">
              Not registered yet?{" "}
              <Link to="/signup" className="font-medium text-white underline hover:text-purple-400">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;