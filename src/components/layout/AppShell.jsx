import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Drawer from './Drawer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useGoalCompletionConfetti } from '@/hooks/useGoalCompletionConfetti';
import useUIStore from '@/store/useUIStore';

export default function AppShell({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const openSearch = useUIStore((s) => s.openSearch);

  // Activate confetti on goal completion
  useGoalCompletionConfetti();

  // Global keyboard shortcuts active on all board pages
  useKeyboardShortcuts({
    onOpenSearch: openSearch,
    // onNewItem and onCloseModal can be wired per-page if needed;
    // leaving them undefined here means they're no-ops at the shell level.
  });

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: 'var(--color-bg-surface)',
        overflow: 'hidden',
      }}
    >
      <Drawer
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((c) => !c)}
      />

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Ghost watermark */}
        <span
          aria-hidden="true"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '28px',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '4px',
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
          }}
        >
          TRACKME
        </span>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
