import React from 'react';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
export default function DeleteConfirmModal({ open, onCancel, onConfirm, noteTitle }) {
  /** Confirmation dialog for deleting a note */
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirm delete">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Delete Note</div>
          <button className="btn btn-ghost" onClick={onCancel} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <p>
            Are you sure you want to delete
            {' '}
            <strong>{noteTitle || 'this note'}</strong>
            ?
          </p>
          <p className="helper">This action cannot be undone.</p>
        </div>
        <div className="modal-actions">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

DeleteConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  noteTitle: PropTypes.string,
};
