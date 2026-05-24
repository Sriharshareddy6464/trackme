import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Modal component — scale-in/scale-out overlay with framer-motion.
 *
 * @param {boolean}          isOpen   - Controls visibility
 * @param {function}         onClose  - Called when the modal should close
 * @param {string}           title    - Header title text
 * @param {React.ReactNode}  children - Modal body content
 */
function Modal({ isOpen, onClose, title, children }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const backdropStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const panelStyle = {
    background: 'var(--color-bg-elevated)',
    borderRadius: '10px',
    padding: '24px',
    minWidth: '400px',
    maxWidth: '560px',
    width: '90vw',
    border: '1px solid var(--color-border)',
    position: 'relative',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  };

  const titleStyle = {
    fontFamily: "'Playfair Display', serif",
    fontSize: '16px',
    color: 'var(--color-text-primary)',
    margin: 0,
    fontWeight: 600,
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    fontSize: '20px',
    lineHeight: 1,
    padding: '2px 6px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.15s ease',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={backdropStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          // Close on backdrop click
          onClick={onClose}
        >
          <motion.div
            style={panelStyle}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            // Prevent backdrop click from firing when clicking inside the panel
            onClick={(e) => e.stopPropagation()}
          >
            <div style={headerStyle}>
              <h2 style={titleStyle}>{title}</h2>
              <button
                style={closeButtonStyle}
                onClick={onClose}
                aria-label="Close modal"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
              >
                ×
              </button>
            </div>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
