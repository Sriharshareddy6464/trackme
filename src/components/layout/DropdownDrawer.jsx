import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Tracking', path: '/tracking' },
  { label: 'Working', path: '/working' },
  { label: 'Progress', path: '/progress' },
];

export default function DropdownDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleItemClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      role="menu"
      aria-hidden={!isOpen}
      style={{
        position: 'absolute',
        top: '64px',
        left: '22px',
        zIndex: 99,
        width: isOpen ? '160px' : '36px',
        maxHeight: isOpen ? '200px' : '0',
        opacity: isOpen ? 1 : 0,
        overflow: 'hidden',
        pointerEvents: isOpen ? 'auto' : 'none',
        background: 'white',
        borderRadius: '6px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        transition:
          'width 0.28s cubic-bezier(0.4,0,0.2,1), max-height 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease',
      }}
    >
      {NAV_ITEMS.map((item, index) => (
        <button
          key={item.path}
          role="menuitem"
          onClick={() => handleItemClick(item.path)}
          style={{
            padding: '13px 18px',
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: '13px',
            color: '#1a1a2e',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            textAlign: 'left',
            background: 'transparent',
            border: 'none',
            borderBottom:
              index < NAV_ITEMS.length - 1
                ? '0.5px solid rgba(0,0,0,0.06)'
                : 'none',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f0f6fa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
