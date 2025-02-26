// frontend/src/pages/ArchivedNotes/ArchivedNotes.js
import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/Navbar";
import { apiRequest } from "../../utils/api";

const ArchivedNotes = () => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const fetchArchivedNotes = async (query = "") => {
    try {
      console.log('Fetching archived notes with query:', query);
      const token = localStorage.getItem('token');
      const data = await apiRequest(`/notes?search=${encodeURIComponent(query)}&archived=true`, 'GET', null, token);
      console.log('Archived notes received:', data);
      setNotes(data);
      setError("");
    } catch (err) {
      console.error('Fetch error:', err);
      setError("Failed to load archived notes");
      setNotes([]);
    }
  };

  useEffect(() => {
    fetchArchivedNotes(searchQuery);
  }, [searchQuery]);

  const handleSearch = (query) => {
    console.log('Search query updated to:', query);
    setSearchQuery(query);
  };

  const handleUnarchiveNote = async (note) => {
    try {
      const token = localStorage.getItem('token');
      await apiRequest(
        `/notes/${note._id}`,
        'PUT',
        { title: note.title, content: note.content, isArchived: false },
        token
      );
      fetchArchivedNotes(searchQuery); // Refaz a busca após desarquivar
    } catch (err) {
      setError("Failed to unarchive note");
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await apiRequest(`/notes/${id}`, 'DELETE', null, token);
      fetchArchivedNotes(searchQuery); // Refaz a busca após deletar
    } catch (err) {
      setError("Failed to delete note");
    }
  };

  return (
    <>
      <NavBar onSearch={handleSearch} />
      <div className="min-h-screen bg-gray-900 px-4 py-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8 bg-gray-800 p-4 rounded-xl shadow-lg">
            <h1 className="text-2xl font-semibold text-white">Archived Notes</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-8 bg-gray-700 rounded-xl shadow-md">
                {searchQuery
                  ? "No archived notes found matching your search."
                  : "No archived notes yet."}
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{note.title}</h3>
                    <p className="text-gray-300 mb-4 max-h-32 overflow-y-auto">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      {note.updatedAt && <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>}
                    </div>
                    <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-600">
                      <button
                        onClick={() => handleUnarchiveNote(note)}
                        className="text-green-400 hover:text-green-600 transition-colors"
                      >
                        Unarchive
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {error && (
            <p className="text-red-400 text-center mt-4">{error}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ArchivedNotes;