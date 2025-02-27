// frontend/src/pages/Profile/Profile.js
import React, { useState, useEffect } from "react";
import { User, Edit2, Trash2, Upload, Clock, BarChart2, Loader } from 'react-feather';
import NavBar from "../../components/NavBar/Navbar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("User Name");
  const [email, setEmail] = useState("user@example.com");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loginHistory, setLoginHistory] = useState([
    { date: "2023-11-01 10:00 AM", ip: "192.168.1.1" },
    { date: "2023-11-02 02:30 PM", ip: "192.168.1.2" },
  ]);
  const [noteStats, setNoteStats] = useState({
    totalNotes: 15,
    archivedNotes: 5,
    averageLength: "150 chars",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    setLoading(true);
    setTimeout(() => {
      setUser({
        name: "User Name",
        email: "user@example.com",
        createdAt: new Date().toLocaleDateString(),
      });
      setLoading(false);
    }, 500);
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfilePhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setUser({ ...user, name, email });
      setIsEditing(false);
      setError(null);
      setLoading(false);
    }, 500);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      setLoading(true);
      setTimeout(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
        setLoading(false);
      }, 500);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex justify-center items-center"><Loader size={40} className="text-purple-600 animate-spin" /></div>;
  if (!user) return <div className="min-h-screen bg-black flex justify-center items-center"><p className="text-white">Loading...</p></div>;

  return (
    <NavBar>
      <div className="min-h-screen bg-black">
        <div className="container mx-auto max-w-7xl p-6">
          <div className="bg-gray-950 rounded-xl shadow-lg p-6 border border-purple-800">
            <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-300 rounded-lg">
                {error}
              </div>
            )}

            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={profilePhoto || "https://via.placeholder.com/80?text=Profile"} // Imagem padrão
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-2 border-purple-600"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload size={16} className="absolute bottom-2 right-2 text-purple-600 bg-gray-900 p-1 rounded-full border border-purple-600" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Name: {user.name}</p>
                    <p className="text-gray-300">Email: {user.email}</p>
                    <p className="text-gray-300">Joined: {user.createdAt}</p>
                  </div>
                </div>

                {/* Login History */}
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">Login History</h2>
                  {loginHistory.map((entry, index) => (
                    <p key={index} className="text-gray-300">
                      {entry.date} - IP: {entry.ip}
                    </p>
                  ))}
                </div>

                {/* Note Statistics */}
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">Note Statistics</h2>
                  <p className="text-gray-300">Total Notes: {noteStats.totalNotes}</p>
                  <p className="text-gray-300">Archived Notes: {noteStats.archivedNotes}</p>
                  <p className="text-gray-300">Average Note Length: {noteStats.averageLength}</p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                >
                  <Edit2 size={18} className="mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors flex items-center"
                  disabled={loading}
                >
                  {loading ? <Loader size={18} className="animate-spin mr-2" /> : <Trash2 size={18} className="mr-2" />}
                  Delete Account
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Name"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Email"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                    disabled={loading}
                  >
                    {loading ? <Loader size={18} className="animate-spin mr-2" /> : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </NavBar>
  );
};

export default Profile;