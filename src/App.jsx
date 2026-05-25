import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import GlobalSearch from './components/layout/GlobalSearch';
import HeroPage from './pages/HeroPage';
import TrackingPage from './pages/TrackingPage';
import WorkingPage from './pages/WorkingPage';
import ProgressPage from './pages/ProgressPage';
import useUIStore from './store/useUIStore';

function App() {
  const isSearchOpen = useUIStore((s) => s.isSearchOpen);
  const closeSearch = useUIStore((s) => s.closeSearch);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route
          path="/tracking"
          element={
            <AppShell>
              <TrackingPage />
            </AppShell>
          }
        />
        <Route
          path="/working"
          element={
            <AppShell>
              <WorkingPage />
            </AppShell>
          }
        />
        <Route
          path="/progress"
          element={
            <AppShell>
              <ProgressPage />
            </AppShell>
          }
        />
      </Routes>

      {/* Global search overlay — rendered outside Routes so it works on all pages */}
      <GlobalSearch isOpen={isSearchOpen} onClose={closeSearch} />
    </BrowserRouter>
  );
}

export default App;
