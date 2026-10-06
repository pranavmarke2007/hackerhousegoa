import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  isDestructive = true,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="420px">
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div 
          style={{ 
            padding: '0.5rem', 
            borderRadius: 'var(--radius-sm)', 
            backgroundColor: isDestructive ? 'var(--danger-subtle)' : 'var(--warning-subtle)',
            color: isDestructive ? 'var(--danger)' : 'var(--warning)',
            flexShrink: 0
          }}
        >
          <AlertTriangle size={22} />
        </div>
        <div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
