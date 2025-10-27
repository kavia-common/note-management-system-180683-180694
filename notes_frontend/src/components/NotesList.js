import React from 'react';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
export default function NotesList({ notes, onEdit, onDelete }) {
  /** Renders a responsive grid of note cards */
  return (
    <section className="notes-grid" aria-label="Notes list">
      {notes.map((n) => (
        <article className="note-card" key={n.id} aria-label={`Note ${n.title || 'Untitled'}`}>
          <h3 className="note-title">{n.title || 'Untitled'}</h3>
          {n.content ? (
            <p className="note-content">{n.content}</p>
          ) : (
            <p className="note-content" style={{ fontStyle: 'italic' }}>No content</p>
          )}
          <div className="note-actions">
            <button className="btn" onClick={() => onEdit(n)} aria-label={`Edit ${n.title || 'note'}`}>Edit</button>
            <button className="btn btn-danger" onClick={() => onDelete(n)} aria-label={`Delete ${n.title || 'note'}`}>Delete</button>
          </div>
        </article>
      ))}
    </section>
  );
}

NotesList.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
