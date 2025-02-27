// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;