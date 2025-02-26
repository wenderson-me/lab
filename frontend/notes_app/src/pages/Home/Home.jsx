// frontend/src/pages/Home/Home.js
import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/Navbar";
import Notes from "../Notes/Notes";
import Archived from "../Archived/Archived";
import { apiRequest } from "../../utils/api";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("notes");

  const fetchNotes = async (query = "") => {
    try {
      console.log('Fetching notes with query:', query);
      const token = localStorage.getItem('token');
      const data = await apiRequest(`/notes?search=${encodeURIComponent(query)}`, 'GET', null, token);
      console.log('Notes received:', data);
      setNotes(data);
      setError("");
    } catch (err) {
      console.error('Fetch error:', err);
      setError("Failed to load notes");
      setNotes([]);
    }
  };

  useEffect(() => {
    fetchNotes(searchQuery);
  }, [searchQuery]);

  const handleSearch = (query) => {
    console.log('Search query updated to:', query);
    setSearchQuery(query);
  };

  return (
    <NavBar onSearch={handleSearch} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "notes" ? (
        <Notes
          notes={notes.filter(note => !note.isArchived)}
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onAddNote={(newNote) => setNotes([...notes, newNote])}
          onEditNote={(updatedNote) => setNotes(notes.map(note => note._id === updatedNote._id ? updatedNote : note))}
          onDeleteNote={(noteId) => setNotes(notes.filter(note => note._id !== noteId))}
          onArchiveToggle={(note) => {
            const newIsArchived = true;
            setNotes(notes.map(n => n._id === note._id ? { ...n, isArchived: newIsArchived } : n));
            const token = localStorage.getItem('token');
            apiRequest(
              `/notes/${note._id}`,
              'PUT',
              { title: note.title, content: note.content, isArchived: newIsArchived },
              token
            ).catch(err => console.error('Archive toggle backend error:', err));
          }}
          error={error}
          setError={setError}
        />
      ) : (
        <Archived
          notes={notes.filter(note => note.isArchived)}
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onUnarchiveNote={(note) => {
            const newIsArchived = false;
            setNotes(notes.map(n => n._id === note._id ? { ...n, isArchived: newIsArchived } : n));
            const token = localStorage.getItem('token');
            apiRequest(
              `/notes/${note._id}`,
              'PUT',
              { title: note.title, content: note.content, isArchived: newIsArchived },
              token
            ).catch(err => console.error('Unarchive toggle backend error:', err));
          }}
          onDeleteNote={(noteId) => {
            setNotes(notes.filter(note => note._id !== noteId));
            const token = localStorage.getItem('token');
            apiRequest(`/notes/${noteId}`, 'DELETE', null, token)
              .catch(err => console.error('Delete note backend error:', err));
          }}
          error={error}
          setError={setError}
        />
      )}
    </NavBar>
  );
};

export default Home;