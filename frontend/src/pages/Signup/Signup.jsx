// frontend/src/pages/Signup/Signup.js
import NavBar from "../../components/NavBar/Navbar";
import Passwordinput from "../../components/Input/Passwordinput";
import { validateEmail } from "../../utils/helper";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { apiRequest } from "../../utils/api";
import { Loader } from 'react-feather';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.trim() === "") {
      setError("Password cannot be empty");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest('/auth/signup', 'POST', { email, password });
      localStorage.setItem('token', data.token);
      setError(null);
      window.location.href = '/home';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-black flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-gray-950 rounded-xl shadow-lg p-6 border border-purple-800">
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl mb-6 text-white text-center font-bold">Sign Up</h4>

            <input
              type="text"
              placeholder="Email"
              className="w-full p-3 mb-4 bg-gray-900 text-white rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Passwordinput
              placeholder="Password"
              className="w-full p-3 mb-4 bg-gray-900 text-white rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Passwordinput
              placeholder="Confirm Password"
              className="w-full p-3 mb-4 bg-gray-900 text-white rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                "Create Account"
              )}
            </button>

            <p className="text-sm text-center mt-4 text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-white underline hover:text-purple-400">
                Login Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;