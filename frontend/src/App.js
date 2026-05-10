import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import GlobalStyles from './styles/GlobalStyles';
import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px;
  background: #f0f4f8;
  min-height: 100vh;
  padding: 30px;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const AuthLayout = styled.div`
  min-height: 100vh;
  width: 100%;
`;

const Pages = {
  Login: React.lazy(() => import('./pages/Login')),
  Register: React.lazy(() => import('./pages/Register')),
  Dashboard: React.lazy(() => import('./pages/Dashboard')),
  Projects: React.lazy(() => import('./pages/Projects')),
  ProjectDetail: React.lazy(() => import('./pages/ProjectDetail')),
  Tasks: React.lazy(() => import('./pages/Tasks')),
  Team: React.lazy(() => import('./pages/Team')),
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#093c5d',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <GlobalStyles />
      <Router>
        <Layout>
          {user && <Sidebar />}
          {user ? (
            <MainContent>
              <React.Suspense fallback={<div style={{ padding: '20px' }}>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Pages.Dashboard />} />
                  <Route path="/projects" element={<Pages.Projects />} />
                  <Route path="/projects/:id" element={<Pages.ProjectDetail />} />
                  <Route path="/tasks" element={<Pages.Tasks />} />
                  <Route path="/team" element={<Pages.Team />} />
                </Routes>
              </React.Suspense>
            </MainContent>
          ) : (
            <AuthLayout>
              <React.Suspense fallback={<div style={{ padding: '20px' }}>Loading...</div>}>
                <Routes>
                  <Route path="/login" element={<Pages.Login />} />
                  <Route path="/register" element={<Pages.Register />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </React.Suspense>
            </AuthLayout>
          )}
        </Layout>
      </Router>
    </>
  );
}

export default App;