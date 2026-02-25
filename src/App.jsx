import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import LandingPage from './components/landing/LandingPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import NewDistill from './components/distill/NewDistill';
import DistillView from './components/distill/DistillView';
import Library from './components/library/Library';
import Collections from './components/collections/Collections';
import Settings from './components/settings/Settings';
import ProtectedRoute from './components/shared/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="new" element={<NewDistill />} />
            <Route path="distill/:id" element={<DistillView />} />
            <Route path="library" element={<Library />} />
            <Route path="collections" element={<Collections />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#18181B',
            color: '#FAFAFA',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: { primary: '#34D399', secondary: '#18181B' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#18181B' },
          },
        }}
      />
    </AuthProvider>
  );
}
