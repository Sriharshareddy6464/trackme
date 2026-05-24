import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import HeroPage from './pages/HeroPage';
import TrackingPage from './pages/TrackingPage';
import WorkingPage from './pages/WorkingPage';
import ProgressPage from './pages/ProgressPage';

function App() {
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
    </BrowserRouter>
  );
}

export default App;
