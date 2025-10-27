import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import './index.css';
import { getNotes, createNote, updateNote, deleteNote } from './api';
import NotesList from './components/NotesList';
import NoteFormModal from './components/NoteFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

// PUBLIC_INTERFACE
function App() {
  /**
   * This is the main app for the Notes application.
   * It manages global state for notes, UI modals, loading status, and toasts.
   * It connects to the backend via the fetch-based client in src/api.js
   */
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialError, setInitialError] = useState('');
  const [activeNote, setActiveNote] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

  const openToast = useCallback((message, type = 'info') => {
    setToast({ open: true, message, type });
    // auto-hide toast after 3 seconds
    setTimeout(() => setToast({ open: false, message: '', type: 'info' }), 3000);
  }, []);

  const refreshNotes = useCallback(async () => {
    setLoading(true);
    setInitialError('');
    try {
      const data = await getNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setInitialError(err?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const onCreate = () => {
    setActiveNote(null);
    setIsFormOpen(true);
  };

  const onEdit = (note) => {
    setActiveNote(note);
    setIsFormOpen(true);
  };

  const onDelete = (note) => {
    setActiveNote(note);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (activeNote && activeNote.id != null) {
        const updated = await updateNote(activeNote.id, values);
        setNotes((prev) => prev.map((n) => (n.id === activeNote.id ? updated : n)));
        openToast('Note updated', 'success');
      } else {
        const created = await createNote(values);
        setNotes((prev) => [created, ...prev]);
        openToast('Note created', 'success');
      }
      setIsFormOpen(false);
      setActiveNote(null);
    } catch (err) {
      openToast(err?.message || 'Failed to save note', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeNote) return;
    try {
      await deleteNote(activeNote.id);
      setNotes((prev) => prev.filter((n) => n.id !== activeNote.id));
      openToast('Note deleted', 'success');
    } catch (err) {
      openToast(err?.message || 'Failed to delete note', 'error');
    } finally {
      setIsDeleteOpen(false);
      setActiveNote(null);
    }
  };

  const isEmpty = !loading && !initialError && notes.length === 0;

  return (
    <div className="App ocean-app">
      {/* Top Bar */}
      <nav className="topbar">
        <div className="topbar-left">
          <div className="brand-badge">🗒️</div>
          <div className="brand">
            <span className="brand-title">Ocean Notes</span>
            <span className="brand-subtitle">Professional</span>
          </div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={onCreate}>
            + New Note
          </button>
        </div>
      </nav>

      {/* Content Container */}
      <main className="container">
        {/* Status and Errors */}
        {loading && (
          <div className="status-box">
            <div className="spinner" aria-label="Loading" />
            <div className="status-text">Loading notes...</div>
          </div>
        )}

        {initialError && (
          <div className="alert alert-error" role="alert">
            <span className="alert-title">Error</span>
            <span className="alert-message">{initialError}</span>
            <button className="btn btn-ghost" onClick={refreshNotes}>
              Retry
            </button>
          </div>
        )}

        {isEmpty && (
          <div className="empty-state">
            <div className="empty-icon">🌊</div>
            <h2>No notes yet</h2>
            <p>Create your first note to get started.</p>
            <button className="btn btn-primary" onClick={onCreate}>
              Create Note
            </button>
          </div>
        )}

        {!loading && !initialError && notes.length > 0 && (
          <NotesList notes={notes} onEdit={onEdit} onDelete={onDelete} />
        )}
      </main>

      {/* Modals */}
      <NoteFormModal
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setActiveNote(null);
        }}
        onSubmit={handleFormSubmit}
        defaultValues={
          activeNote
            ? { title: activeNote.title || '', content: activeNote.content || '' }
            : { title: '', content: '' }
        }
      />

      <DeleteConfirmModal
        open={isDeleteOpen}
        onCancel={() => {
          setIsDeleteOpen(false);
          setActiveNote(null);
        }}
        onConfirm={handleDeleteConfirm}
        noteTitle={activeNote?.title}
      />

      {/* Toast */}
      {toast.open && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;
