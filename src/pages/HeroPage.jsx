import { useState } from 'react';
import { motion } from 'framer-motion';
import HamburgerMenu from '../components/layout/HamburgerMenu';
import DropdownDrawer from '../components/layout/DropdownDrawer';

export default function HeroPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background: '#b8d8e8',
      }}
    >
      {/* Brand label */}
      <span
        style={{
          position: 'absolute',
          top: '26px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Playfair Display', serif",
          fontSize: '15px',
          color: 'white',
          letterSpacing: '2px',
          whiteSpace: 'nowrap',
        }}
      >
        TRACKME
      </span>

      {/* Hamburger menu */}
      <HamburgerMenu
        isOpen={menuOpen}
        onToggle={() => setMenuOpen((o) => !o)}
      />

      {/* Dropdown drawer */}
      <DropdownDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* Hero text */}
      <div
        style={{
          position: 'absolute',
          bottom: '48px',
          right: '40px',
          textAlign: 'right',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.92, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: 'clamp(40px, 6vw, 72px)',
            color: 'white',
            lineHeight: 1.1,
          }}
        >
          TRACKME
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.92, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.9 }}
          style={{
            fontSize: '11px',
            letterSpacing: '3px',
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'right',
            marginTop: '6px',
          }}
        >
          YOUR GOALS. YOUR PACE.
        </motion.p>
      </div>
    </div>
  );
}
