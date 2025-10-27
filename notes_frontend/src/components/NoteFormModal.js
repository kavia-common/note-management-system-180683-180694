import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
export default function NoteFormModal({ open, onClose, onSubmit, defaultValues }) {
  /**
   * Modal form for creating/updating a note.
   * Validates title as required and shows inline error.
   */
  const [title, setTitle] = useState(defaultValues?.title || '');
  const [content, setContent] = useState(defaultValues?.content || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(defaultValues?.title || '');
      setContent(defaultValues?.content || '');
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues?.title, defaultValues?.content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    onSubmit({ title: title.trim(), content: content });
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Note form">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{defaultValues?.title ? 'Edit Note' : 'Create Note'}</div>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-field">
              <label className="label" htmlFor="note-title">Title</label>
              <input
                id="note-title"
                className="input"
                placeholder="Enter note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              {error && <div className="error">{error}</div>}
            </div>
            <div className="form-field">
              <label className="label" htmlFor="note-content">Content</label>
              <textarea
                id="note-content"
                className="textarea"
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="helper">Optional</div>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{defaultValues?.title ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

NoteFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
};
