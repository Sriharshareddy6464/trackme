import { motion } from 'framer-motion';
import { Menu, Target, Kanban, BarChart2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Tracking', icon: Target, path: '/tracking' },
  { label: 'Working', icon: Kanban, path: '/working' },
  { label: 'Progress', icon: BarChart2, path: '/progress' },
];

export default function Drawer({ isCollapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.nav
      animate={{ width: isCollapsed ? 56 : 220 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      style={{
        background: '#0f0f12',
        height: '100vh',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRight: '1px solid var(--color-border)',
      }}
      aria-label="Side navigation"
    >
      {/* Hamburger toggle */}
      <button
        onClick={onToggle}
        aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          padding: '16px',
          color: 'var(--color-text-secondary)',
          transition: 'color 0.15s',
        }}
      >
        <Menu size={18} />
      </button>

      {/* Nav items */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <li key={path}>
              <button
                onClick={() => navigate(path)}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  width: '100%',
                  color: isActive
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-secondary)',
                  fontSize: '13px',
                  transition: 'background 0.15s',
                  background: isActive
                    ? 'rgba(127,119,221,0.08)'
                    : 'transparent',
                  borderLeft: isActive
                    ? '3px solid #7F77DD'
                    : '3px solid transparent',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background =
                      'rgba(255,255,255,0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                {!isCollapsed && <span>{label}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
