import React from 'react';
import { Layout1 } from './layouts';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/main';
import LoginPage from './pages/login';
import { AuthProvider } from './auth/AuthProvider';
import AuthGuard from './auth/AuthGuard';

const App: React.FC = () => {

  return (
    <AuthProvider>
      <Layout1>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />

            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route path="/" element={<MainPage />} />
            </Route>
          </Routes>
        </Router>
      </Layout1>
    </AuthProvider>
  );
};

export default App;