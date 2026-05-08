import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import DashboardHome from './pages/DashboardHome';
import RaiseComplaint from './pages/RaiseComplaint';
import MyComplaints from './pages/MyComplaints';
import ComplaintDetail from './pages/ComplaintDetail';
import ManageComplaints from './pages/ManageComplaints';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        } 
      >
        <Route index element={<DashboardHome />} />
        <Route path="raise" element={<RaiseComplaint />} />
        <Route path="my-complaints" element={<MyComplaints />} />
        <Route path="complaint/:id" element={<ComplaintDetail />} />
        {/* Admin Routes */}
        <Route 
          path="manage-complaints" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'staff']}>
              <ManageComplaints />
            </ProtectedRoute>
          } 
        />
        <Route path="manage-staff" element={<div className="text-center p-8">Manage Staff - Coming Soon</div>} />
        <Route path="profile" element={<div className="text-center p-8">Profile Settings - Coming Soon</div>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
