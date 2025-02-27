// frontend/src/pages/Settings/Settings.js
import React, { useState, useEffect } from "react";
import { Moon, Sun, Bell, Info, Download, Globe, ExternalLink, Loader } from 'react-feather';
import NavBar from "../../components/NavBar/Navbar";

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: false,
    language: 'en',
    externalApi: 'Not connected',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSettings({
        theme: localStorage.getItem('theme') || 'dark',
        notifications: localStorage.getItem('notifications') === 'true',
        language: localStorage.getItem('language') || 'en',
        externalApi: 'Not connected',
      });
      document.body.className = `min-h-screen ${settings.theme === 'dark' ? 'bg-black' : 'bg-white'}`;
      setLoading(false);
    }, 500);
  }, []);

  const handleUpdateSettings = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('theme', settings.theme);
      localStorage.setItem('notifications', settings.notifications);
      localStorage.setItem('language', settings.language);
      document.body.className = `min-h-screen ${settings.theme === 'dark' ? 'bg-black' : 'bg-white'}`;
      setError(null);
      setLoading(false);
    }, 500);
  };

  const handleExportNotes = () => {

    const notesData = JSON.stringify({ notes: [] }, null, 2);
    const blob = new Blob([notesData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'notes_export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleConnectExternalApi = () => {
    setLoading(true);
    setTimeout(() => {
      setSettings({ ...settings, externalApi: 'Connected to Dummy API' });
      setError(null);
      setLoading(false);
    }, 500);
  };

  if (loading) return <div className="min-h-screen bg-black flex justify-center items-center"><Loader size={40} className="text-purple-600 animate-spin" /></div>;

  return (
    <NavBar>
      <div className="min-h-screen bg-black">
        <div className="container mx-auto max-w-7xl p-6">
          <div className="bg-gray-950 rounded-xl shadow-lg p-6 border border-purple-800">
            <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-300 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300">Theme</span>
                  {settings.theme === 'dark' ? <Moon size={20} className="text-purple-600" /> : <Sun size={20} className="text-yellow-500" />}
                </div>
                <button
                  onClick={() => setSettings({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' })}
                  className="bg-purple-700 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Switch to {settings.theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>

              {/* Notifications Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300">Notifications</span>
                  <Bell size={20} className={settings.notifications ? 'text-purple-600' : 'text-gray-500'} />
                </div>
                <button
                  onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                  className="bg-purple-700 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  {settings.notifications ? 'Disable' : 'Enable'}
                </button>
              </div>

              {/* Language Setting */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300">Language</span>
                  <Globe size={20} className="text-purple-600" />
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>

              {/* Export Notes */}
              <button
                onClick={handleExportNotes}
                className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center"
              >
                <Download size={18} className="mr-2" />
                Export Notes
              </button>

              {/* External API Integration (Simulated) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300">External API</span>
                  <ExternalLink size={20} className="text-purple-600" />
                </div>
                <button
                  onClick={handleConnectExternalApi}
                  className="bg-purple-700 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                  disabled={loading}
                >
                  {loading ? <Loader size={18} className="animate-spin mr-2" /> : "Connect"}
                </button>
              </div>
              <p className="text-gray-300">Status: {settings.externalApi}</p>

              <button
                onClick={handleUpdateSettings}
                className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                disabled={loading}
              >
                {loading ? <Loader size={18} className="animate-spin mr-2" /> : "Save Settings"}
              </button>

              {/* About */}
              <div className="pt-4 border-t border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                <p className="text-gray-300">
                  Notes App v1.0 - Developed by [Seu Nome] | Contact: seu.email@example.com | GitHub: https://github.com/seu-usuario
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavBar>
  );
};

export default Settings;