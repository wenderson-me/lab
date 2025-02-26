// frontend/src/pages/Archived/Archived.js
import React from "react";
import { apiRequest } from "../../utils/api";
import { Trash2, RefreshCcw } from 'react-feather';

const Archived = ({ notes, searchQuery, onSearch, onUnarchiveNote, onDeleteNote, error, setError }) => {
  const handleUnarchiveNote = async (note) => {
    try {
      const token = localStorage.getItem('token');
      await apiRequest(
        `/notes/${note._id}`,
        'PUT',
        { title: note.title, content: note.content, isArchived: false },
        token
      );
      onUnarchiveNote(note);
    } catch (err) {
      setError("Failed to unarchive note");
      console.error('Unarchive note error:', err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await apiRequest(`/notes/${id}`, 'DELETE', null, token);
      onDeleteNote(id);
    } catch (err) {
      setError("Failed to delete note");
      console.error('Delete note error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto max-w-7xl p-6">
        <div className="flex justify-between items-center mb-8 bg-gray-950 rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
          <h1 className="text-2xl font-bold text-white">Archived Notes</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-10 bg-gray-900 rounded-xl shadow-md border border-gray-800">
              {searchQuery
                ? "No archived notes found matching your search."
                : "No archived notes yet."}
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-purple-900/20 transition-all border border-gray-800 hover:border-purple-800"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">{note.title}</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-900/30 text-purple-300 border border-purple-800">Archived</span>
                  </div>
                  <p className="text-gray-300 mb-3 max-h-32 overflow-y-auto">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    {note.updatedAt && <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>}
                  </div>
                  <div className="flex justify-end space-x-2 pt-3 border-t border-gray-800">
                    <button
                      onClick={() => handleUnarchiveNote(note)}
                      className="text-green-400 hover:text-green-300 transition-colors p-2 rounded-md hover:bg-gray-800"
                      title="Unarchive"
                    >
                      <RefreshCcw size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-md hover:bg-gray-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-800 text-red-300 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Archived;