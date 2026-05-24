import { useState } from 'react';

export default function HamburgerMenu({ isOpen, onToggle }) {
  const [isHovered, setIsHovered] = useState(false);

  const showActive = isOpen || isHovered;

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      style={{
        position: 'absolute',
        top: '22px',
        left: '22px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        width: '36px',
        height: '36px',
        borderRadius: '4px',
        background: showActive ? 'white' : 'transparent',
        transition: 'background 0.18s ease',
        padding: 0,
        cursor: 'pointer',
        border: 'none',
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            display: 'block',
            width: '22px',
            height: '2px',
            background: showActive ? '#1a1a1a' : 'white',
            borderRadius: '1px',
            transition: 'background 0.18s ease',
          }}
        />
      ))}
    </button>
  );
}
