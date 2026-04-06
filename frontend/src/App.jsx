import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardCoordinator from './pages/DashboardCoordinator';
import DashboardInstructor from './pages/DashboardInstructor';
import ProposeWorkshop from './pages/ProposeWorkshop';
import WorkshopTypeList from './pages/WorkshopTypeList';
import WorkshopDetail from './pages/WorkshopDetail';
import ActivationPage from './pages/ActivationPage';

const ProtectedRoute = ({ children, instructorOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (instructorOnly && !user.is_instructor) return <Navigate to="/status" />;
  return children;
};

const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  return user.is_instructor ? <Navigate to="/dashboard" /> : <Navigate to="/status" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/activation" element={<ActivationPage />} />
            
            <Route path="/" element={<HomeRedirect />} />
            
            <Route path="/status" element={
              <ProtectedRoute>
                <DashboardCoordinator />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute instructorOnly>
                <DashboardInstructor />
              </ProtectedRoute>
            } />

            <Route path="/propose" element={
              <ProtectedRoute>
                <ProposeWorkshop />
              </ProtectedRoute>
            } />

            <Route path="/types" element={<WorkshopTypeList />} />
            <Route path="/workshops/:id" element={
               <ProtectedRoute>
                 <WorkshopDetail />
               </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
