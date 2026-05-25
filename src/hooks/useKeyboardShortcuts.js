import { useEffect } from 'react';

/**
 * Attaches global keyboard shortcuts to the document.
 *
 * @param {Object} options
 * @param {Function} options.onNewItem     - Called when N is pressed (not in an input/textarea)
 * @param {Function} options.onCloseModal  - Called when Escape is pressed
 * @param {Function} options.onOpenSearch  - Called when Cmd+K or Ctrl+K is pressed
 */
export function useKeyboardShortcuts({ onNewItem, onCloseModal, onOpenSearch } = {}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isEditable =
        tag === 'input' ||
        tag === 'textarea' ||
        document.activeElement?.isContentEditable;

      // Cmd+K / Ctrl+K — open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch?.();
        return;
      }

      // Escape — close modal (always fires)
      if (e.key === 'Escape') {
        onCloseModal?.();
        return;
      }

      // N — new item (only when not in an input/textarea/contenteditable)
      if (e.key === 'n' || e.key === 'N') {
        if (!isEditable) {
          onNewItem?.();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNewItem, onCloseModal, onOpenSearch]);
}
