// frontend/src/pages/Notes/Notes.js
import React, { useState } from "react";
import { apiRequest } from "../../utils/api";
import { Edit, Trash2, Archive, Plus, X } from 'react-feather';

const Notes = ({ notes, searchQuery, onSearch, onAddNote, onEditNote, onDeleteNote, onArchiveToggle, error, setError }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (title.trim() === "" || content.trim() === "") {
      setError("Title and content are required");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const newNote = await apiRequest('/notes', 'POST', { title, content, isArchived: false }, token);
      onAddNote(newNote);
      setTitle("");
      setContent("");
      setError("");
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to add note");
      console.error('Add note error:', err);
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

  const handleEditClick = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsModalOpen(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (title.trim() === "" || content.trim() === "") {
      setError("Title and content are required");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const updatedNote = await apiRequest(
        `/notes/${editingNote._id}`,
        'PUT',
        { title, content, isArchived: editingNote.isArchived || false },
        token
      );
      onEditNote(updatedNote);
      setTitle("");
      setContent("");
      setEditingNote(null);
      setError("");
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to update note");
      console.error('Edit note error:', err);
    }
  };

  const handleArchiveToggle = async (note) => {
    try {
      const token = localStorage.getItem('token');
      const newIsArchived = true;
      const updatedNote = await apiRequest(
        `/notes/${note._id}`,
        'PUT',
        { title: note.title, content: note.content, isArchived: newIsArchived },
        token
      );
      onArchiveToggle(updatedNote);
    } catch (err) {
      setError("Failed to archive note");
      console.error('Archive toggle error:', err);
    }
  };

  const handleModalClose = () => {
    setTitle("");
    setContent("");
    setEditingNote(null);
    setError("");
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto max-w-7xl p-6">
        <div className="flex justify-between items-center mb-8 bg-gray-950 rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
          <h1 className="text-2xl font-bold text-white">My Notes</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add New Note
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-10 bg-gray-900 rounded-xl shadow-md border border-gray-800">
              {searchQuery
                ? "No notes found matching your search."
                : "No notes yet. Click 'Add New Note' to get started."}
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-purple-900/20 transition-all border border-gray-800 hover:border-purple-800"
              >
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-white mb-2">{note.title}</h3>
                  <p className="text-gray-300 mb-3 max-h-32 overflow-y-auto">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    {note.updatedAt && <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>}
                  </div>
                  <div className="flex justify-end space-x-2 pt-3 border-t border-gray-800">
                    <button
                      onClick={() => handleEditClick(note)}
                      className="text-purple-400 hover:text-purple-300 transition-colors p-2 rounded-md hover:bg-gray-800"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleArchiveToggle(note)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors p-2 rounded-md hover:bg-gray-800"
                      title="Archive"
                    >
                      <Archive size={18} />
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

        {/* Add/Edit Note Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-md border border-purple-800 animate-fadeIn">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingNote ? "Edit Note" : "Add New Note"}
                  </h2>
                  <button
                    onClick={handleModalClose}
                    className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-1 rounded-md hover:bg-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={editingNote ? handleEditSave : handleAddNote} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Note Title"
                      className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Note Content"
                      className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button
                    type="submit"
                    className="w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
                  >
                    {editingNote ? "Save Changes" : "Add Note"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;